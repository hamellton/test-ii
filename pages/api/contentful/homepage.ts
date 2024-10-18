import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const homepageData = await prisma.homePage.findUnique({
    const homepageData = await prisma.homePage.findFirst({
      // where: {
      //   id: 1,
      // },
      orderBy: {
        id: "desc",
      },
      include: {
        heroSection: true,
        partnersSection: true,
        aboutUsSection: true,
        joinCommunitySection: true,
        mostofInterintellectCards: true,
        teamMembers: true,
        testimonials: true,
        subscriptions: true,
      },
    });

    if (!homepageData) {
      return res.status(404).json({ message: "HomePage not found" });
    }

    return res.status(200).json(homepageData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
