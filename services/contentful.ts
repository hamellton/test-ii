import { CommunityPageDataValue, FooterLink, FooterPageDataValue, HomePageDataValue, SocialIcon } from "@utils/contentfulTypes";
import prisma from "@utils/db";
import { createClient } from "contentful";
import { NextApiRequest, NextApiResponse } from "next";

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN as string;

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken,
});

export const getHomePageData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "homePage",
    });

    if (!entries.items.length) {
      return res.status(404).json({ error: "No entries found" });
    }

    const homePageData: any = entries.items[0].fields;

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
        salonsSection: {...data.salonsSection},
        partnersSection: {...data.partnersSection},
        mostofInterintellectCards:
                    data?.mostofInterintellectCards
                        &&
                        Array.isArray(data?.mostofInterintellectCards)
                        &&
                        data?.mostofInterintellectCards.length > 0
                      ?
                      data?.mostofInterintellectCards.map((card: any) => ({
                        title: card.title || "",
                        buttonTitle: card.buttonTitle || "",
                        buttonUrl: card.buttonUrl || "",
                        cardImg: card.cardImg || "",
                        description: card.description || "",
                      }))
                      :
                      [],
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
        subscriptionsSection: {
          ...data.subscriptionsSection, 
          cards: data.subscriptionsSection?.cards?.map((subscription: any) => ({
            name: subscription.subscriptionName || "",
            annualPrice: parseFloat(subscription.subscriptionAnnualPrice || "0"),
            monthlyPrice: parseFloat(subscription.subscriptionMonthlyPrice || "0"),
            perks: subscription.membershipPerks || "",
            buttonText: subscription.membershipCardButtonText || "",
            imgUrl: subscription.imgUrl || ""
          })) || []
        },
        joinCommunitySection: {
          title: data.joinCommunitySection?.[0]?.title || "",
          description: data.joinCommunitySection?.[0]?.description || "",
          buttons: data.joinCommunitySection?.[0]?.buttons || [],
          imgUrl: `https:${data.joinCommunitySection?.[0]?.img?.fields?.file?.url}` || "",
        },
      };
    };

    const heroButtons = await Promise.all(
      (homePageData?.heroSection?.fields?.buttons || []).map(getLinkedEntry)
    );

    const partnersSectionImgUrl = await getImageUrl(homePageData?.partnersSectionImg);
    
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

    const salonsSectionButton: any = await getLinkedEntry(homePageData?.salonsSection?.fields?.button);

    const salonsSection = {
      sectionTitle: homePageData?.salonsSection?.fields?.sectionTitle || "",
      category1: {
        title: homePageData?.salonsSection?.fields?.category1 || "",
        salons: [
          homePageData?.salonsSection?.fields?.salon1Category1 || "",
          homePageData?.salonsSection?.fields?.salon2Category1 || "",
          homePageData?.salonsSection?.fields?.salon3Category1 || "",
        ],
      },
      category2: {
        title: homePageData?.salonsSection?.fields?.category2 || "",
        salons: [
          homePageData?.salonsSection?.fields?.salon1Category2 || "",
          homePageData?.salonsSection?.fields?.salon2Category2 || "",
          homePageData?.salonsSection?.fields?.salon3Category2 || "",
        ],
      },
      category3: {
        title: homePageData?.salonsSection?.fields?.category3 || "",
        salons: [
          homePageData?.salonsSection?.fields?.salon1Category3 || "",
          homePageData?.salonsSection?.fields?.salon2Category3 || "",
          homePageData?.salonsSection?.fields?.salon3Category3 || "",
        ],
      },
      category4: {
        title: homePageData?.salonsSection?.fields?.category4 || "",
        salons: [
          homePageData?.salonsSection?.fields?.salon1Category4 || "",
          homePageData?.salonsSection?.fields?.salon2Category4 || "",
          homePageData?.salonsSection?.fields?.salon3Category4 || "",
        ],
      },
      button: salonsSectionButton || {},
    };      

    const formattedData: HomePageDataValue = {
      heroSection: {
        ...homePageData?.heroSection?.fields,
        buttons: heroButtons,
      },
      mostofInterintellectCards: mostofInterintellectCards,
      salonsSection: salonsSection,
      partnersSection: {
        title: homePageData?.partnersSectionTitle,
        imageUrl: partnersSectionImgUrl || "",
      },
      salonsTabsSectionTitle: homePageData?.salonsTabsSectionTitle?.content?.[0]?.content?.[0]?.value,
      aboutUsSection: {
        ...homePageData?.aboutUsSection?.fields,
        logoUrl: aboutUsLogoUrl,
        aboutUsImgUrl,
      },
      teamMembersSection,
      testimonialsSection,
      subscriptionsSection: {
        title: homePageData?.subscriptionsSection?.fields?.title || "",
        membershipPageTitle: homePageData?.subscriptionsSection?.fields?.membershipPageTitle || "",
        cards: subscriptionsSection
      },
      joinCommunitySection: joinCommunityButtons,
    };

    const formatedContentfulData = formatHomePageData(formattedData);
    console.log("🚀 ~ getHomePageData ~ formatedContentfulData:", formatedContentfulData);

    const saveHomePageDataToDatabase = async () => {
      try {
        const validJsonData = formatedContentfulData;
      
        const existingHomePage = await prisma.page.findFirst({
          where: { name: "homePage" },
        });
      
        if (existingHomePage) {
          await prisma.page.update({
            where: { id: existingHomePage.id },
            data: {
              name: "homePage",
              value: validJsonData,
            },
          });
        } else {
          await prisma.page.create({
            data: {
              name: "homePage",
              value: validJsonData,
            },
          });
        }
          
        console.log("Home page data saved successfully");
          
      } catch (error) {
        console.error("Error saving home page data:", error);
        throw new Error("Failed to save home page data to the database");
      }
    };
      
    await saveHomePageDataToDatabase();

    return res.status(200).json(formatedContentfulData);
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLinkedEntry = async (link: any) => {
  if (link?.sys?.id) {
    const linkedEntry = await contentfulClient.getEntry(link.sys.id);
    return linkedEntry.fields;
  }
  return null;
};

