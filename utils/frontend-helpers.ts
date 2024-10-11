import { LOCATION_TYPE, Salon, User } from "@prisma/client";
import ical, { ICalEventStatus, ICalEventBusyStatus } from "ical-generator";
import { HostStatus, Attendee, frontEndAuthResponse, ExtendedSalon, ErrorResponse, Payout } from "./types";
import { showToast } from "@/store";

export function getCurrentTimeAndTimezone() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  // Attempt to extract the timezone abbreviation
  const timezoneString = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short"
  }).format(now).split(" ")[1];
  return `${timeString} ${timezoneString}`;
}

export function formatEventsPageDate(dateTimeStr: Date, currentTimezone: string) {
  const date = new Date(dateTimeStr);

  // Adjust for CET timezone (+1 hour from UTC, but consider daylight saving time)
  // Note: This part is tricky because 'CET' can be either UTC+1 or UTC+2 depending on daylight saving time.
  // Here, I'm assuming CET as UTC+1 for this example. In a real-world scenario, you would need a proper timezone library like 'date-fns-tz' or 'moment-timezone' to handle this correctly.
  const cetOffset = 1 * 60; // CET is UTC+1
  const utcOffset = date.getTimezoneOffset(); // Get the UTC offset for the local time
  date.setMinutes(date.getMinutes() + utcOffset + cetOffset);

  // Options for formatting the date parts
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

  // Create Intl.DateTimeFormat instances with specified options
  const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);
  const timeFormatter = new Intl.DateTimeFormat("en-US", { ...timeOptions, timeZone: currentTimezone });

  // Format the date and time parts
  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);

  // Combine the parts and add the time zone
  const formattedDateTime = `${formattedDate} • ${formattedTime}`;

  return formattedDateTime;
}

