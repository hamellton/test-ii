import { SALON_TYPE, CATEGORY, LOCATION_TYPE, Salon, Series, User, Tag, MemberTicket, PublicTicket, SpecialGuest } from "@prisma/client";
import { NextApiRequest } from "next";
import { StandaloneSearchBoxProps } from "@react-google-maps/api";
import { FormikProps } from "formik";

/* Use this file to define types that are used by multiple files 
 * Otherwise, define the interfaces in the files that use them
 */
export interface SalonFormValues {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  publicSpaces: number
  totalSpaces: number
  publicPrice: number
  locationType: LOCATION_TYPE
  location?: string | null
  locationUrl?: string | null
  seriesId?: string | null
  coHosts?: User[] | null
  superSalon: boolean
  state?: string
  tags?: Tag[] | null
  additionalInfo?: string | null
  recordEvent: boolean
  specialGuests?: { name: string; email: string }[] | null
  file?: any
  fileChanged?: boolean
}

export interface FormattedSalonFormValues extends Omit<SalonFormValues, "date" | "startTime" | "endTime" | "totalSpaces" | "superSalon"> {
  type: SALON_TYPE
  file: File | null
  startTime: Date
  endTime: Date
  memberSpaces: number
  category: CATEGORY
  isDraft?: boolean
  specialGuests?: { name: string; email: string }[]
  imageUrl?: string;
  previewUrl?: string;
}

export interface ExtendedSalon extends Salon {
  coHosts: User[];
  tags: Tag[];
  memberTickets: MemberTicket[];
  publicTickets: PublicTicket[];
  specialGuests: SpecialGuest[];
  host?: any;
  history?: any,
}

export interface SalonPostObject extends Omit<FormattedSalonFormValues, "file"> {
  file: FileObject;
  specialGuests?: { name: string; email: string, id: string }[];
  zoomId?: string | null
  zoomStartUrl?: string | null
  zoomJoinUrl?: string | null
  stripeConnectedAccountId?: string
}

export interface LegacySalonFormValues extends Omit<SalonFormValues, "date" | "startTime" | "endTime" | "totalSpaces" | "superSalon"> {
  salonType: SALON_TYPE
  file: File
  startTime: Date
  endTime: Date
  memberSpaces: number
  category: CATEGORY
  host: string
}

export interface LegactHostValues {
  name: string
  image_url: string
  description: string
}

