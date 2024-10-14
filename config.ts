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
  MEMBER_PURCHASE: "MEMBER_PURCHASE",
  SERIES_PURCHASE: "SERIES_PURCHASE",
  SINGLE_TICKET_PURCHASE: "SINGLE_TICKET_PURCHASE",
} as const;

export enum EventNames {
  PAGE_VIEW = "Page View",
  OPEN = "Open",
  CLOSE = "Close",
  HOMEPAGE_CLICK = "Homepage Click",
  DASHBOARD_MY_TICKETS_CLICK = "Dashboard My Tickets Click",
  DASHBOARD_SETTINGS_CLICKED = "Dashboard Settings Click",
  LOGOUT_CLICKED = "Logout Clicked",
  MEMBERSHIP_CLICKED = "Membership Clicked",
  DASHBOARD_DISCORD_CONNECT = "Dashboard Discord Connect",
  DASHBOARD_ADMIN_CLICKED = "Dashboard Admin Page Clicked",
  DASHBOARD_MY_EVENTS_CLICKED = "Dashboard My Events Click",
  DASHBOARD_HOST_PROFILE_CLICKED = "Dashboard Host Profile Click",
  DASHBOARD_PAYMENTS_CLICKED = "Dashboard Payments Click",
  DASHBOARD_EPISODE_EDIT_CLICKED = "Dashboard Episode Edit Click",
  DASHBOARD_SALON_EDIT_CLICKED = "Dashboard Salon Edit Click",
  DASHBOARD_SALON_MENU_PREVIEW_CLICKED = "Dashboard Salon Menu Preview Click",
  DASHBOARD_SALON_COPY_ZOOM_LINK_CLICKED = "Dashboard Salon Copy Zoom Link Click",
  DASHBOARD_SALON_COPY_LOCATION_CLICKED = "Dashboard Salon Copy Location Click",
  DASHBOARD_SALON_VIEW_ATTENDEES_CLICKED = "Dashboard Salon View Attendees Click",
  DASHBOARD_SALON_EMAIL_ATTENDEES_CLICKED = "Dashboard Salon Email Attendees Click",
  DASHBOARD_SALON_HISTORY_CLICKED = "Dashboard Salon History Click",
  DASHBOARD_SALON_DELETE_CLICKED = "Dashboard Salon Delete Click",
  DASHBOARD_SERIES_EDIT_CLICKED = "Dashboard Series Edit Click",
  DASHBOARD_SERIES_MENU_PREVIEW_CLICKED = "Dashboard Series Menu Preview Click",
  DASHBOARD_EPISODE_MENU_PREVIEW_CLICKED = "Dashboard Episode Menu Preview Click",
  DASHBOARD_COPY_ZOOM_LINK_CLICKED = "Dashboard Copy Zoom Link Click",
  DASHBOARD_COPY_LOCATION_CLICKED = "Dashboard Copy Location Click",
  DASHBOARD_VIEW_ATTENDEES_CLICKED = "Dashboard View Attendees Click",
  DASHBOARD_EMAIL_ATTENDEES_CLICKED = "Dashboard Email Attendees Click",

  ADMIN_SALON_APPROVE_CLICKED = "Admin Salon Approve Click",
  ADMIN_SERIES_APPROVE_CLICKED = "Admin Series Approve Click",
  DASHBOARD_SERIES_DELETE_CLICKED = "Dashboard Series Delete Click",

  DASHBOARD_TICKETS_UPCOMING_CLICKED = "Dashboard Tickets Upcoming Click",
  DASHBOARD_TICKETS_PAST_EVENTS_CLICKED = "Dashboard Tickets Past Events Click",
  DASHBOARD_TICKETS_JOIN_WITH_ZOOM_CLICKED = "Dashboard Tickets Join with Zoom Click",
  DASHBOARD_TICKETS_OPEN_IN_MAPS_CLICKED = "Dashboard Tickets Open in Maps Click",

  GOOGLE_LOGIN_CLICKED = "Google Login Clicked",
  SEND_MAGIC_LINK_CLICKED = "Send Magic Link Clicked",

  LOGIN_CLICKED = "Login Click",
  SIGN_UP_CLICKED = "Sign Up Click",
  LIST_SALON_CLICKED = "List Salon Click",
  MY_DASHBOARD_CLICKED = "My Dashboard Click",

  APP_BAR_CLOSE_CLICKED = "App Bar Close Click",
  APP_BAR_BUTTON_CLICKED = "App Bar Button Click",

  MEMBERSHIP_CARD_BUTTON_CLICKED = "Membership Card Button Click",
  DURATION_CHANGED = "Duration Changed",
  LOGIN_MODAL_OPENED = "Login Modal Opened",

  SALONS_AND_GATHERINGS_CLICKED = "Salons & Gatherings Click",
  HOSTING_CLICKED = "Hosting Click",
  COMMUNITY_CLICKED = "Community Click",

  CREATE_HOST_ACCOUNT_CLICKED = "Create Host Account Click",
  READ_HOSTING_FAQ_CLICKED = "Read Hosting FAQ Click",

  HOSTING_FAQ_CLICKED = "Hosting FAQ Click",
  CODE_OF_CONDUCT_CLICKED = "Code of Conduct Click",
  HOST_AGREEMENT_CLICKED = "Host Agreement Click",
  COMMUNITY_FORUM_GUIDE_CLICKED = "Community Forum Guide Click",

  JOIN_NOW_CLICKED = "Join Now Click",

  HOST_CARD_CLICKED = "Host Card Click",
  ALPHABETICAL_SORT_CLICKED = "Alphabetical Sort Click",

  TIP_BUTTON_CLICKED = "Tip Button Click",

  SOCIAL_LINK_CLICKED = "Social Link Click",

  SALON_CLICKED = "Salon Click",

  SERIES_CLICKED = "Series Click",
  SERIES_HOST_CLICKED = "Series Host Click",
  SERIES_READ_MORE_CLICKED = "Series Read More Click",

  SERIES_SHARE_CLICKED = "Series Share Click",
  SERIES_BUY_CLICKED = "Series Buy Clicked",
  SERIES_TICKET_BOX_CLICKED = "Series Ticket Box Click",

  SIMILAR_EVENTS_SHOW_MORE_CLICKED = "Similar Events Show More Click",

  SIMILAR_HOSTS_SHOW_MORE_CLICKED = "Similar Hosts Show More Click",

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

  PAYMENT_SUCCESS = "Payment Success",
  MEMBER_PAYMENT_SUCCESS = "Member Purchase Successful",
  SERIES_PAYMENT_SUCCESS = "Series Purchase Successful",
  SINGLE_TICKET_PAYMENT_SUCCESS = "Ticket Purchase Successful",

};
