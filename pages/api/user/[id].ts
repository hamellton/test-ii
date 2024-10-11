import { NextApiResponse } from 'next';
import { getUserById, deleteUserById } from '@models/user';
import { AuthorizedRequest, ErrorResponse, HTTPMethod } from '@utils/types';
import { authenticateMiddleware } from '@utils/authMiddleware';
import { deleteMemberfulUser } from '@services/memberful';
import { getZoomStatus, deleteZoomUser } from '@services/zoom';
import { User } from '@prisma/client';

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<User | ErrorResponse>) => {
  const userId = req.query.id;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Bad Request - ID is missing or invalid' });
  }
  // Non Admin user will only get their own info, admin user can get the info for the email in the query param
  const param = req.isAdmin ? userId : req.userId
  const user = await getUserById(param);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(404).json({ error: 'User not found' });
};

const handleDeleteRequest = async (req: AuthorizedRequest, res: NextApiResponse<User | ErrorResponse>) => {
  const userId = req.query.id;
  if (!userId || typeof userId !== 'string')
    return res.status(400).json({ error: 'Bad Request - ID is missing or invalid' });
  // if (req.isAdmin != true)
  //   return res.status(403).json({ error: 'You need to be an admin to delete users' });
  const user = await getUserById(userId);
  if (user) {
    if (user.memberfulId) await deleteMemberfulUser(user.memberfulId)
    await deleteUserById(userId as string);
    const existsInZoom = await getZoomStatus(user!.email) != 'new'
    if (existsInZoom) await deleteZoomUser(user.email)
    return res.status(200).json(user);
  }
  return res.status(404).json({ error: 'User not found' });
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<User | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  } else if (req.method === HTTPMethod.Delete) {
    return handleDeleteRequest(req, res);
  }
  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default authenticateMiddleware(handler);
