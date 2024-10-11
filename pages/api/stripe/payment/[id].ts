import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, HTTPMethod } from "@utils/types";
import Stripe from "stripe";
import { getStripePaymentFromSessionId } from "@services/stripe";

// Note that the id being provided here is the session id, not the payment id
const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<Stripe.PaymentIntent | ErrorResponse>) => {
  const queryId = req.query.id as string;

  const queryParams = new URLSearchParams(queryId);

  const sessionId = queryParams.get("id");
  const accountId = queryParams.get("accountId");

  if (!sessionId || typeof sessionId !== "string" || !accountId || typeof accountId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID or accountId is missing or invalid" });
  }

  try {
    const payment = await getStripePaymentFromSessionId(sessionId, accountId);
    if (payment) {
      return res.status(200).json(payment);
    } else {
      return res.status(404).json({ error: "Payment not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Stripe.PaymentIntent | String | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get ) {
    return handleGetRequest(req, res);
  } 
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