export function getLocalDateFromUTC(utcTimestamp: string, extended: boolean = false) {
  const date = new Date(utcTimestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: extended ? "long" : "short",
    month: extended ? "long" : "short",
    day: "numeric",
    year: extended ? "numeric" : undefined,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function getLocalTimeFromUTC(utcTimestamp: string) {
  // Create a Date object using the UTC timestamp
  const date = new Date(utcTimestamp);

  // Create Intl.DateTimeFormat object with local settings and format the date
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  return Intl.DateTimeFormat("en-US", options).format(date);
}

export const handleTwitterShareClick = (url: string) => {
  const encodedUrl = encodeURIComponent(url);
  const twitterText = encodeURIComponent("Checkout this Interintellect Salon: \n");
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodedUrl}`;
  window.open(twitterShareUrl, "_blank", "noopener,noreferrer");
};

export const handleFacebookShareClick = (url: string) => {
  // Will only work on non localhost urls
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
};

export const handleLinkedInShareClick = (url: string) => {
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  window.open(linkedInShareUrl, "_blank", "noopener,noreferrer");
};

export const copyTextToClipboard = (text: string, dispatch: any) => {
  navigator.clipboard.writeText(text)
    // .then(() => alert("Copied: " + text))
    .then(() => dispatch(showToast({ message: `Copied: ${text}`, autoHide: false, })))
    .catch((error: any) => console.error("Error copying text to clipboard:", error));
};

export const handleIcalDownload = async (salon: ExtendedSalon) => {
  const { startTime, endTime } = salon;
  const calendar = ical({ name: "My Events" });
  const eventStart = new Date(startTime);
  const eventEnd = new Date(endTime);

  calendar.createEvent({
    start: eventStart,
    end: eventEnd,
    summary: salon.title,
    description: salon.description,
    location: salon.locationType === LOCATION_TYPE.VIRTUAL ? "Online" : salon.location || "TBA",
    url: getSalonShareUrl(salon),
    status: ICalEventStatus.CONFIRMED,
    busystatus: ICalEventBusyStatus.BUSY
  });

  const icsString = calendar.toString();

  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${salon.title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const createGoogleCalendarEventUrl = (salon: Salon) => {
  const event = {
    title: salon.title,
    start: new Date(salon.startTime).toISOString().replace(/[:-]/g, ""),
    end: new Date(salon.endTime).toISOString().replace(/[:-]/g, ""),
    description: salon.description,
    location: salon.locationType === "VIRTUAL" ? "Online" : "In Person",
  };

  const textParam = `&text=${encodeURIComponent(event.title)}`;
  const datesParam = `&dates=${event.start}/${event.end}`;
  const detailsParam = `&details=${encodeURIComponent(event.description)}`;
  const locationParam = `&location=${encodeURIComponent(event.location)}`;
  const result = `${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TEMPLATE}${textParam}${datesParam}${detailsParam}${locationParam}`;
  window.open(result, "_blank", "noopener,noreferrer");
};

export const getStep = (hostStatus: HostStatus) => {
  switch (hostStatus) {
  case "new":
    return 0;
  case "sent":
    return 2;
  case "confirmed":
    return 3;
  case "prof_completed":
    return 4;
  }
};

export function truncateString(str: string | undefined, num: number): string {
  if (typeof str !== "string") {
    return "";
  }
  
  if (str.length <= num) {
    return str;
  }
  
  return str.slice(0, num) + "…";
}


export function convertToUTC(date: string, time: string): Date {
  const dateTimeStr = `${date}T${time}`;
  const localDate = new Date(dateTimeStr);
  return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
}

const tagMappings: Record<string, string> = {
  "bookClub": "Book Club",
  // "discordMeetup": "Discord meet-up (Members only)",
  "discordMeetup": "Discord meet-up",
  "event": "Event",
  "hostTraining": "Host Training",
  "membersOnly": "Members Only",
  "readingSalon": "Reading Salon",
  "salon": "Salon",
  "series": "Series",
  "superSalon": "SuperSalon",
  "workshopSalon": "Workshop Salon",
  "singlesMingles": "Singles Mingles",
  "Art": "Art",
  "Artificial Intelligence": "Artificial Intelligence",
  "Community": "Community",
  "Cryptocurrency": "Cryptocurrency",
  "Cultural Trends": "Cultural Trends",
  "Business": "Business",
  "Economy": "Economy",
  "Engineering": "Engineering",
  "Environment": "Environment",
  "Gender and Sexuality": "Gender and Sexuality",
  "History": "History",
  "Justice": "Justice",
  "Literature": "Literature",
  "Math": "Math",
  "Music": "Music",
  "Philosophy": "Philosophy",
  "Physics": "Physics",
  "Photography": "Photography",
  "Poetry": "Poetry",
  "Politics": "Politics",
  "Psychology": "Psychology",
  "Progress Studies": "Progress Studies",
  "Religion": "Religion",
  "Science": "Science",
  "Sociology": "Sociology",
  "Spirituality": "Spirituality",
  "Technology": "Technology",
  "World Affairs": "World Affairs",
};

export const getEventTag = (key: string) => {
  return tagMappings[key] || "Unknown";
};

export function getNumAttendees(salon: ExtendedSalon): number | string {
  return salon && salon?.memberTickets && salon?.publicTickets ? salon.memberTickets.length + salon.publicTickets.length : "";
}

export function getRemainingMemberSpaces(salon: ExtendedSalon): number {
  salon.memberTickets = salon.memberTickets || [];
  return salon.memberSpaces - salon.memberTickets.length;
}

export function getRemainingPublicSpaces(salon: ExtendedSalon): number {
  salon.publicTickets = salon.publicTickets || [];
  return salon.publicSpaces - salon.publicTickets.length;
}

export function attendingCurrentSalon(salon: ExtendedSalon, user: frontEndAuthResponse) {
  return salon.memberTickets?.some(ticket => ticket.userId === user.userId) ?? false;
}

export function canMemberCheckout(salon: ExtendedSalon, user: frontEndAuthResponse) {
  return user.canPurchase === true && getRemainingMemberSpaces(salon) > 0 && !attendingCurrentSalon(salon, user);
}

export function canPublicCheckout(salon: ExtendedSalon, attendees: Attendee[]) {
  return attendees.length > 0 && attendees.length <= getRemainingPublicSpaces(salon);
}

export function getSubmitButtonText(
  type: "Salon" | "Series",
  editing: boolean,
  isLoading: boolean,
  isEpisode: boolean,
  salonState: boolean,
  formType: "create" | "event"
) {
  let action: string;
  let itemType: string;

  if (formType === "create") {
    action = salonState ? "Submit" : editing ? "Edit" : "Create";
    itemType = type === "Salon" ? (isEpisode ? " Series Episode" : " Single Salon") : " a Salon Series";
  } else if (formType === "event") {
    action = "Create";
    itemType = type === "Salon" ? " Single Salon" : " Series Episode";
  } else {
    action = salonState ? "Submit" : editing ? "Edit" : "Create";
    itemType = type === "Salon" ? (isEpisode ? "n Episode" : " Salon") : " Series";
  }

  const ingSuffix = isLoading ? "ing" : "";

  return `${action}${ingSuffix}${itemType}`;
}

export function getHeadlineText(type: "Salon" | "Series", editing: boolean, isEpisode: boolean) {
  if (type === "Salon") {
    if (editing) {
      return "Edit a Salon";
    } else {
      return "Create a Single Salon";
    }
  } else { // type === "Series"
    if (isEpisode) {
      return editing ? "Edit a Series Episode" : "Add a Series Episode";
    } else {
      return editing ? "Edit a Salon Series" : "Create a Salon Series";
    }
  }
}

export function ensureHttps(url: string) {
  if (url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return `https://${url}`;
}

export const isErrorResponse = (salonData: ExtendedSalon | ErrorResponse | undefined): salonData is ErrorResponse => {
  return (salonData as ErrorResponse).error !== undefined;
};

export function calculateTotals(results: Payout[]): { tipsTotal: number; ticketsTotal: number; total: number } {
  let tipsTotal = 0;
  let ticketsTotal = 0;

  results.forEach(result => {
    if (result.type === "Tip") {
      tipsTotal += result.amount;
    } else {
      ticketsTotal += result.amount;
    }
  });

  const total = ticketsTotal + tipsTotal;

  return {
    tipsTotal,
    ticketsTotal,
    total
  };
}

export const getSalonShareUrl = (salon: ExtendedSalon): string => {
  return `${window.location.origin}/salons/${salon.slug}`;
};

export const getHostUrl = (host: User): string => {
  return `${window.location.origin}/hosts/${host.slug}`;
};

export const paginate = (array: any[], page_size: number, page_number: number) => {
  if (Array.isArray(array)) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  } else {
    return [];
  }
};