export const getImageUrl = async (image: any) => {
  if (image?.sys?.id) {
    const asset = await contentfulClient.getAsset(image.sys.id);
    return `https:${asset?.fields?.file?.url}` || "";
  }
  return null;
};

const formatFooterData = async (data: any): Promise<FooterPageDataValue> => {
  const formattedData: FooterPageDataValue = {
    newsletterTitle: data?.fields?.newsletterTitle?.["en-US"] || "",
    quoteText: data?.fields?.quoteText?.["en-US"] || "",
    footerText: data?.fields?.footerText?.["en-US"] || "",
    footerLinks: [],
    socialIcons: [],
  };
      
  if (data?.fields?.footerLinks?.["en-US"]) {
    formattedData.footerLinks = await Promise.all(
      data.fields.footerLinks["en-US"].map(async (link: any) => {
        const linkedEntry = await getLinkedEntry(link);
        return {
          id: link.sys.id,
          ...linkedEntry,
        } as FooterLink;
      })
    );
  }
      
  if (data?.fields?.socialIcons?.["en-US"]) {
    formattedData.socialIcons = await Promise.all(
      data.fields.socialIcons["en-US"].map(async (icon: any) => {
        const linkedEntry: any = await getLinkedEntry(icon);
        const fields: any = linkedEntry?.socialIcon?.fields;

        const imageData = fields?.file; 

        
        return {
          id: icon.sys.id,
          image: {
            alt: fields.title,
            imageUrl: `https:${imageData.url}` || null,
          },
          url: linkedEntry?.url || "",
        } as SocialIcon;
      })
    );
  }
      
  return formattedData;
};

export const saveFooterDataToDatabase = async (data: any) => {
  try {
    const validJsonData = await formatFooterData(data);

    if (!validJsonData.newsletterTitle || !validJsonData.footerText) {
      throw new Error("Missing required fields in footer data");
    }

    const existingFooterPage = await prisma.page.findFirst({
      where: { name: "footerPage" },
    });

    if (existingFooterPage) {
      await prisma.page.update({
        where: { id: existingFooterPage.id },
        data: {
          name: "footerPage",
          value: validJsonData,
        },
      });
    } else {
      await prisma.page.create({
        data: {
          name: "footerPage",
          value: validJsonData,
        },
      });
    }

    console.log("Footer page data saved successfully");

  } catch (error) {
    console.error("Error saving footer page data:", error);
    throw new Error("Failed to save footer page data to the database");
  }
};

