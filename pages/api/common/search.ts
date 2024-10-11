import prisma from "@utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPMethod } from "@utils/types";

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const searchTerm = query.searchTerm as string;
  const hostId = query.hostId as string | undefined;

  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  console.log("Search term:", searchTerm);

  try {
    const salons = await prisma.salon.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: "insensitive", // Case insensitive search
        },
        ...(hostId && { hostId }),
      },
      include: {
        series: true,
        coHosts: true,
        tags: true,
      },
    });

    res.status(200).json(salons);
  } catch (error) {
    console.error("Error searching salons:", error);
    res.status(500).json({ error: "Internal Server Error", message: (error as any).message });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
  case HTTPMethod.Get:
    return handleGetRequest(req, res);
  default:
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
