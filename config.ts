/* eslint-disable no-unused-vars */
export const SALON_ENDPOINT = "/api/salon";
export const SALONS_GROUPED_ENDPOINT = "/api/salon/public/all?grouped=true";
export const SALONS_ALL_ENDPOINT = "/api/salon/public/all";
export const SERIES_ENDPOINT = "/api/series";
export const SERIES_PUBLIC_ENDPOINT = "/api/series/public";
export const USER_ENDPOINT = "/api/user";
export const USER_PUBLIC_ENDPOINT = "/api/user/public";
export const USERS_ALL_PUBLIC_ENDPOINT = "/api/user/public/all";
export const USER_STATUS_ENDPOINT = "/api/common/userStatus";
export const STRIPE_ENDPOINT = "/api/stripe";
export const TAGS_ALL_PUBLIC_ENDPOINT = "/api/tag/public/all";
export const PUBLIC_TICKET_ENDPOINT = "/api/publicTicket";
export const TICKET_ENDPOINT = "/api/ticket";
export const PAYOUTS_ENDPOINT = "/api/payouts";
export const ORDERS_ENDPOINT = "/api/orders";
export const NEWSLETTER_SUBSCRIBE = "/api/common/subscribe";

export const NUM_STAGES = 4;
export const KEY_NAME = "salonData";

export const slugifyOptions = {
  lower: true,
  strict: true,
  trim: true
};

export const II_FACEBOOK = "https://www.facebook.com/interintellectlive";
export const II_INSTAGRAM = "https://www.instagram.com/interintellect_";
export const II_LINKEDIN = "https://www.linkedin.com/company/interintellect";
export const II_YOUTUBE = "https://www.youtube.com/@interintellect";
export const II_TWITTER = "https://twitter.com/interintellect_";
export const II_SUBSTACK = "https://interintellect.substack.com";

export const EventCategories = {
  USER_ACTION: "USER_ACTION",
  NAVIGATION: "NAVIGATION",
  TICKET_MANAGEMENT: "TICKET_MANAGEMENT",
  MENU: "MENU",
  ANALYTICS: "ANALYTICS",
} as const;

export enum EventNames {
  PAGE_VIEW = "Page View",
  OPEN = "Open",
  CLOSE = "Close",
  DASHBOARD_MY_EVENTS_CLICK = "My Events Click",
  HOMEPAGE_CLICK = "Homepage Click",
  DASHBOARD_MY_TICKETS_CLICK = "My Tickets Click",
  DASHBOARD_SETTINGS_CLICKED = "Settings Clicked",
  LOGOUT_CLICKED = "Logout Clicked",
  MEMBERSHIP_CLICKED = "Membership Clicked",
  DASHBOARD_DISCORD_CONNECT = "Discord Connect",
  DASHBOARD_ADMIN_CLICKED = "Admin Page Clicked",
  DASHBOARD_MY_EVENTS_CLICKED = "My Events Button Clicked",
  DASHBOARD_HOST_PROFILE_CLICKED = "Host Profile Clicked",
  DASHBOARD_PAYMENTS_CLICKED = "Payments Clicked",
  DASHBOARD_EPISODE_EDIT_CLICKED = "Episode Edit Clicked",
  DASHBOARD_SALON_EDIT_CLICKED = "Salon Edit Clicked",
  DASHBOARD_SALON_MENU_PREVIEW_CLICKED = "Salon Menu Preview Clicked",
  DASHBOARD_SALON_COPY_ZOOM_LINK_CLICKED = "Copy Zoom Link Clicked",
  DASHBOARD_SALON_COPY_LOCATION_CLICKED = "Copy Location Clicked",
  DASHBOARD_SALON_VIEW_ATTENDEES_CLICKED = "View Attendees Clicked",
  DASHBOARD_SALON_EMAIL_ATTENDEES_CLICKED = "Email Attendees Clicked",
  DASHBOARD_SALON_HISTORY_CLICKED = "Salon History Clicked",
  DASHBOARD_SALON_DELETE_CLICKED = "Salon Delete Clicked",
  DASHBOARD_SERIES_EDIT_CLICKED = "Series Edit Clicked",
  DASHBOARD_SERIES_MENU_PREVIEW_CLICKED = "Series Menu Preview Clicked",
  DASHBOARD_EPISODE_MENU_PREVIEW_CLICKED = "Episode Menu Preview Clicked",
  DASHBOARD_COPY_ZOOM_LINK_CLICKED = "Copy Zoom Link Clicked",
  DASHBOARD_COPY_LOCATION_CLICKED = "Copy Location Clicked",
  DASHBOARD_VIEW_ATTENDEES_CLICKED = "View Attendees Clicked",
  DASHBOARD_EMAIL_ATTENDEES_CLICKED = "Email Attendees Clicked",
  DASHBOARD_DELETE_CLICKED = "Delete Clicked",