export const getCommunityPageData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "communityPage",
    });

    if (!entries.items.length) {
      return res.status(404).json({ error: "No entries found" });
    }

    const communityPageData: any = entries.items[0].fields;

    const formatCommunityPageData = async (data: any) => {

      const cards = data.communityMostOfInterintellectCardsSection?.fields.cards || [];
      const cardEntries = await Promise.all(
        cards.map(async (card: any) => {
          const entry = await getLinkedEntry(card);
          const imgUrl = await getImageUrl(entry?.cardImg);
          return {
            title: entry?.title || "",
            description: entry?.description || "",
            imgUrl: imgUrl || "",
          };
        })
      );

      const collectiveSparkSectionImg = await getImageUrl(data.communityCollectiveSparkSection?.fields.img);
      const joinUsSectionImg = await getImageUrl(data.joinUsSection?.fields.img);
    
      return {
        heroSection: {
          title: data.communityHeroSection?.fields.title || "",
          subTitle: data.communityHeroSection?.fields.subTitle || "",
          buttonText: data.communityHeroSection?.fields.buttonText || "",
          buttonUrl: data.communityHeroSection?.fields.buttonUrl || "",
        },
        eventsSection: {
          title: data.communityMostOfInterintellectCardsSection?.fields.title || "",
          cards: cardEntries,
        },
        communityCollectiveSparkSection: {
          text: data.communityCollectiveSparkSection?.fields.text || "",
          name: data.communityCollectiveSparkSection?.fields.name || "",
          jobTitle: data.communityCollectiveSparkSection?.fields.jobTitle || "",
          image: collectiveSparkSectionImg || "",
        },
        joinUsSection: {
          title: data.joinUsSection?.fields.title || "",
          description: data.joinUsSection?.fields.description || "",
          buttonText: data.joinUsSection?.fields.buttonText || "",
          buttonUrl: data.joinUsSection?.fields.buttonUrl || "",
          image: joinUsSectionImg || "",
        },
        expectationsSection: {
          title: data.communityExpectationsSection?.fields.title || "",
          column1Title: data.communityExpectationsSection?.fields.column1Title || "",
          column2Title: data.communityExpectationsSection?.fields.column2Title || "",
          column3Title: data.communityExpectationsSection?.fields.column3Title || "",
          column1List: data.communityExpectationsSection?.fields.column1List || [],
          column2List: data.communityExpectationsSection?.fields.column2List || [],
          column3List: data.communityExpectationsSection?.fields.column3List || [],
        },
        meetsSection: [
          {
            imageUrl: await getImageUrl(data.communityMeetsImg1) || "",
            location: data.communityMeetsImg1Location || "",
          },
          {
            imageUrl: await getImageUrl(data.communityMeetsImg2) || "",
            location: data.communityMeetsImg2Location || "",
          },
          {
            imageUrl: await getImageUrl(data.communityMeetsImg3) || "",
            location: data.communityMeetsImg3Location || "",
          },
        ],
      };
    };

    const formattedData: CommunityPageDataValue = await formatCommunityPageData(communityPageData);

    const saveCommunityPageDataToDatabase = async () => {
      try {
        const existingCommunityPage = await prisma.page.findFirst({
          where: { name: "communityPage" },
        });

        if (existingCommunityPage) {
          await prisma.page.update({
            where: { id: existingCommunityPage.id },
            data: {
              name: "communityPage",
              value: formattedData,
            },
          });
        } else {
          await prisma.page.create({
            data: {
              name: "communityPage",
              value: formattedData,
            },
          });
        }

        console.log("Community page data saved successfully");
      } catch (error) {
        console.error("Error saving community page data:", error);
        throw new Error("Failed to save community page data to the database");
      }
    };

    await saveCommunityPageDataToDatabase();

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


