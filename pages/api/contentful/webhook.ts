import { NextApiRequest, NextApiResponse } from "next";
import { getCommunityPageData, getHomePageData, getHostingPageData, saveFooterDataToDatabase } from "@services/contentful";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === "POST") {
    return await handleWebhook(req, res);
  } else if (req.method === "GET") {
    return await getHomePageData(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

const handleWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const contentfulData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const actionType = req.headers["x-contentful-topic"];

  const homePageContentTypes = [
    "homePage",
    "heroSection",
    "joinCommunitySection",
    "makeTheMostOfInterintellectCard",
    "membershipCard",
    "subscriptionsSection",
    "teamMember",
    "testimonialCard",
    "testimonialsSection",
    "salonsSection",
  ];

  const footerContentTypes = [
    "footerPage",
    "footerLink",
    "socialIcon",
  ];

  const communityPageContentTypes = [
    "communityPage",
    "communityHeroSection",
    "communityMostOfInterintellectCardsSection",
    "communityMakeTheMostOfInterintellectCard",
    "communityCollectiveSparkSection",
    "communityJoinUsSection",
    "communityExpectationsSection",
  ];

  const hostingPageContentTypes = [
    "hostingPage",
  ];

  try {
    if (contentfulData && contentfulData?.sys && contentfulData?.sys?.contentType?.sys?.id) {
      const { sys } = contentfulData;
      const contentTypeId = sys.contentType.sys.id;

      const isHomePageContent = homePageContentTypes.includes(contentTypeId);
      const isFooterContent = footerContentTypes.includes(contentTypeId);
      const isCommunityPageContent = communityPageContentTypes.includes(contentTypeId);
      const isHostingPageContent = hostingPageContentTypes.includes(contentTypeId);

      switch (actionType) {
      case "Contentful.Entry.publish":
      case "Contentful.Entry.unpublish":
      case "ContentManagement.ContentType.publish":
      case "ContentManagement.Entry.publish":
      case "ContentManagement.Entry.create":
        if (isHomePageContent) {
          await getHomePageData(req, res);
        } else if (isFooterContent) {
          await saveFooterDataToDatabase(contentfulData);
        } else if (isCommunityPageContent) {
          await getCommunityPageData(req, res);
        } else if (isHostingPageContent) {
          await getHostingPageData(req, res);
        }
        break;
      case "ContentManagement.Entry.auto_save":
        console.log(`Entry auto-saved: ${sys.id}`);
        break;
      case "ContentManagement.ContentType.save":
        console.log(`Content type saved: ${sys.id}`);
        break;
      default:
        console.log(`Unhandled action type: ${actionType}`);
        break;
      }

      return res.status(200).json({ success: true });
    } else {
      console.log("No sys property in contentfulData");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
