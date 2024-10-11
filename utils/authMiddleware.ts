import { NextApiResponse } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getMemberfulUserInfo } from "@services/memberful";
import { AuthorizedRequest } from "./types";
import { getAuthorizedRequest } from "./api-helpers";
import { getUserById, updateUser } from "@models/user";
import { findOrCreateConnectedAccount } from "@services/stripe";
// import { checkGravatarImage } from "@services/gravatar";
// import { deleteZoomUser } from "@services/zoom";

export const authenticateMiddleware = (
  handler: (req: AuthorizedRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: AuthorizedRequest, res: NextApiResponse) => {
    try {
      // Check that the user is logged in (authenticated)
      const session = await getServerSession(req, res, authOptions);
      if (!session) return res.status(401).json({ error: "Unauthorized" });

      // Check if the caller of the request is provisioned in Memberful - source of user roles
      const memberInfo = await getMemberfulUserInfo(session.user.memberfulId);
      if (!memberInfo) return res.status(404).json({ error: "User not found in Memberful" });
      if (memberInfo) {
        // await deleteZoomUser(session.user.email);

        // sync with email
        // const { fullName, email } = memberInfo.data.member;
        // await updateUser(session.user.id, { name: fullName, email: email });

        // sync with Gravatar img
        // const avatarUrl = await checkGravatarImage(session.user.email);
        // const { fullName } = memberInfo.data.member;
        // await updateUser(session.user.id, { name: fullName, profileImageUrl: avatarUrl });

        const { fullName } = memberInfo.data.member;
        await updateUser(session.user.id, { name: fullName });
      }

      // Get or create Stripe account and link
      const redirectUrl = `${process.env.NEXTAUTH_URL}/`;
      const stripeInfo = await findOrCreateConnectedAccount(session.user.email, session.user.id, redirectUrl);
      const user = await getUserById(session.user.id);

      // Attach user roles to create an authorized 
      req = getAuthorizedRequest(req, session, memberInfo, stripeInfo, user) as AuthorizedRequest;

      // Call the route handler with the authorization added to it
      // Just calling this handler ensures that the user exists, is logged in, and provisioned in memberful
      return await handler(req, res);
    } catch (error) {
      console.error("Authentication Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