export function getBookingFee(numTickets: number): number {
  return numTickets >= 3 ? 3 : numTickets * 1.5;
}

export function dataURLtoBlob(dataURL: string) {
  const [header, data] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "";
  const binary = atob(data);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

interface RevenueAndSold {
  revenue: string;
  sold: string;
}

export const calculateRevenueAndSold = (salon: ExtendedSalon | undefined): RevenueAndSold => {
  if (!salon) {
    return {
      revenue: "$0.00",
      sold: "0 / 0"
    };
  }

  const publicSpacesCount = salon.publicSpaces || 0;

  const publicTickets = salon.publicTickets || [];
  const revenue = salon.publicPrice ? salon.publicPrice * publicTickets.length : 0;
  const sold = publicTickets.length;

  return {
    revenue: `$${revenue.toFixed(2)}`,
    sold: `${sold} / ${publicSpacesCount}`
  };
};

export const getStatusLabel = (state: string): string => {
  switch (state) {
  case "SUBMITTED":
    return "In Review";
  case "PENDING_APPROVAL":
    return "In Review";
  case "DRAFT":
    return "Draft";
  case "APPROVED":
    return "Published";
  default:
    return "Unknown";
  }
};

interface SalonHistoryEntry {
  changedAt: string;
  changes: {
    updated: {
      state: "APPROVED" | "PENDING_APPROVAL" | "SUBMITTED";
    };
    previous: {
      state: "APPROVED" | "PENDING_APPROVAL" | "SUBMITTED";
    };
  };
}

// export interface ExtendedSalon extends Salon {
//   id: string;
//   title: string;
//   state: "APPROVED" | "PENDING_APPROVAL" | "SUBMITTED";
//   history?: SalonHistoryEntry[];
// }

export function findLatestSalonEntry(
  salon: any,
  filterByState: boolean = false
): Salon | SalonHistoryEntry["changes"]["previous"] | undefined {
  if (!salon.history || salon.history.length === 0) {
    return salon;
  }

  const sortedHistory = salon.history.sort((a: any, b: any) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

  let latestSalonEntry: SalonHistoryEntry | undefined;

  if (filterByState) {
    latestSalonEntry = sortedHistory.find((entry: any) => entry.changes.previous.state === "APPROVED")
      || sortedHistory.find((entry: any) => entry.changes.previous.state === "PENDING_APPROVAL")
      || sortedHistory.find((entry: any) => entry.changes.previous.state === "SUBMITTED");
  } else {
    latestSalonEntry = sortedHistory[0];
  }


  return latestSalonEntry ? latestSalonEntry.changes.previous : salon;
}

// Helper function to format Unix timestamp to ISO 8601 string
export const formatUnixTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString();
};