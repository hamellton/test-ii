import { GroupedSalons, ExtendedSalon, AuthorizedRequest, MemberInfo, frontEndAuthResponse, SalonPostObject, SeriesPostObject, FileObject, Subscription, MemberStatus } from "./types";
import { Session } from "next-auth";
import slugify from "slugify";
import { slugifyOptions } from "@config";
import { checkSalonWithSlug } from "@models/salon";
import { checkSeriesWithSlug } from "@models/series";
import { LOCATION_TYPE, SALON_TYPE, USER_ROLE } from "@prisma/client";
import { getUserById } from "@models/user";
import sha256 from "crypto-js/sha256";
import encHex from "crypto-js/enc-hex";
import Stripe from "stripe";

const subscriptionPriority: { [key: string]: number } = {
  "Emeritus": 1,
  "Intellectual Explorer (yearly)": 2,
  "Intellectual Explorer (monthly)": 3,
  "Beginner (yearly)": 4,
  "Beginner (monthly)": 5
};

// export const HARD_CODED_ADMINS = [
//   "operations@interintellect.com",
//   "kostiantyn.postoian@lengin.com",
//   "hamelltonn@gmail.com"
// ];

export const getAuthorizedRequest = (
  req: AuthorizedRequest | frontEndAuthResponse,
  session: Session,
  memberInfo: MemberInfo,
  stripeInfo: {
    connectLink: string,
    status: any,
    account: Stripe.Account
  },
  user: any
): AuthorizedRequest | frontEndAuthResponse => {
  const { subscriptions, metadata } = memberInfo.data.member;

  // Separate Host subscription
  const hostSubscription = subscriptions.find(sub => sub.plan.name === "Host");
  const otherSubscriptions = subscriptions.filter(sub => sub.plan.name !== "Host");

  // Determine the highest priority subscription
  let currentSubscription: Subscription | null = null;

  if (otherSubscriptions.length > 0) {
    currentSubscription = otherSubscriptions.reduce((highest, sub) => {
      const currentPriority = subscriptionPriority[sub.plan.name] ?? Number.MAX_SAFE_INTEGER;
      const highestPriority = subscriptionPriority[highest.plan.name] ?? Number.MAX_SAFE_INTEGER;

      if (currentPriority < highestPriority) {
        return sub;
      }
      return highest;
    }, otherSubscriptions[0]);
  }

  req.userId = session.user.id;
  req.isMember = isMember(subscriptions);
  req.canPurchase = canPurchase(req, subscriptions);
  req.isHost = !!hostSubscription;
  req.planName = currentSubscription ? currentSubscription.plan.name : "";
  req.currentSubscription = currentSubscription;
  req.stripeInfo = stripeInfo;

  // Check if the user is one of the hardcoded admins
  if (metadata.isAdmin === "true" || user.role === USER_ROLE.ADMIN || user.role === USER_ROLE.SUPER_ADMIN) {
    req.isAdmin = {
      role: user.role,
      notifyOnCreate: user.notifyOnCreate,
      notifyOnUpdate: user.notifyOnUpdate,
      notifyOnDelete: user.notifyOnDelete,
    };
  } else {
    req.isAdmin = false;
  }

  return req;
};


// Helper function to check if req is frontEndAuthResponse
function isFrontEndAuthResponse(req: AuthorizedRequest | frontEndAuthResponse): req is frontEndAuthResponse {
  return "lastMemberTicket" in req;
}

export async function getAttendees(salon: ExtendedSalon): Promise<Array<string>> {
  const publicTicketEmails = salon.publicTickets.map(ticket => ticket.email);
  const memberTicketEmails = await Promise.all(salon.memberTickets.map(async ticket => {
    const user = await getUserById(ticket.userId);
    return user!.email;
  }));
  return [...memberTicketEmails, ...publicTicketEmails];
}

