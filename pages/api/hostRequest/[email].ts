import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/db";

const getHostRequestByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;

  try {
    const hostRequest = await prisma.hostRequest.findFirst({
      where: {
        email: String(email),
      },
    });

    if (hostRequest) {
      res.status(200).json({ hasHostRequest: true });
    } else {
      res.status(404).json({ hasHostRequest: false });
    }
  } catch (error) {
    console.error("Error fetching HostRequest by email:", error);
    res.status(500).json({ error: "Failed to fetch HostRequest by email" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return getHostRequestByEmail(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
