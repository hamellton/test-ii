import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { name } = req.query;

      if (name && typeof name === "string") {
        const page = await prisma.page.findFirst({
          where: { name },
        });

        if (!page) {
          return res.status(404).json({ error: "Page not found" });
        }

        return res.status(200).json(page);
      } else {
        const pages = await prisma.page.findMany();

        if (pages.length === 0) {
          return res.status(404).json({ error: "No pages found" });
        }

        return res.status(200).json(pages);
      }
      
    } catch (error) {
      console.error("Error fetching pages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
