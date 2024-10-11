interface Window {
    gtag: (...args: any[]) => void;
    Memberful?: {
        setup: (config: { site: string[] }) => void;
    };
}

declare module "@mailchimp/mailchimp_marketing" {
  const Mailchimp: any;
  export default Mailchimp;
}

declare module "@mailchimp/mailchimp_transactional" {
    const MailchimpTransactional: any;
    export default MailchimpTransactional;
}
