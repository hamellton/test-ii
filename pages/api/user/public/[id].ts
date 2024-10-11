import { getUserById } from "@models/user";
import { ErrorResponse, HTTPMethod } from "@utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from '@prisma/client';

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<User | ErrorResponse>) => {
  const userId = req.query.id;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Bad Request - ID is missing or invalid' });
  }
  // Non Admin user will only get their own info, admin user can get the info for the email in the query param
  const user = await getUserById(userId);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(404).json({ error: 'User not found' });
};

const handler = async (req: NextApiRequest, res: NextApiResponse<User | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;