const isMember = (subscriptions: Subscription[]): boolean => {
  const allowedPlanKeywords: MemberStatus[] = ["Interintellect Community Membership (monthly)",
    "Community Membership (Founding - Monthly)",
    "Interintellect Community Membership (Quarterly)",
    "Interintellect Community Membership (6 Months)",
    "Apprentice",
    "Interintellect Community Membership (Yearly)",
    "Community Membership (Founding - Yearly)",
    "Interintellect Yearly Membership",
    "Intellectual Explorer (monthly)",
    "Intellectual Explorer (yearly)",
    "Beginner",
    "Beginner (monthly)",
    "Beginner (yearly)",
    "SuperSupporter",
    "Benefactor",
    "Emeritus"
  ];
  // Check if any subscription's plan name includes any of the allowed plan name keywords
  return subscriptions.some(subscription =>
    allowedPlanKeywords.some(keyword =>
      subscription.plan.name.toLowerCase().includes(keyword.toLowerCase())
    )
  );
};

const canPurchase = (req: AuthorizedRequest | frontEndAuthResponse, subscriptions: Subscription[]): boolean => {
  if (subscriptions.length === 0) return false;
  const allowedPlanKeywords = [
    "Explorer",
    "SuperSupporter",
    "Emeritus",
    "Benefactor"
  ];
  const isPremiumMember = subscriptions.some(subscription =>
    allowedPlanKeywords.includes(subscription.plan.name)
  );

  if (isPremiumMember) return true;

  if ((subscriptions[0].plan.name.includes("Interintellect Community Membership (monthly)") ||
    subscriptions[0].plan.name.includes("Community Membership (Founding - Monthly)") ||
    subscriptions[0].plan.name.includes("Interintellect Community Membership (Quarterly)") ||
    subscriptions[0].plan.name.includes("Interintellect Community Membership (Yearly)") ||
    subscriptions[0].plan.name.includes("Community Membership (Founding - Yearly)") ||
    subscriptions[0].plan.name.includes("Interintellect Yearly Membership") ||
    subscriptions[0].plan.name.includes("Apprentice") ||
    subscriptions[0].plan.name.includes("Beginner")
  ) &&
    isFrontEndAuthResponse(req)) {
    if (!req.lastMemberTicket) return true;
    const diff = (new Date().getTime() - new Date(req.lastMemberTicket).getTime()) / ((1000 * 60 * 60 * 24));
    return diff > parseInt(process.env.NEXT_PUBLIC_BEGINNER_PLAN_DURATION_DAYS!);
  }

  return false;
};

export async function fetchGetJSON(url: string) {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
}

export async function validateSalonPostObject(obj: SalonPostObject): Promise<{ valid: boolean; error?: string }> {
  // Check that all keys are present and not empty
  const requiredKeys: (keyof SalonPostObject)[] = [
    "title",
    "description",
    "type",
    "file",
    "startTime",
    "endTime",
    "memberSpaces",
    "publicSpaces",
    "publicPrice",
    "category",
    "locationType"
  ];

  for (const key of requiredKeys) {
    const value = obj[key];
    // Check that the value is not falsy or an empty string (after trimming whitespace)
    if (value === undefined || value === "" || (typeof value === "string" && value.trim().length === 0)) {
      const error = `Field "${key}" is empty or undefined.`;
      return { valid: false, error };
    }
  }

  // Check locationType-specific conditions
  if (obj.locationType === LOCATION_TYPE.IRL && !obj.location) {
    const error = "Location must be present when locationType is IRL.";
    return { valid: false, error };
  }

  if (obj.locationType === LOCATION_TYPE.VIRTUAL && obj.location) {
    const error = "Location should not be present when locationType is VIRTUAL.";
    return { valid: false, error };
  }

  // Check that the title is unique (not already in use)
  const potentialSlug = slugify(obj.title, slugifyOptions);
  const salonExists = await checkSalonWithSlug(potentialSlug);
  if (salonExists) return { valid: false, error: "Title is already in use." };


  // If the object is a series episode, check that the seriesId is present
  if (obj.type === SALON_TYPE.SERIES_EPISODE && !obj.seriesId) {
    const error = "Series episode must have a seriesId.";
    return { valid: false, error };
  }

  // At this point, the object is considered valid
  return { valid: true };
}