export interface FileObject {
  fieldname: "file";
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface ProfileFormValues {
  name?: string | null
  bio?: string | null
  email: string
  quote?: string | null
  webLink?: string | null
  xLink?: string | null
  instaLink?: string | null
  substackLink?: string | null
}

export interface FormattedProfileFormValues extends ProfileFormValues {
  file: File | string | null
}

export interface SeriesFormValues {
  title: string
  description: string
  tags?: Tag[] | null
  state?: string
}

export interface FormattedSeriesFormValues extends SeriesFormValues {
  file: File
}

export interface SalonEditBody extends Partial<Salon> {
  coHosts?: { id: string }[];
  tags?: { id: string }[];
  specialGuests?: { id: string; name: string; email: string }[];
  zoomId?: string
}

export interface SeriesPostObject extends Omit<FormattedSeriesFormValues, "file"> {
  file: FileObject;
  isDraft: boolean;
  stripeConnectedAccountId?: string;
}

export interface SeriesEditBody extends Partial<Series> {
  tags?: { id: string }[];
}

export interface ZoomMeetingInput {
  name: string;
  description: string;
  startTime: Date;
  duration: number;
  settings: {
    auto_recording?: "cloud" | "local"; // Only include if recordEvent is true
  };
}

export interface ModalState {
  openSignUpModal: boolean,
  openZoomModal: boolean,
  openHostModal: boolean,
}

export interface ZoomMeetingResponse {
  id: string;
  start_url: string;
  join_url: string;
}

export interface ZoomUser {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  type: number;
  verified: number;
  status: string;
};

interface AuthResponse {
  userId: string;
  isMember: boolean;
  canPurchase: boolean;
  isAdmin: {
    role: any,
    notifyOnCreate: boolean,
    notifyOnUpdate: boolean,
    notifyOnDelete: boolean,
  } | boolean;
  stripeInfo: any
  planName: string
  isHost: boolean;
  currentSubscription: Subscription | null;
}

export interface AuthorizedRequest extends AuthResponse, NextApiRequest {
  file?: FileObject | string;
  isDraft: boolean;
}

export type HostStatus = ZoomStatus | "prof_completed"

export type frontEndAuthResponse = {
  isLoggedIn?: boolean
  name?: string
  email?: string
  hostStatus?: HostStatus
  lastMemberTicket?: Date
  error?: string
} & Partial<AuthResponse>

export interface ErrorResponse {
  error: string;
}

export interface Subscription {
  id: string;
  plan: {
    id: string;
    name: string;
  };
}

export interface MemberInfo {
  data: {
    member: {
      id: string;
      fullName: string;
      email: string;
      subscriptions: Subscription[];
      metadata: {
        isAdmin: string
      }
    };
  },
  errors: {
    message: string
  }
}

export interface MemberInfoByEmail {
  data: {
    memberByEmail: {
      id: string
      email: string
    }
  }
}

export interface MemberErrorByEmail {
  data: {
    memberByEmail: null;
  };
  errors: EmailErrors[];
}

interface EmailErrors {
  type?: string;
  message?: string
}

export interface FirstBoxProps {
  formik: FormikProps<SalonFormValues>
  setFieldValue: <K extends keyof SalonFormValues>(field: K, value: SalonFormValues[K], shouldValidate?: boolean) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleFileReset: () => void;
  previewUrl: string;
  isEpisode: boolean;
  currentTime: string;
}

export interface ThirdBoxProps {
  formik: FormikProps<SalonFormValues>
  hosts: User[]
  tags: Tag[]
  isEpisode?: boolean
}

export interface SubmitModalProps {
  open: boolean
  numSteps: number
  onClose: () => void // Add a callback for when the modal is closed
  onNextClick: () => void
  setIsLoading: SetIsLoadingFunction
  isLoading: boolean
  step: number
  userId?: string
}

export interface BasicModalProps {
  close?: () => void;
  nextClicked?: () => void
  userId?: string
}

export type ZoomStatus = "new" | "sent" | "confirmed"

export type S3ErrorResponse = {
  message: string;
}

export type SetIsLoadingFunction = (isLoading: boolean) => void;

export enum HTTPMethod {
  Post = "POST",
  Patch = "PATCH",
  Put = "PUT",
  Get = "GET",
  Delete = "DELETE"
}

export type UserPublic = {
  id: string
  fullname: string;
  bio: string;
  profileImageUrl: string;
  slug?: string;
  salons?: Salon[];
  quote?: string;
  webLink?: string;
  xLink?: string;
  substackLink?: string;
  instaLink?: string;
  memberfulId: string;
}

export interface Attendee {
  name: string;
  email: string;
}

export interface AttendeeValues {
  attendees: Attendee[]
}

export interface PublicTicketCheckoutJSONObject extends AttendeeValues {
  salon: Salon
  user?: frontEndAuthResponse
  isSubscribedToNewsletter: boolean
  newsletterEmail: string
}

export interface PublicTicketSeriesCheckoutJSONObject extends AttendeeValues {
  hostId: string
  isSubscribedToNewsletter: boolean
  newsletterEmail: string
  selectedEpisodes: string[]
  bookingFee: number
  slug: string
  seriesTitle: string
}

export interface MemberCheckoutJSONObject {
  salon: Salon
  userId: string
  email: string
}

export interface TipCheckoutJSONObject {
  hostId: string
  url: string
  amount: number
}

export interface StripeSession {
  sessionId: string;
  url: string | null
}

export interface StripeTicketData {
  attendees: Attendee[]
  salonId: string
  priceId: string
  customerEmail: string
  accountId: string
}

export interface StripeSeriesTicketData {
  attendees: Attendee[]
  selectedEpisodes: string[]
  // salonId: string
  // priceId: string
  customerEmail: string
  accountId: string
}

export interface CustomStandaloneSearchBox extends StandaloneSearchBoxProps {
  getPlaces: () => google.maps.places.PlaceResult[];
}

export type GroupedSalons = {
  [year: number]: {
    [month: number]: ExtendedSalon[];
  };
};

export type MemberStatus = string

export type MembershipDuration = "monthly" | "annual" | boolean

export type Payout = {
  type: string;
  amount: number;
  time: Date;  // Added to hold the time information
};