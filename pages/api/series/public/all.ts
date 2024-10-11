import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse, HTTPMethod } from '@utils/types';
import { getAllSeries } from '@models/series'
import { Series } from '@prisma/client';

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<Series[] | ErrorResponse>) => {
  const series = await getAllSeries()
  if (series) {
    return res.status(200).json(series);
  } else {
    return res.status(404).json({ error: 'Series not found' });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Series[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default handler;
