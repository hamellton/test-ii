import { EventCategories, EventNames } from "@config";
import { logEvent } from "./analytics";

const logNavigationEvent = (eventName: EventNames) => {
    logEvent(EventCategories.NAVIGATION, eventName);
};

export const actionEvent = (eventName: EventNames) => {
    logEvent(EventCategories.USER_ACTION, eventName);
};

export const logLoginClick = () => {
    actionEvent(EventNames.LOGIN_CLICKED);
};

export const logSignUpClick = () => {
    actionEvent(EventNames.SIGN_UP_CLICKED);
};

export const logListSalonClick = () => {
    logNavigationEvent(EventNames.LIST_SALON_CLICKED);
};

export const logMyDashboardClick = () => {
    logNavigationEvent(EventNames.MY_DASHBOARD_CLICKED);
};

export const logSalonsAndGatheringsClick = () => {
    logNavigationEvent(EventNames.SALONS_AND_GATHERINGS_CLICKED);
};

export const logHostingClick = () => {
    logNavigationEvent(EventNames.HOSTING_CLICKED);
};

export const logCommunityClick = () => {
    logNavigationEvent(EventNames.COMMUNITY_CLICKED);
};

export const logMembershipClick = () => {
    logNavigationEvent(EventNames.MEMBERSHIP_CLICKED);
};

export const logLogoutClick = () => {
    actionEvent(EventNames.LOGOUT_CLICKED);
};

export const logAppBarCloseClick = () => {
    actionEvent(EventNames.APP_BAR_CLOSE_CLICKED);
};

export const logCreateHostAccountClick = () => {
    actionEvent(EventNames.CREATE_HOST_ACCOUNT_CLICKED);
};

export const logReadHostingFAQClick = () => {
    actionEvent(EventNames.READ_HOSTING_FAQ_CLICKED);
};

export const logHostingFAQClick = () => {
    actionEvent(EventNames.HOSTING_FAQ_CLICKED);
};

export const logCodeOfConductClick = () => {
    actionEvent(EventNames.CODE_OF_CONDUCT_CLICKED);
};

export const logHostAgreementClick = () => {
    actionEvent(EventNames.HOST_AGREEMENT_CLICKED);
};

export const logCommunityForumGuideClick = () => {
    actionEvent(EventNames.COMMUNITY_FORUM_GUIDE_CLICKED);
};

export const logJoinNowClick = () => {
    actionEvent(EventNames.JOIN_NOW_CLICKED);
};

export const logHostCardClick = (hostId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.HOST_CARD_CLICKED, undefined, { hostId });
};

export const logAlphabeticalSortClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.ALPHABETICAL_SORT_CLICKED);
};

export const logTipButtonClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.TIP_BUTTON_CLICKED);
};

export const logSocialLinkClick = (linkLabel: string, linkUrl: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SOCIAL_LINK_CLICKED, undefined, { link_label: linkLabel, link_url: linkUrl });
};

export const logSalonClick = (salonId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SALON_CLICKED, undefined, { salonId });
};

export const logSeriesClick = (seriesId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_CLICKED, undefined, { seriesId });
};

export const logSeriesHostClick = (seriesId: string, hostId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_HOST_CLICKED, undefined, { seriesId, hostId });
};

export const logSeriesReadMoreClick = (seriesId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_READ_MORE_CLICKED, undefined, { seriesId });
};

export const logSeriesShareClick = (seriesId: string, shareType: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_SHARE_CLICKED, undefined, { seriesId, shareType });
};

export const logSeriesBuyClick = (seriesId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_BUY_CLICKED, undefined, { seriesId });
};

export const logSeriesTicketBoxClick = (seriesId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_BOX_CLICKED, undefined, { seriesId });
};

export const logSimilarEventsShowMoreClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.SIMILAR_EVENTS_SHOW_MORE_CLICKED);
};

export const logSimilarHostsShowMoreClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.SIMILAR_HOSTS_SHOW_MORE_CLICKED);
};

export const logSeriesTicketCartOpen = (seriesId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_CART_OPEN, undefined, { seriesId });
};

export const logSeriesTicketCartClose = (seriesId: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_CART_CLOSE, undefined, { seriesId });
};

export const logSeriesTicketCartSubmit = (seriesId: string, attendeesCount: number, totalPrice: number, totalPriceOfTickets: number, discountAmount: number, selectedEpisodesCount: number, isSubscribedToNewsletter: boolean) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_CART_SUBMIT, undefined, {
        seriesId,
        attendeesCount,
        totalPrice,
        totalPriceOfTickets,
        discountAmount,
        selectedEpisodesCount,
        isSubscribedToNewsletter,
    });
};

export const logSeriesTicketInputEpisodeSelect = (selectedEpisodes: string[]) => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_EPISODE_SELECT, undefined, { selectedEpisodes });
};

export const logSeriesTicketInputNewsletterSubscribe = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_NEWSLETTER_SUBSCRIBE);
};

export const logSeriesTicketInputNewsletterUnsubscribe = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.SERIES_TICKET_NEWSLETTER_UNSUBSCRIBE);
};

export const logTicketCartSubmit = (salonId: string, attendeesCount: number, totalPrice: number, totalCost: number, bookingFee: number, isSubscribedToNewsletter: boolean) => {
    logEvent(EventCategories.USER_ACTION, EventNames.TICKET_CART_SUBMIT, undefined, {
        salonId,
        attendeesCount,
        totalPrice,
        totalCost,
        bookingFee,
        isSubscribedToNewsletter,
    });
};

export const logTicketCartCheckout = (checkoutUrl: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.TICKET_CART_CHECKOUT, undefined, {
        checkoutUrl,
    });
};

export const logTicketCartMemberPurchase = (salonSlug: string) => {
    logEvent(EventCategories.USER_ACTION, EventNames.TICKET_CART_MEMBER_PURCHASE, undefined, {
        salonSlug,
    });
};

export const logTicketInputNewsletterSubscribe = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.TICKET_INPUT_NEWSLETTER_SUBSCRIBE, undefined, {
        action: "subscribe",
    });
};

export const logTicketInputNewsletterUnsubscribe = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.TICKET_INPUT_NEWSLETTER_UNSUBSCRIBE, undefined, {
        action: "unsubscribe",
    });
};
  
  export function logSalonTicketBoxMemberPurchase() {
    logEvent(EventCategories.USER_ACTION, EventNames.SALON_TICKET_BOX_MEMBER_PURCHASE);
  }
  
  export function logSalonTicketBoxPurchaseButtonClick() {
    logEvent(EventCategories.USER_ACTION, EventNames.SALON_TICKET_BOX_PURCHASE_BUTTON_CLICK);
  }