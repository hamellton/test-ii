import { AuthorizedRequest, ErrorResponse, ExtendedSalon, HTTPMethod } from "@utils/types";
import { NextApiResponse } from "next";
import { getSalonBySlug } from "@models/salon";

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<ExtendedSalon | ErrorResponse>) => {
  // Check for a specific salon by slug (title)
  if (req.query.slug) {
    const salon = await getSalonBySlug(req.query.slug as string);
    if (salon) {
      return res.status(200).json(salon);
    } else {
      return res.status(404).json({ error: "Salon not found" });
    }
  }

  return res.status(404).json({ error: "Salon not found" });
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<ExtendedSalon | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
