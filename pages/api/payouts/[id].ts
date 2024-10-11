import { NextApiResponse } from "next";
import { AuthorizedRequest, ErrorResponse, HTTPMethod, Payout } from "@utils/types";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { convertToCSV, getPayoutsForHost } from "@models/ticket";

const getHostPayouts = async (req: AuthorizedRequest, res: NextApiResponse<Payout[] | ErrorResponse>) => {
  const { id } = req.query;
  const { connectedAccountId } = req.query;

  try {
    if (typeof connectedAccountId !== "string") {
      return res.status(400).json({ error: "Connected account ID is required and must be a string" });
    }

    if (typeof id === "string") {
      const payouts = await getPayoutsForHost(id);

      if (req.headers["accept"] === "text/csv") {
        const csv = convertToCSV(payouts);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=payments.csv");
        res.status(200).send(csv as any);
      } else {
        res.status(200).json(payouts);
      }
    } else {
      res.status(400).json({ error: "User ID is required and must be a string" });
    }
  } catch (error) {
    console.error("Error during getting payments:", error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Payout[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return getHostPayouts(req, res);
  }
  res.status(405).json({ error: "Method Not Allowed" });
};

export default authenticateMiddleware(handler);