  ADMIN_SALON_APPROVE_CLICKED = "Salon Approval Clicked",
  ADMIN_SERIES_APPROVE_CLICKED = "Series Approval Clicked",
  DASHBOARD_SERIES_DELETE_CLICKED = "Series Delete Clicked",

  DASHBOARD_TICKETS_UPCOMING_CLICKED = "Upcoming Tickets Clicked",
  DASHBOARD_TICKETS_PAST_EVENTS_CLICKED = "Past Events Clicked",
  DASHBOARD_TICKETS_JOIN_WITH_ZOOM_CLICKED = "Join with Zoom Clicked",
  DASHBOARD_TICKETS_OPEN_IN_MAPS_CLICKED = "Open in Maps Clicked",

  GOOGLE_LOGIN_CLICKED = "Google Login Clicked",
  SEND_MAGIC_LINK_CLICKED = "Send Magic Link Clicked",

  LOGIN_CLICKED = "Login Clicked",
  SIGN_UP_CLICKED = "Sign Up Clicked",
  LIST_SALON_CLICKED = "List Salon Clicked",
  MY_DASHBOARD_CLICKED = "My Dashboard Clicked",

  APP_BAR_CLOSE_CLICKED = "App Bar Close Clicked",
  APP_BAR_BUTTON_CLICKED = "App Bar Button Clicked",

  MEMBERSHIP_CARD_BUTTON_CLICKED = "Membership Card Button Clicked",
  DURATION_CHANGED = "Duration Changed",
  LOGIN_MODAL_OPENED = "Login Modal Opened",

  SALONS_AND_GATHERINGS_CLICKED = "Salons & Gatherings Clicked",
  HOSTING_CLICKED = "Hosting Clicked",
  COMMUNITY_CLICKED = "Community Clicked",

  CREATE_HOST_ACCOUNT_CLICKED = "Create Host Account Clicked",
  READ_HOSTING_FAQ_CLICKED = "Read Hosting FAQ Clicked",

  HOSTING_FAQ_CLICKED = "Hosting FAQ Clicked",
  CODE_OF_CONDUCT_CLICKED = "Code of Conduct Clicked",
  HOST_AGREEMENT_CLICKED = "Host Agreement Clicked",
  COMMUNITY_FORUM_GUIDE_CLICKED = "Community Forum Guide Clicked",

  JOIN_NOW_CLICKED = "Join Now Clicked",

  HOST_CARD_CLICKED = "Host Card Clicked",
  ALPHABETICAL_SORT_CLICKED = "Alphabetical Sort Clicked",

  TIP_BUTTON_CLICKED = "Tip Button Clicked",

  SOCIAL_LINK_CLICKED = "Social Link Clicked",

  SALON_CLICKED = "Salon Clicked",

  SERIES_CLICKED = "Series Clicked",
  SERIES_HOST_CLICKED = "Series Host Clicked",
  SERIES_READ_MORE_CLICKED = "Series Read More Clicked",

  SERIES_PAGE_VIEW = "Series Page View",
  SERIES_SHARE_CLICKED = "Series Share Clicked",
  SERIES_BUY_CLICKED = "Series Buy Clicked",
  SERIES_TICKET_BOX_CLICKED = "Series Ticket Box Clicked",

  SIMILAR_EVENTS_SHOW_MORE_CLICKED = "Similar Events Show More Clicked",

  SIMILAR_HOSTS_SHOW_MORE_CLICKED = "Similar Hosts Show More Clicked",

  SERIES_TICKET_CART_OPEN = "Series Ticket Cart Open",
  SERIES_TICKET_CART_CLOSE = "Series Ticket Cart Close",
  SERIES_TICKET_CART_SUBMIT = "Series Ticket Cart Submit",

  SERIES_TICKET_EPISODE_SELECT = "Series Ticket Episode Select",
  SERIES_TICKET_NEWSLETTER_SUBSCRIBE = "Series Ticket Newsletter Subscribe",
  SERIES_TICKET_NEWSLETTER_UNSUBSCRIBE = "Series Ticket Newsletter Unsubscribe",

  TICKET_CART_SUBMIT = "Ticket Cart Submit",
  TICKET_CART_CHECKOUT = "Ticket Cart Checkout",
  TICKET_CART_MEMBER_PURCHASE = "Ticket Cart Member Purchase",
  TICKET_INPUT_NEWSLETTER_SUBSCRIBE = "Ticket Input Newsletter Subscribe",
  TICKET_INPUT_NEWSLETTER_UNSUBSCRIBE = "Ticket Input Newsletter Unsubscribe",

  SALON_TICKET_BOX_MEMBER_PURCHASE = "Ticket Member Purchase",
  SALON_TICKET_BOX_PURCHASE_BUTTON_CLICK = "Ticket Purchase Button Click",
};
