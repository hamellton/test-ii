import Mailchimp from "@mailchimp/mailchimp_marketing";
import crypto from "crypto";
import { NextApiRequest } from "next";

Mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID as string;

const PUBLIC_NEWSLETTER_TAG = "Public Newsletter";

export const addSubscriberToList = async (email: string, firstName?: string, lastName?: string) => {
  try {
    const searchResult = await Mailchimp.searchMembers.search(email);
  
    if (searchResult.exact_matches.total_items > 0) {
      const subscriber = searchResult.exact_matches.members[0];
  
      if (subscriber.status === "subscribed") {
        const existingTags = subscriber.tags.map((tag: any) => tag.name);
        if (!existingTags.includes(PUBLIC_NEWSLETTER_TAG)) {
          await Mailchimp.lists.updateListMember(AUDIENCE_ID, subscriber.id, {
            tags: [{ name: PUBLIC_NEWSLETTER_TAG, status: "active" }],
          });
        }
        return { message: "Subscriber already exists and is subscribed", existing: true };
      }
  
      if (subscriber.status === "unsubscribed") {
        const response = await Mailchimp.lists.updateListMember(AUDIENCE_ID, subscriber.id, {
          status: "subscribed",
          merge_fields: {
            FNAME: firstName || subscriber.merge_fields.FNAME || "",
            LNAME: lastName || subscriber.merge_fields.LNAME || "",
          },
          tags: [{ name: PUBLIC_NEWSLETTER_TAG, status: "active" }],
        });
  
        return { message: "Subscriber was unsubscribed but has been resubscribed", response };
      }
    }
  
    const response = await Mailchimp.lists.addListMember(AUDIENCE_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName || "",
        LNAME: lastName || "",
      },
      tags: [{ name: PUBLIC_NEWSLETTER_TAG, status: "active" }],
    });
  
    return { message: "Successfully added new subscriber", response };
  } catch (error: any) {
    console.error("Error adding subscriber to Mailchimp:", error.response?.body || error);
    throw new Error(error.response?.body?.detail || error.message || "Failed to add subscriber");
  }
};

export const removeSubscriberFromList = async (email: string) => {
  try {
    const searchResult = await Mailchimp.searchMembers.search(email);
    if (searchResult.exact_matches.total_items === 0) {
      throw new Error("Subscriber not found");
    }
  
    const subscriberId = searchResult.exact_matches.members[0].id;
  
    const response = await Mailchimp.lists.updateListMember(AUDIENCE_ID, subscriberId, {
      status: "unsubscribed",
      tags: [{ name: PUBLIC_NEWSLETTER_TAG, status: "inactive" }],
    });
  
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to remove subscriber");
  }
};

const emailHash = (email: string) => {
  return crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
};

export const checkSubscriberStatus = async (email: string) => {
  try {
    const hashedEmail = emailHash(email.toLowerCase());
    const subscriber = await Mailchimp.lists.getListMember(AUDIENCE_ID, hashedEmail);
    
    return { status: subscriber.status, found: true };
  } catch (error: any) {
    if (error.status === 404) {
      return { status: "not_found", found: false };
    }
    console.error("Error fetching subscriber status:", error);
    throw new Error(error.message || "Failed to check subscriber status");
  }
};
  
export async function handleNewsletterSubscription(req: NextApiRequest) {
  if (req.body.isSubscribedToNewsletter && req.body.newsletterEmail) {
    const subscriberStatus = await checkSubscriberStatus(req.body.newsletterEmail);
    if (subscriberStatus.status === "subscribed") {
      // If the subscriber is already subscribed, do nothing
      console.log("Subscriber is already subscribed");
    } else {
      try {
        await addSubscriberToList(req.body.newsletterEmail);
        console.log("Subscriber added successfully");
      } catch (error) {
        console.error("Error adding subscriber:", error);
      }
    }
  } else if (req.body.newsletterEmail) {
    const subscriberStatus = await checkSubscriberStatus(req.body.newsletterEmail);
    if (subscriberStatus.status === "unsubscribed") {
      // If the subscriber is already unsubscribed, do nothing
      console.log("Subscriber is already unsubscribed");
    } else {
      try {
        await removeSubscriberFromList(req.body.newsletterEmail);
        console.log("Subscriber removed successfully");
      } catch (error) {
        console.error("Error removing subscriber:", error);
      }
    }
  }
}