import twilio from "twilio";

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const client = twilio(accountSID, authToken);

export { client };