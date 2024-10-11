import { track as trackVercel } from "@vercel/analytics/react";
import { EventCategories, EventNames } from "@config";

const GA_TRACKING_ID = "G-XVF0ZDKDJQ";

export const initGA = () => {
  const script1 = document.createElement("script");
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script1.async = true;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}');
  `;
  document.head.appendChild(script2);
};

export const logPageView = () => {
  window.gtag("event", "page_view", {
    page_path: window.location.pathname,
  });
};

export const logEvent = (
  category: keyof typeof EventCategories,
  action: EventNames,
  label?: string,
  data?: { [key: string]: any }
) => {
  window.gtag("event", action, {
    event_category: EventCategories[category],
    event_label: label || "",
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
