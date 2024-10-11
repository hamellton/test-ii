import { NextApiRequest, NextApiResponse } from "next";
import { DataApiRequest, getDataFromServices } from "@models/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await getDataFromServices();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (req.method === "POST") {
    try {
      const { models }: DataApiRequest = req.body;

      if (!Array.isArray(models) || !models.every(model => typeof model === "string")) {
        res.status(400).json({ error: "Invalid input: models must be an array of strings" });
        return;
      }

      const data = await getDataFromServices(models);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as any).message || "Failed to fetch data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
