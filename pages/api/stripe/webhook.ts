import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { HTTPMethod, StripeSeriesTicketData, StripeTicketData } from "@utils/types";
import { buyPublicTicket } from "@models/ticket";
import { createTip } from "@models/tip";
import { PublicTicket } from "@prisma/client";
import { emailTicketConfirmation, notifyPurchaseEvent, notifyTip } from "@services/email";
import { getStripePaymentFromSessionId } from "@services/stripe";
import { getSalonById } from "@models/salon";
import { canPublicCheckout } from "@utils/frontend-helpers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

// Hypothetical database check - implement this according to your requirements
const checkDatabaseBeforeProcessing = async (ticketInfo: StripeTicketData): Promise<boolean> => {
  const salon = await getSalonById(ticketInfo.salonId);
  return canPublicCheckout(salon!, ticketInfo.attendees);
};

const handleTicketCheckout = async (ticketInfo: StripeTicketData, session: Stripe.Checkout.Session, res: NextApiResponse) => {
  const connectedAccountId = ticketInfo.accountId;
  const shouldProceed = await checkDatabaseBeforeProcessing(ticketInfo);

  if (shouldProceed) {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(
        session.payment_intent as string,
        { stripeAccount: connectedAccountId }
      );
      console.log("PaymentIntent captured successfully", paymentIntent);

      const results = await Promise.allSettled(
        ticketInfo.attendees.map(attendee =>
          buyPublicTicket(attendee.email, attendee.name, ticketInfo.customerEmail, ticketInfo.salonId, ticketInfo.priceId)
        )
      );

      const tickets: PublicTicket[] = results.reduce((acc: PublicTicket[], result) => {
        if (result.status === "fulfilled") {
          acc.push(result.value);
        }
        return acc;
      }, []);
      
      console.log("Created the following tickets: ", tickets);

      await emailTicketConfirmation(tickets[0].salonId, tickets.map(ticket => ticket.email), tickets.map(ticket => ticket.name));
      await notifyPurchaseEvent(ticketInfo, paymentIntent);

      res.json({ received: true, captured: true });
    } catch (error) {
      console.error("Error capturing PaymentIntent:", error);
      res.status(500).send("Error capturing PaymentIntent");
    }
  } else {
    try {
      const cancellation = await stripe.paymentIntents.cancel(
        session.payment_intent as string,
        { stripeAccount: connectedAccountId }
      );
      console.log("PaymentIntent cancelled successfully", cancellation);
      res.json({ received: true, cancelled: true });
    } catch (error) {
      console.error("Error cancelling PaymentIntent:", error);
      res.status(500).send("Error cancelling PaymentIntent");
    }
  }
};

const handleSeriesTicketCheckout = async (seriesTicketInfo: StripeSeriesTicketData, session: Stripe.Checkout.Session, res: NextApiResponse) => {
  const connectedAccountId = seriesTicketInfo.accountId;

  try {
    const paymentIntent = await stripe.paymentIntents.capture(
        session.payment_intent as string,
        { stripeAccount: connectedAccountId }
    );
    console.log("PaymentIntent captured successfully", paymentIntent);

    const ticketPromises = seriesTicketInfo.selectedEpisodes.map(async (episodeId) => {
      const results = await Promise.allSettled(
        seriesTicketInfo.attendees.map(attendee =>
          buyPublicTicket(
            attendee.email,
            attendee.name,
            seriesTicketInfo.customerEmail,
            episodeId,
            "series"
          )
        )
      );

      const tickets: PublicTicket[] = results.reduce((acc: PublicTicket[], result) => {
        if (result.status === "fulfilled") {
          acc.push(result.value);
        }
        return acc;
      }, []);

      console.log(`Created the following tickets for episode ${episodeId}: `, tickets);

      // await emailTicketConfirmation(
      //   tickets[0].salonId,
      //   tickets.map(ticket => ticket.email),
      //   tickets.map(ticket => ticket.name)
      // );

      return tickets;
    });

    const allTickets = await Promise.all(ticketPromises);
    console.log("All tickets created for series: ", allTickets);

    // await notifyPurchaseEvent(seriesTicketInfo, paymentIntent);

    res.json({ received: true, captured: true });
  } catch (error) {
    console.error("Error capturing PaymentIntent:", error);
    res.status(500).send("Error capturing PaymentIntent");
  }
};


const handleTipCheckout = async (hostId: string, session: Stripe.Checkout.Session, res: NextApiResponse) => {
  try {
    if (!session.metadata || !session.metadata.connectedAccountId) {
      return res.status(400).json({ error: "Connected account ID not found in session metadata" });
    }

    const connectedAccountId = session.metadata.connectedAccountId;

    const payment = await getStripePaymentFromSessionId(session.id, connectedAccountId);
    
    if (!payment) {
      return res.status(400).json({ error: "Payment not found" });
    }

    await createTip(session.customer_details!.email as string, hostId, payment.amount / 100, payment.id);

    await notifyTip(payment.id);

    res.json({ received: true, captured: true });
  } catch (error) {
    console.error("Error capturing PaymentIntent:", error);
    res.status(500).send("Error capturing PaymentIntent");
  }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string | undefined;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    console.log(`Webhook Error: ${errorMessage}`);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session!.metadata!;
    console.log("Completed Session:", metadata);
    if ("hostId" in metadata) {
      await handleTipCheckout(metadata.hostId, session, res);
    } else if (metadata.ticketInfo) {
      const ticketInfo = JSON.parse(metadata.ticketInfo) as StripeTicketData;
      await handleTicketCheckout(ticketInfo, session, res);
    } else if (metadata.seriesTicketInfo) {
      const seriesTicketInfo = JSON.parse(metadata.seriesTicketInfo) as StripeSeriesTicketData;
      await handleSeriesTicketCheckout(seriesTicketInfo, session, res);
    } else {
      console.error("Error: Required metadata is missing from the session.");
    }
  } else {
    res.status(400).end();
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
