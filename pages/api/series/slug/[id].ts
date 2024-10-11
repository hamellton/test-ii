import { getSeriesBySlug } from "@models/series";
import { AuthorizedRequest, ErrorResponse, HTTPMethod } from "@utils/types";
import { NextApiResponse } from "next";
import { Series } from '@prisma/client';

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<Series | ErrorResponse>) => {
  // Check for a specific series by slug (title)
  if (req.query.id) {
    const series = await getSeriesBySlug(req.query.id as string);
    if (series) {
      return res.status(200).json(series);
    } else {
      return res.status(404).json({ error: 'Series not found' });
    }
  }

  return res.status(404).json({ error: 'No slug found' });
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Series | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default handler;
