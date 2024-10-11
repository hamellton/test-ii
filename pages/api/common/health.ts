import { HTTPMethod } from '@utils/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === HTTPMethod.Get) {
    res.status(200).json({ message: 'Hello World' });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}