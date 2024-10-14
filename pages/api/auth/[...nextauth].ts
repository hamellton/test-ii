// import NextAuth from "next-auth";
// import type { NextAuthOptions } from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@utils/db";
// import GoogleProvider from "next-auth/providers/google";
// import Email from "next-auth/providers/email";
// import { createMemberfulUser, getMemberfulUserInfoByEmail } from "@services/memberful";
// import { updateUser } from "@models/user";
// // import { addSubscriberToList } from "@services/mailchimpService";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.TOKEN_SECRET,
//   providers: [
//     Email({
//       server: {
//         host: process.env.EMAIL_SERVER_HOST,
//         port: Number(process.env.EMAIL_SERVER_PORT),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER,
//           pass: process.env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string
//     }),
//     // {
//     //   id: "memberful",
//     //   name: "Memberful",
//     //   type: "oauth",
//     //   authorization: `https://testii.memberful.com/oauth?response_type=code&client_id=${clientId}`,
//     //   token: "https://testii.memberful.com/oauth/token",
//     //   userinfo: "https://testii.memberful.com/api/graphql/member",
//     //   profile(profile: any) {
//     //     return {
//     //       id: profile.id,
//     //       name: profile.fullName,
//     //       email: profile.email,
//     //       memberfulId: profile.memberfulId || null,
//     //     };
//     //   },
//     //   clientId,
//     //   clientSecret,
//     // }
//   ],
//   callbacks: {
//     async session({ session, user }) {

//       let memberfulUser: any = await getMemberfulUserInfoByEmail(user.email);
//       if ("errors" in memberfulUser && (memberfulUser.errors[0].type === "NOT_FOUND")) {
//         // New User, must be provisioned in memberful
//         console.log("Creating new user");
//         memberfulUser = await createMemberfulUser(user.email, user.name!);
//         console.log("Memberful User Created:", memberfulUser);
//       }

//       // Add memberful id to the db
//       if (user.id && memberfulUser.data.memberByEmail) {
//         updateUser(user.id, { memberfulId: memberfulUser.data.memberByEmail.id });

//         // Add memberful id and user id to the session
//         session.user.id = user.id;
//         session.user.memberfulId = memberfulUser.data.memberByEmail.id;
//       }

//       // Try to subscribe user to the Mailchimp newsletter
//       // try {
//       //   await addSubscriberToList(user.email, user.name?.split(" ")[0], user.name?.split(" ")[1]);
//       //   console.log(`Successfully subscribed ${user.email} to the newsletter`);
//       // } catch (error: any) {
//       //   console.error(`Error subscribing ${user.email} to the newsletter:`, error.message);
//       // }

//       session.user.id = user.id;
//       return session;
//     },
//   },
// };

// export default NextAuth(authOptions);


import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@utils/db";
import GoogleProvider from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { createMemberfulUser, getMemberfulUserInfoByEmail } from "@services/memberful";
import { updateUser } from "@models/user";
// import { addSubscriberToList } from "@services/mailchimpService";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.TOKEN_SECRET,
  providers: [
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    {
      id: "phone",
      name: "Phone",
      type: "credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        verificationCode: { label: "Verification Code", type: "text" }
      },
      authorize: async (credentials) => {
        const { phoneNumber, verificationCode } = credentials;
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/phoneAuth/phone-auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ phoneNumber, verificationCode })
        });
        const data = await response.json();
        if (response.ok && data.message === "Phone number verified successfully!") {
          return { id: phoneNumber, name: phoneNumber };
        } else {
          return null;
        }
      }
    }
  ],
  callbacks: {
    async session({ session, user }) {

      let memberfulUser: any = await getMemberfulUserInfoByEmail(user.email);
      if ("errors" in memberfulUser && (memberfulUser.errors[0].type === "NOT_FOUND")) {
        // New User, must be provisioned in memberful
        console.log("Creating new user");
        memberfulUser = await createMemberfulUser(user.email, user.name!);
        console.log("Memberful User Created:", memberfulUser);
      }

      // Add memberful id to the db
      if (user.id && memberfulUser.data.memberByEmail) {
        updateUser(user.id, { memberfulId: memberfulUser.data.memberByEmail.id });

        // Add memberful id and user id to the session
        session.user.id = user.id;
        session.user.memberfulId = memberfulUser.data.memberByEmail.id;
      }

      // Try to subscribe user to the Mailchimp newsletter
      // try {
      //   await addSubscriberToList(user.email, user.name?.split(" ")[0], user.name?.split(" ")[1]);
      //   console.log(`Successfully subscribed ${user.email} to the newsletter`);
      // } catch (error: any) {
      //   console.error(`Error subscribing ${user.email} to the newsletter:`, error.message);
      // }

      session.user.id = user.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
