import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, StripeSession, Attendee, HTTPMethod } from "@utils/types";
import { createTicketCheckoutSession, createTipCheckoutSession, findTipProductAndPrice, createSeriesCheckoutSession } from "@services/stripe";
import { getUserById } from "@models/user";
import { handleNewsletterSubscription } from "@services/mailchimpService";
import { User } from "@prisma/client";

const ticketCheckout = async (req: NextApiRequest, res: NextApiResponse<StripeSession | ErrorResponse>) => {
  try {
    // const multiplier = req.body.user && req.body.user.planName && process.env.NEXT_PUBLIC_DISCOUNT_PLAN_NAME!.split(",").map(name => name.trim()).includes(req.body.user.planName) ? 0.7 : 1;
    // const inputPrice = req.body.salon.publicPrice * 100 * multiplier + getBookingFee(req.body.attendees.length) * 100;
    const host: any = await getUserById(req.body.salon.hostId);
    // const price = await findOrCreatePrice(process.env.TICKET_PRODUCT_ID!, inputPrice);
    const session = await createTicketCheckoutSession(req.body.attendees as Attendee[], req.body.salon.id, req.body.salon.slug, req.body.salon.title, host?.stripeConnectedAccountId || null);

    await handleNewsletterSubscription(req);

    return res.status(200).json({ sessionId: session.id, url: session.url }); // Redirect to the Stripe Checkout page
  } catch (error: unknown) {
    console.error("Error in Stripe checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

const seriesCheckout = async (req: NextApiRequest, res: NextApiResponse<StripeSession | ErrorResponse>) => {
  const { attendees, bookingFee, selectedEpisodes, hostId, slug, seriesTitle } = req.body;
  const host: User | null = await getUserById(hostId);

  if (!attendees || !selectedEpisodes || !host || !host?.stripeConnectedAccountId || !slug || !seriesTitle) {
    return res.status(400).json({ error: "Missing required information." });
  }

  try {
    const bookingFeeInCents = bookingFee * 100;

    const session = await createSeriesCheckoutSession(
      attendees,
      selectedEpisodes,
      host?.stripeConnectedAccountId,
      bookingFeeInCents,
      slug,
      seriesTitle
    );

    await handleNewsletterSubscription(req);

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("Error in Stripe checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

const tipCheckout = async (req: NextApiRequest, res: NextApiResponse<StripeSession | ErrorResponse>) => {
  try {
    const host = await getUserById(req.body.hostId);

    if (!host?.stripeConnectedAccountId) {
      return res.status(400).json({ error: "Host does not have a connected Stripe account." });
    }

    const priceId = await findTipProductAndPrice(host.stripeConnectedAccountId, req.body.amount);

    const session = await createTipCheckoutSession(req.body.url, req.body.hostId, priceId, host.stripeConnectedAccountId);
    
    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("Error in Stripe tip checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<StripeSession | String | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    if (req.query.tip === "true") {
      return await tipCheckout(req, res);
    } else if (req.query.series === "true") {
      return seriesCheckout(req, res);
    } else {
      return await ticketCheckout(req, res);
    }
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
