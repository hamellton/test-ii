import { NextApiResponse } from 'next';
import { AuthorizedRequest, ErrorResponse, HTTPMethod, ZoomUser } from '@utils/types';
import { authenticateMiddleware } from '@utils/authMiddleware'
import { getZoomUser, createZoomUser, getZoomStatus } from '@services/zoom'
import { getUserById } from '@models/user';

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<ZoomUser | ErrorResponse>) => {
  const zoomId = req.query.id;
  if (!zoomId || typeof zoomId !== 'string') {
    return res.status(400).json({ error: 'Bad Request - ID is missing or invalid' });
  }
  try {
    // Non Admin user will only get their own info, admin user can get the info in request
    const param = req.isAdmin ? zoomId : req.userId
    const user = await getUserById(param);
    const zoomUser = await getZoomUser(user!.email)
    return res.status(201).json(zoomUser);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse<String | ErrorResponse>) => {
  // Creates a new user in the II Zoom Account for the user logged in
  // Doesn't need a query param or authenicated other than being logged in to II
  // Handles the case if the user already exists, and still returns a 201
  try {
    const user = await getUserById(req.userId);
    const existsInZoom = await getZoomStatus(user!.email) != 'new'
    if (!existsInZoom) await createZoomUser(user!.email)
    return res.status(201).json('Created');
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<ZoomUser | String | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  } else if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default authenticateMiddleware(handler);
