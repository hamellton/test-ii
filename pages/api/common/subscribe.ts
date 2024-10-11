import { addSubscriberToList, checkSubscriberStatus, removeSubscriberFromList } from "@services/mailchimpService";
import { NextApiRequest, NextApiResponse } from "next";

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, firstName, lastName } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  try {
    const response = await addSubscriberToList(email, firstName, lastName);
  
    if (response.existing) {
      return res.status(200).json({ status: "exists", message: "Subscriber already exists and is subscribed", response });
    }
  
    if (response.message === "Subscriber was unsubscribed but has been resubscribed") {
      return res.status(200).json({ status: "resubscribed", message: "Subscriber was unsubscribed but has been resubscribed", response });
    }
  
    return res.status(200).json({ status: "success", message: "Successfully added to the newsletter", response });
  } catch (error: any) {
    console.error("Error adding subscriber to Mailchimp:", error);
    return res.status(500).json({ status: "error", error: "Internal Server Error", message: error.message });
  }
};  

const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  try {
    const response = await removeSubscriberFromList(email);
    return res.status(200).json({ status: "success", message: "Successfully unsubscribed", response });
  } catch (error: any) {
    console.error("Error removing subscriber:", error);
    res.status(500).json({ status: "error", error: "Internal Server Error", message: error.message });
  }
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;
  
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required and must be a string" });
  }
  
  try {
    const response = await checkSubscriberStatus(email);
    return res.status(200).json({ status: response.status, found: response.found });
  } catch (error: any) {
    console.error("Error checking subscriber status:", error);
    res.status(500).json({ status: "error", error: "Internal Server Error", message: error.message });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
  case "POST":
    return handlePostRequest(req, res);
  case "DELETE":
    return handleDeleteRequest(req, res);
  case "GET":
    return handleGetRequest(req, res);
  default:
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
