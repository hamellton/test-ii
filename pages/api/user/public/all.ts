import { ErrorResponse, HTTPMethod, UserPublic } from "@utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllHosts } from "@models/user";

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<UserPublic[] | ErrorResponse>) => {
  const users = await getAllHosts();
  if (users) {
    return res.status(200).json(users);
  } else {
    return res.status(404).json({ error: 'User not found' });
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<UserPublic[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
