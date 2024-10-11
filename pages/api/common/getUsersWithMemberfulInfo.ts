import { NextApiRequest, NextApiResponse } from "next";
import { getMemberfulUserInfo } from "@services/memberful";
import { getAllUsers } from "@models/user";
import { ErrorResponse, HTTPMethod, UserPublic } from "@utils/types";

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<UserPublic[] | ErrorResponse>) => {
  try {
    const users = await getAllUsers();

    const usersWithMemberfulInfo = await Promise.all(users.map(async user => {
      try {
        const memberInfo = await getMemberfulUserInfo(user.memberfulId);
        return {
          ...user,
          memberInfo: memberInfo?.data?.member || null,
        };
      } catch (error) {
        console.error(`Error fetching Memberful info for user ${user.id}:`, error);
        return {
          ...user,
          memberInfo: null
        };
      }
    }));

    if (users && usersWithMemberfulInfo) {
      return res.status(200).json(usersWithMemberfulInfo);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in handleGetRequest:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
  
const handler = async (req: NextApiRequest, res: NextApiResponse<UserPublic[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};
  
export default handler;
