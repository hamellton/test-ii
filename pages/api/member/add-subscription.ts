import { addSubscriptionToMember, getMemberfulUserInfoByEmail } from "@services/memberful";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, HTTPMethod, UserPublic } from "@utils/types";
import { deleteHostRequest } from "@models/user";

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse<UserPublic[] | ErrorResponse>) => {
  try {
    const { email: userEmail, hostRequestId  } = req.body as { email?: string, hostRequestId: string };

    if (!userEmail) {
      return res.status(400).json({ error: "Bad Request - Email is missing or invalid" });
    }

    // Fetch member information by email
    const memberfulUserResponse = await getMemberfulUserInfoByEmail(userEmail);
    
    if ("error" in memberfulUserResponse) {
      console.error("Error fetching member info:", memberfulUserResponse.error);
      return res.status(404).json({ error: "Member not found" });
    }

    const member: any = memberfulUserResponse.data.memberByEmail;
    
    if (!member.id) {
      return res.status(404).json({ error: "Member ID not found" });
    }

    try {
      const result = await addSubscriptionToMember(member.id, "113931");

      await deleteHostRequest(hostRequestId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error adding subscription:", error);
      return res.status(500).json({ error: "Failed to add subscription" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<UserPublic[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