function parseRichTextContent(contentArray: any[]): string {
  return contentArray.map((node) => {
    switch (node.nodeType) {
    case "paragraph":
      return `<p>${node.content.map((textNode: any) => textNode.value ?? "").join("")}</p>`;
    case "heading-1":
      return `<h1>${node.content.map((textNode: any) => textNode.value ?? "").join("")}</h1>`;
    case "heading-2":
      return `<h2>${node.content.map((textNode: any) => textNode.value ?? "").join("")}</h2>`;
    case "unordered-list":
      return `<ul>${parseRichTextContent(node.content)}</ul>`;
    case "list-item":
      return `<li>${parseRichTextContent(node.content)}</li>`;
    case "hr":
      return "<hr />";
    default:
      return "";
    }
  }).join("");
}

function convertRichTextToHTML(richText: any): string {
  if (!richText || !richText.content) {
    return "";
  }
  
  return parseRichTextContent(richText.content);
}


const formatHostingPageData = async (data: any) => {
  return {
    heroSection: {
      title: data.heroTitle || "",
      description: data.heroDescription || "",
      buttonText: data.heroButtonTitle || "",
      buttonUrl: data.heroButtonUrl || "",
    },
    benefitsSection: {
      title: data.benefitsTitle || "",
      description: data.benefitsDescription || "",
      cards: [
        {
          title: data.benefitsCard1Title || "",
          description: data.benefitsCard1Description || "",
          imgUrl: await getImageUrl(data.benefitsCard1Img),
        },
        {
          title: data.benefitsCard2Title || "",
          description: data.benefitsCard2Description || "",
          imgUrl: await getImageUrl(data.benefitsCard2Img),
        },
        {
          title: data.benefitsCard3Title || "",
          description: data.benefitsCard3Description || "",
          imgUrl: await getImageUrl(data.benefitsCard3Img),
        },
      ],
    },
    testimonialSection: {
      imgUrl: await getImageUrl(data.testimonialImg),
      text: data.testimonialText || "",
      authorName: data.testimonialAuthorName || "",
      authorJobTitle: data.testimonialAuthorJobTitle || "",
    },
    testimonials: [
      {
        text: data.testimonialsCard1Text || "",
        name: data.testimonialsCard1Name || "",
        jobTitle: data.testimonialsCard1JobTitle || "",
      },
      {
        text: data.testimonialsCard2Text || "",
        name: data.testimonialsCard2Name || "",
        jobTitle: data.testimonialsCard2JobTitle || "",
      },
      {
        text: data.testimonialsCard3Text || "",
        name: data.testimonialsCard3Name || "",
        jobTitle: data.testimonialsCard3JobTitle || "",
      },
    ],
    createHostAccountSection: {
      title: data.createHostAccTitle || "",
      description: data.createHostAccDescription || "",
      buttonTitle: data.createHostAccButtonTitle || "",
      buttonUrl: data.createHostAccButtonUrl || "",
      imgUrl: await getImageUrl(data.createHostAccImg),
    },
    tabsSection: {
      title: data.tabsSectionTitle || "",
      tabs: [
        {
          title: data.tab1 || "",
          content: convertRichTextToHTML(data.tab1Content),
        },
        {
          title: data.tab2 || "",
          content: convertRichTextToHTML(data.tab2Content),
        },
        {
          title: data.tab3 || "",
          content: convertRichTextToHTML(data.tab3Content),
        },
      ],
    },
  };
};

export const getHostingPageData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "hostingPage",
    });

    if (!entries.items.length) {
      return res.status(404).json({ error: "No entries found" });
    }

    const hostingPageData: any = entries.items[0].fields;
    const formattedData = await formatHostingPageData(hostingPageData);

    const saveHostingPageDataToDatabase = async () => {
      try {
        const existingHostingPage = await prisma.page.findFirst({
          where: { name: "hostingPage" },
        });

        if (existingHostingPage) {
          await prisma.page.update({
            where: { id: existingHostingPage.id },
            data: {
              name: "hostingPage",
              value: formattedData,
            },
          });
        } else {
          await prisma.page.create({
            data: {
              name: "hostingPage",
              value: formattedData,
            },
          });
        }

        console.log("Hosting page data saved successfully");
      } catch (error) {
        console.error("Error saving hosting page data:", error);
        throw new Error("Failed to save hosting page data to the database");
      }
    };

    await saveHostingPageDataToDatabase();

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
