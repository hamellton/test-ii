import { NextApiResponse } from 'next';
import { AuthorizedRequest, ErrorResponse, HTTPMethod } from '@utils/types';
import { authenticateMiddleware } from '@utils/authMiddleware';
import { salonsByEmail } from '@models/ticket';
import { Salon } from '@prisma/client';

const getTicketedSalons = async (req: AuthorizedRequest, res: NextApiResponse<Salon[] | ErrorResponse>) => {
  try {
    const ticket = await salonsByEmail(req.body.email);
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error during getting ticketed salons:', error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Salon[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return getTicketedSalons(req, res);
  }
  res.status(405).json({ error: 'Method Not Allowed' });
};

export default authenticateMiddleware(handler);