export function getDuration(startTime: Date, endTime: Date): number {
  return (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000 / 60;
}

export async function validateSeriesPostObject(obj: SeriesPostObject): Promise<{ valid: boolean; error?: string }> {
  // Check that all keys are present and not empty
  const requiredKeys: (keyof SeriesPostObject)[] = [
    "title"
  ];

  for (const key of requiredKeys) {
    const value = obj[key];
    // Check that the value is not falsy or an empty string (after trimming whitespace)
    if (value === undefined || value === "" || (typeof value === "string" && value.trim().length === 0)) {
      const error = `Field "${key}" is empty or undefined.`;
      return { valid: false, error };
    }
  }

  // Check that the title is unique (not already in use)
  const potentialSlug = slugify(obj.title, slugifyOptions);
  const seriesExists = await checkSeriesWithSlug(potentialSlug);
  if (seriesExists) return { valid: false, error: "Title is already in use." };

  return { valid: true };
}

export const createSalonBody = (req: AuthorizedRequest,): SalonPostObject => ({
  title: req.body.title,
  description: req.body.description,
  file: req.file as FileObject,
  isDraft: req.isDraft,
  type: req.body.type,
  startTime: req.body.startTime,
  endTime: req.body.endTime,
  memberSpaces: +req.body.memberSpaces, // Coerce to number because formdata only passes in data as Text or File
  publicSpaces: +req.body.publicSpaces,
  publicPrice: +req.body.publicPrice,
  category: req.body.category,
  locationType: req.body.locationType,
  location: req.body.location,
  locationUrl: req.body.locationUrl,
  seriesId: req.body.seriesId ? req.body.seriesId : undefined,
  coHosts: req.body.coHosts ? JSON.parse(req.body.coHosts) : undefined,
  tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
  additionalInfo: req.body.additionalInfo,
  specialGuests: req.body.specialGuests ? JSON.parse(req.body.specialGuests) : undefined,
  recordEvent: req.body.recordEvent === "true" ? true : (req.body.recordEvent === "false" ? false : req.body.recordEvent)
});

export const createSeriesBody = (req: AuthorizedRequest,): SeriesPostObject => ({
  title: req.body.title,
  description: req.body.description,
  file: req.file as FileObject,
  tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
  isDraft: req.body.isDraft,
});

export const groupSalonsByYearAndMonth = (s: ExtendedSalon[]): GroupedSalons => {
  const groupedSalons = s.reduce((acc: GroupedSalons, s1: ExtendedSalon) => {
    const startDate = new Date(s1.startTime);
    const year = startDate.getFullYear(); // Extract year from the start time
    const month = startDate.getMonth(); // Extract month from the start time

    if (!acc[year]) {
      acc[year] = {}; // Initialize an object if it doesn't exist
    }
    if (!acc[year][month]) {
      acc[year][month] = []; // Initialize an array if it doesn't exist
    }

    acc[year][month].push(s1); // Add the salon to the correct year and month
    return acc;
  }, {});
  return groupedSalons;
};

async function checkGravatarExists(email: string): Promise<boolean> {
  const cleanedEmail = email.trim().toLowerCase();
  const hash = sha256(cleanedEmail).toString(encHex);

  const response = await fetch(`https://www.gravatar.com/avatar/${hash}?d=404`, {
    method: "HEAD"
  });

  return response.status !== 404;
}

export async function getGravatarUrl(email: string, size: number = 100): Promise<string | null> {
  const exists = await checkGravatarExists(email);

  if (!exists) {
    return null;
  }

  const cleanedEmail = email.trim().toLowerCase();
  const hash = sha256(cleanedEmail).toString(encHex);

  return `https://www.gravatar.com/avatar/${hash}?s=${size}`;
}
