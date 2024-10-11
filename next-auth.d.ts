import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    memberfulId: string
  }

  interface Session {
    user: {
      email: string
      memberfulId: string
      id: string
    }
  }
}