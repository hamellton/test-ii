import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getMemberfulUserInfo } from "@services/memberful";
import { frontEndAuthResponse } from "@utils/types";
import { getAuthorizedRequest } from "@utils/api-helpers";
import { getUserById } from "@models/user";
import { getZoomStatus } from "@services/zoom";
import { findOrCreateConnectedAccount } from "@services/stripe";

/* 
 * This API call does the same thing for frontend requests that the middleware does for backend requests 
 * It will return an object of type frontEndAuthResponse
 * If either isLoggedIn is false or error is true, we can still display contents meant for public 
 * The response code of 200 for 401 or 404 is on purpose because those aren't errors but valid frontend use cages
 * E.g. You will want to display some public info even if the user is not logged in
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<frontEndAuthResponse>) {
  const response: frontEndAuthResponse = {};
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      response.isLoggedIn = false;
      return res.status(200).json(response);
    }
    response.isLoggedIn = true;
    const user = await getUserById(session.user.id);
    response.name = user!.name!;
    response.email = user!.email;
    response.lastMemberTicket = user!.lastMemberTicket!;
    // if (user?.profileImageUrl && user?.profileImageUrl.length > 0) {
    //   response.hostStatus = "prof_completed";
    // } else {
    //   response.hostStatus = await getZoomStatus(user!.email);
    // }

    const zoomStatus = await getZoomStatus(user!.email);

    if (user?.profileImageUrl && user.profileImageUrl.length > 0 && user?.bio && user?.bio.length > 0 && zoomStatus === "confirmed") {
      response.hostStatus = "prof_completed";
    } else {
      response.hostStatus = zoomStatus;
    }

    const redirectUrl = `${process.env.NEXTAUTH_URL}/`;
    const stripeInfo = await findOrCreateConnectedAccount(session.user.email, session.user.id, redirectUrl);
      
    const memberInfo = await getMemberfulUserInfo(session.user.memberfulId);
    if (!memberInfo || memberInfo.errors != undefined) {
      return res.status(200).json(response);
    };

    return res.status(200).json(getAuthorizedRequest(response, session, memberInfo, stripeInfo, user));

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}