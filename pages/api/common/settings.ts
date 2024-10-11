import { NextApiResponse } from "next";
import { AuthorizedRequest, HTTPMethod } from "@utils/types";
import { updateAdminNotifications } from "@models/user";

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse<any>) => {
  const { notifyOnCreate, notifyOnUpdate, notifyOnDelete, userId } = req.body;

  if (typeof notifyOnCreate !== "boolean" || typeof notifyOnUpdate !== "boolean" || typeof notifyOnDelete !== "boolean") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const updatedUser = await updateAdminNotifications(userId, notifyOnCreate, notifyOnUpdate, notifyOnDelete);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<any>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
