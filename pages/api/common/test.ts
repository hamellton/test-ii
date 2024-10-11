import { NextApiResponse } from 'next';
import { getSalonById } from '@models/salon'; // Adjust the import path to where your Prisma queries are located
import { AuthorizedRequest, HTTPMethod } from '@utils/types'; // Adjust the import path according to your project structure

const createLegacySalon = async (req: AuthorizedRequest, res: NextApiResponse<any>) => {
  const salonId = req.body.id;
  try {
    const salon = await getSalonById(salonId as string);
    res.status(200).json(salon);
  } catch (error) {
    console.error('Error clearing member attendees:', error);
    res.status(500).json({ error: 'Failed to clear member attendees' });
  }
}

const handler = async (req: AuthorizedRequest, res: NextApiResponse<any>) => {
  if (req.method === HTTPMethod.Post) {
    return createLegacySalon(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default handler
