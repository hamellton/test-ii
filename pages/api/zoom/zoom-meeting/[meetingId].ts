import { getZoomMeetingDetails } from "@services/zoom";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { AuthorizedRequest, ErrorResponse, HTTPMethod } from "@utils/types";
import type { NextApiResponse } from "next";

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const { meetingId } = req.query;

  if (typeof meetingId !== "string") {
    return res.status(400).json({ message: "Invalid meetingId" });
  }
  
  try {
    const meetingDetails = await getZoomMeetingDetails(meetingId);
    res.status(200).json(meetingDetails);
  } catch (error: any) {
    console.error(`Error fetching Zoom meeting details: ${error.message}`);
    res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
  
const handler = async (req: AuthorizedRequest, res: NextApiResponse<any | String | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};
  
export default authenticateMiddleware(handler);
