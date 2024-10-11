import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { accountId } = req.body;

    try {
      await stripe.accounts.del(accountId);
      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
