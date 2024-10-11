import { ErrorResponse, HTTPMethod } from "@utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getStripeTransactions } from "@services/stripe";
import Stripe from "stripe";

type TransactionResponse = {
  id: string;
  amount: number;
  description?: string;
  created: number;
};

type Transaction = Stripe.BalanceTransaction | Stripe.Charge;

const convertToTransactionResponse = (transaction: Transaction): TransactionResponse => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description ?? undefined,
  created: transaction.created,
});

type ApiResponse = {
  transactions: TransactionResponse[];
  hasMore: boolean;
  nextStartingAfter?: string;
  totalTicketSales: number;
  totalTips: number;
  totalPayout: number;
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<ApiResponse | ErrorResponse>) => {
  try {
    const { accountId, starting_after, limit } = req.query;

    if (!accountId || typeof accountId !== "string") {
      res.status(400).json({ error: "Invalid account ID" });
      return;
    }

    const transactionsLimit = limit ? parseInt(limit as string, 10) : 10;
    const startingAfter = typeof starting_after === "string" ? starting_after : undefined;

    const {
      transactions,
      hasMore,
      nextStartingAfter,
      totalTicketSales,
      totalTips,
      totalPayout,
    } = await getStripeTransactions(accountId, startingAfter, transactionsLimit);

    res.status(200).json({
      transactions: transactions.map((transaction: Transaction) => convertToTransactionResponse(transaction)),
      hasMore,
      nextStartingAfter,
      totalTicketSales,
      totalTips,
      totalPayout,
    });
  } catch (error) {
    console.error("Error in handleGetRequest:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
