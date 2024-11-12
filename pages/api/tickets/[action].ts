import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/db";
import Stripe from "stripe";
import { TicketStatus } from "@prisma/client";
import { getSalonsWithPublicTicketsPaginated, updateTicketStatus } from "@models/tickets";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const handleApproveTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ticketId, paymentIntentId } = req.body;

  try {
    const ticketWithSalon = await prisma.publicTicket.findUnique({
      where: { id: ticketId },
      include: { salon: { include: { host: true } } }
    });

    if (!ticketWithSalon) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const connectedAccountId = ticketWithSalon.salon.host.stripeConnectedAccountId;

    const paymentIntent = await stripe.paymentIntents.capture(
      paymentIntentId,
      connectedAccountId 
        ? { stripeAccount: connectedAccountId } 
        : {}
    );

    const result = await updateTicketStatus(
      ticketId, 
      TicketStatus.APPROVED,
      ticketWithSalon.salonId,
      paymentIntentId
    );

    // await sendTicketApprovalEmail(result.ticket, result.salon);

    res.status(200).json({ 
      message: "Ticket approved and payment captured", 
      paymentIntent 
    });
  } catch (error) {
    console.error("Error approving ticket:", error);
    res.status(500).json({ error: "Error approving ticket" });
  }
};

const handleDeclineTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ticketId, paymentIntentId } = req.body;

  try {
    const ticketWithSalon = await prisma.publicTicket.findUnique ({
      where: { id: ticketId },
      include: { salon: { include: { host: true } } }
    });

    if (!ticketWithSalon) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const connectedAccountId = ticketWithSalon.salon.host.stripeConnectedAccountId;

    const paymentIntent = await stripe.paymentIntents.cancel(
      paymentIntentId,
      connectedAccountId 
        ? { stripeAccount: connectedAccountId }
        : {}
    );

    await updateTicketStatus(
      ticketId, 
      TicketStatus.DECLINED,
      ticketWithSalon.salonId,
      paymentIntentId
    );

    // await sendTicketDeclineEmail(result.ticket, result.salon);

    res.status(200).json({ 
      message: "Ticket declined and payment cancelled", 
      paymentIntent 
    });
  } catch (error) {
    console.error("Error declining ticket:", error);
    res.status(500).json({ error: "Error declining ticket" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { action } = req.query;

    if (action === "approve") {
      return handleApproveTicket(req, res);
    } else if (action === "decline") {
      return handleDeclineTicket(req, res);
    } else if (action === "getSalonsWithTickets") {
      const { hostId, page = 1, pageSize = 10 } = req.body;
      try {
        const result = await getSalonsWithPublicTicketsPaginated(
          hostId, 
          Number(page), 
          Number(pageSize)
        );
        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching salons with tickets:", error);
        res.status(500).json({ error: "Failed to fetch salons with tickets" });
      }
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
