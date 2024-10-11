import ReactGA from "react-ga4";
import { track as trackVercel } from "@vercel/analytics/react";
import { EventCategories, EventNames } from "@config";

const GA_TRACKING_ID = "G-XVF0ZDKDJQ";

export const initGA = () => {
  ReactGA.initialize(GA_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
};

export const logEvent = (
  category: keyof typeof EventCategories,
  action: EventNames,
  label?: string,
  data?: { [key: string]: any }
) => {
  ReactGA.event({
    category: EventCategories[category],
    action: action,
    label: label || "",
    ...data,
  });
  
  trackVercel(action, {
    category: EventCategories[category],
    label: label || "",
    ...data,
  });
  
  console.log(`Event tracked: ${action}, Category: ${EventCategories[category]}, Label: ${label || "null"}, Data: ${data ? JSON.stringify(data) : "null"}`);
};

export const initAnalytics = () => {
  initGA();
};
