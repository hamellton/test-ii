import { NextApiResponse } from "next";
import { AuthorizedRequest, ErrorResponse, HTTPMethod } from "@utils/types";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { emailTicketConfirmation } from "@services/email";
import { buyMemberTicket } from "@models/ticket";
import { MemberTicket } from "@prisma/client";
import { notifyMemberCheckout } from "@services/email";
import { getUserById } from "@models/user";

const memberCheckout = async (req: AuthorizedRequest, res: NextApiResponse<MemberTicket | ErrorResponse>) => {
  const user = await getUserById(req.body.userId);

  try {
    console.log("Request Body:", req.body); // Log to confirm body is received
    const ticket = await buyMemberTicket(req.body.salon.id, req.body.userId);
    await emailTicketConfirmation(req.body.salon.id, [req.body.email], [user?.name || ""]);
    await notifyMemberCheckout(req.body.salon.id, req.body.userId);
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error during member checkout:", error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<MemberTicket | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    return memberCheckout(req, res);
  }
  res.status(405).json({ error: "Method Not Allowed" });
};

export default authenticateMiddleware(handler);
