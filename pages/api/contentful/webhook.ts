import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "contentful";
import { HomePageData } from "@utils/contentfulTypes";
import prisma from "@utils/db";

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN as string;

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await handleWebhook(req, res);
  } else if (req.method === "GET") {
    return await getHomePageData(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

const saveHomePageDataToDatabase = async (data: HomePageData) => {
  const {
    heroSection,
    partnersSection,
    salonsTabsSectionTitle,
    aboutUsSection,
    teamMembersSection,
    testimonialsSection,
    subscriptionsSection,
    joinCommunitySection,
    mostofInterintellectCards,
  } = data;
  
  const existingHomePage = await prisma.homePage.findUnique({
    where: { id: 1 },
  });
  
  if (existingHomePage) {
    const updatedHomePage = await prisma.homePage.update({
      where: { id: 1 },
      data: {
        heroSection: {
          update: {
            title: heroSection.title,
            subTitle: heroSection.subTitle,
            buttons: {
              deleteMany: {},
              create: heroSection.buttons.map(button => ({
                text: button.text,
                url: button.url,
              })),
            },
          },
        },
        partnersSection: {
          update: {
            title: partnersSection.title,
            imageUrl: partnersSection.imageUrl,
          },
        },
        aboutUsSection: {
          update: {
            title: aboutUsSection.title,
            subTitle: aboutUsSection.subTitle,
            description: aboutUsSection.description,
            logoUrl: aboutUsSection.logoUrl,
            aboutUsImgUrl: aboutUsSection.aboutUsImgUrl,
          },
        },
        joinCommunitySection: {
          update: {
            title: joinCommunitySection.title,
            description: joinCommunitySection.description,
            imgUrl: joinCommunitySection.imgUrl,
            buttons: {
              deleteMany: {},
              create: joinCommunitySection.buttons.map(button => ({
                text: button.text,
                url: button.url,
              })),
            },
          },
        },
        mostofInterintellectCards: {
          deleteMany: {},
          create: mostofInterintellectCards.map(card => ({
            title: card.title,
            buttonTitle: card.buttonTitle,
            buttonUrl: card.buttonUrl,
            cardImg: card.cardImg,
            description: card.description,
          })),
        },
        teamMembers: {
          deleteMany: {},
          create: teamMembersSection.map(member => ({
            name: member.name,
            description: member.description,
            imgUrl: member.imgUrl,
          })),
        },
        testimonials: {
          deleteMany: {},
          create: testimonialsSection.map(testimonial => ({
            comment: testimonial.comment,
            name: testimonial.name,
            title: testimonial.title,
          })),
        },
        subscriptions: {
          deleteMany: {},
          create: subscriptionsSection.map(subscription => ({
            name: subscription.name,
            annualPrice: subscription.annualPrice,
            monthlyPrice: subscription.monthlyPrice,
            perks: subscription.perks,
            buttonText: subscription.buttonText,
            imgUrl: subscription.imgUrl,
          })),
        },
      },
    });
  
    console.log("🚀 ~ Updated HomePage:", updatedHomePage);
    return updatedHomePage;
  } else {
    const newHomePage = await prisma.homePage.create({
      data: {
        heroSection: {
          create: {
            title: heroSection.title,
            subTitle: heroSection.subTitle,
            buttons: {
              create: heroSection.buttons.map(button => ({
                text: button.text,
                url: button.url,
              })),
            },
          },
        },
        partnersSection: {
          create: {
            title: partnersSection.title,
            imageUrl: partnersSection.imageUrl,
          },
        },
        aboutUsSection: {
          create: {
            title: aboutUsSection.title,
            subTitle: aboutUsSection.subTitle,
            description: aboutUsSection.description,
            logoUrl: aboutUsSection.logoUrl,
            aboutUsImgUrl: aboutUsSection.aboutUsImgUrl,
          },
        },
        joinCommunitySection: {
          create: {
            title: joinCommunitySection.title,
            description: joinCommunitySection.description,
            imgUrl: joinCommunitySection.imgUrl,
            buttons: {
              create: joinCommunitySection.buttons.map(button => ({
                text: button.text,
                url: button.url,
              })),
            },
          },
        },
        mostofInterintellectCards: {
          create: mostofInterintellectCards.map(card => ({
            title: card.title,
            buttonTitle: card.buttonTitle,
            buttonUrl: card.buttonUrl,
            cardImg: card.cardImg,
            description: card.description,
          })),
        },
        teamMembers: {
          create: teamMembersSection.map(member => ({
            name: member.name,
            description: member.description,
            imgUrl: member.imgUrl,
          })),
        },
        testimonials: {
          create: testimonialsSection.map(testimonial => ({
            comment: testimonial.comment,
            name: testimonial.name,
            title: testimonial.title,
          })),
        },
        subscriptions: {
          create: subscriptionsSection.map(subscription => ({
            name: subscription.name,
            annualPrice: subscription.annualPrice,
            monthlyPrice: subscription.monthlyPrice,
            perks: subscription.perks,
            buttonText: subscription.buttonText,
            imgUrl: subscription.imgUrl,
          })),
        },
      },
    });
  
    console.log("🚀 ~ Created New HomePage:", newHomePage);
    return newHomePage;
  }
}; 


const getHomePageData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "homePage",
    });
  
    if (!entries.items.length) {
      return res.status(404).json({ error: "No entries found" });
    }
  
    const homePageData: any = entries.items[0].fields;
  
    const getLinkedEntry = async (link: any) => {
      if (link?.sys?.id) {
        const linkedEntry = await contentfulClient.getEntry(link.sys.id);
        return linkedEntry.fields;
      }
      return null;
    };
  
    const getImageUrl = async (image: any) => {
      if (image?.sys?.id) {
        const asset = await contentfulClient.getAsset(image.sys.id);
        return asset?.fields?.file?.url || "";
      }
      return null;
    };
  
    const formatHomePageData = (data: any) => {
      return {
        heroSection: {
          title: data.heroSection?.title || "",
          subTitle: data.heroSection?.subTitle || "",
          buttons: data.heroSection?.buttons?.map((button: any) => ({
            text: button.text || "",
            url: button.url || "",
          })) || [],
        },
        partnersSection: {
          title: data.partnersSection?.partnersSectionTitle || "",
          imageUrl: data.partnersSection?.partnersSectionImgUrl || "",
        },
        mostofInterintellectCards: 
        data?.mostofInterintellectCards 
        && 
        Array.isArray(data?.mostofInterintellectCards) 
        && data?.mostofInterintellectCards.length > 0 
          ? data?.mostofInterintellectCards.map((card: any) => ({
            title: card.title || "",
            buttonTitle: card.buttonTitle || "",
            buttonUrl: card.buttonUrl || "",
            cardImg: card.cardImg || "",
            description: card.description || "",
          })) 
          : 
          [],
        salonsTabsSectionTitle: data.salonsTabsSectionTitle || "",
        aboutUsSection: {
          title: data.aboutUsSection?.title || "",
          subTitle: data.aboutUsSection?.subTitle || "",
          description: data.aboutUsSection?.description || "",
          logoUrl: data.aboutUsSection?.logoUrl || "",
          aboutUsImgUrl: data.aboutUsSection?.aboutUsImgUrl || "",
        },
        teamMembersSection: data.teamMembersSection?.map((member: any) => ({
          name: member.hostName || "",
          description: member.hostDescription || "",
          imgUrl: member.hostImgUrl || "",
        })) || [],
        testimonialsSection: data.testimonialsSection?.map((testimonial: any) => ({
          comment: testimonial.comment || "",
          name: testimonial.name || "",
          title: testimonial.authorTitle || "",
        })) || [],
        subscriptionsSection: data.subscriptionsSection?.map((subscription: any) => ({
          name: subscription.subscriptionName || "",
          annualPrice: parseFloat(subscription.subscriptionAnnualPrice || "0"),
          monthlyPrice: parseFloat(subscription.subscriptionMonthlyPrice || "0"),
          perks: subscription.membershipPerks || "",
          buttonText: subscription.membershipCardButtonText || "",
          imgUrl: subscription.imgUrl || ""
        })) || [],
        joinCommunitySection: {
          title: data.joinCommunitySection?.[0]?.title || "",
          description: data.joinCommunitySection?.[0]?.description || "",
          buttons: data.joinCommunitySection?.[0]?.buttons || [],
          imgUrl: data.joinCommunitySection?.[0]?.img?.fields?.file?.url || "",
        },
      };
    };      
  
    const heroButtons = await Promise.all(
      (homePageData?.heroSection?.fields?.buttons || []).map(getLinkedEntry)
    );
  
    const partnersSectionImgUrl = await getImageUrl(homePageData?.partnersSection?.fields?.partnersSectionImg);
    const aboutUsLogoUrl = await getImageUrl(homePageData?.aboutUsSection?.fields?.logo);
    const aboutUsImgUrl = await getImageUrl(homePageData?.aboutUsSection?.fields?.aboutUsImg);
  
    const teamMembersSection = await Promise.all(
      (homePageData?.teamMembersSection || []).map(async (member: any) => ({
        ...member.fields,
        hostImgUrl: await getImageUrl(member.fields.hostImg),
      }))
    );
  
    const testimonialsSection = await Promise.all(
      (homePageData?.testimonialsSection?.fields?.testimonialsCard || []).map(getLinkedEntry)
    );

    const subscriptionsSection = await Promise.all(
      (homePageData?.subscriptionsSection?.fields?.cards || []).map(async (card: any) => {
        const linkedCard: any = await getLinkedEntry(card);
          
        const imgUrl = linkedCard?.membershipCardImg?.fields?.file?.url 
          ? `https:${linkedCard?.membershipCardImg?.fields.file.url}` 
          : "";
          
        return {
          ...linkedCard,
          imgUrl,
        };
      })
    );
  
    const joinCommunityButtons: any = await Promise.all(
      (homePageData?.joinCommunitySection || []).map(async (join: any) => {
        const buttons = await Promise.all(
          (join?.fields?.buttons || []).map(getLinkedEntry)
        );
        return {
          ...join.fields,
          buttons,
        };
      })
    );

    const mostofInterintellectCards = Array.isArray(homePageData.mostOfInterintellectCards)
      ? homePageData.mostOfInterintellectCards.map((card: any) => {
        if (card.fields) {
          return {
            title: card.fields.title || "",
            buttonTitle: card.fields.buttonTitle || "",
            buttonUrl: card.fields.buttonUrl || "",
            cardImg: card.fields.cardImg?.fields?.file?.url
              ? `https:${card.fields.cardImg.fields.file.url}`
              : "",
            description: card.fields.description || "",
          };
        } else {
          console.warn("Card fields are missing:", card);
          return null;
        }
      }).filter(Boolean)
      : [];
  
    const formattedData: HomePageData = {
      heroSection: {
        ...homePageData?.heroSection?.fields,
        buttons: heroButtons,
      },
      mostofInterintellectCards: mostofInterintellectCards,
      partnersSection: {
        ...homePageData?.partnersSection?.fields,
        partnersSectionImgUrl,
      },
      salonsTabsSectionTitle: homePageData?.salonsTabsSectionTitle?.content?.[0]?.content?.[0]?.value,
      aboutUsSection: {
        ...homePageData?.aboutUsSection?.fields,
        logoUrl: aboutUsLogoUrl,
        aboutUsImgUrl,
      },
      teamMembersSection,
      testimonialsSection,
      subscriptionsSection,
      joinCommunitySection: joinCommunityButtons,
    };
    
    const formatedContentfulData = formatHomePageData(formattedData);

    console.log("🚀 ~ getHomePageData ~ formatedContentfulData:", formatedContentfulData)

    // await saveHomePageDataToDatabase(formatedContentfulData);
    
    return res.status(200).json(formatedContentfulData);
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const contentfulData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  console.log("🚀 ~ handleWebhook ~ contentfulData:", contentfulData)
  const { sys } = contentfulData;
  const actionType = req.headers["x-contentful-topic"];
  console.log("🚀 ~ handleWebhook ~ actionType:", actionType);
  
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "homePage",
    });

    if (!entries.items.length) {
      console.error("No entries found for comparison");
      return res.status(404).json({ error: "No entries found" });
    }
    
    const latestData = entries.items[0];

    if (actionType === "Contentful.Entry.publish" || actionType === "Contentful.Entry.unpublish") {
      if (sys.id !== latestData.sys.id) {
        console.error(`Entry ID ${sys.id} does not match latest entry ID ${latestData.sys.id}`);
      } else {
        console.log(`Data matched: ${sys.id}`);
      }
    }

    switch (actionType) {
    case "Contentful.Entry.publish":
    case "Contentful.Entry.unpublish":
    case "ContentManagement.ContentType.publish":
    case "ContentManagement.Entry.publish":
    case "ContentManagement.Entry.create":
      await getHomePageData(req, res);
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
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;