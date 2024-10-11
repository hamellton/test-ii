import { NextApiResponse } from "next";
import { AuthorizedRequest, HTTPMethod } from "@utils/types";
import { sendEmail } from "@services/email";
import { getAttendees } from "@utils/api-helpers";
import { getSalonById } from "@models/salon";
import pug from "pug";
import path from "path";

// Path to the Pug templates
const pugEmailAttendeesPath = path.join(process.cwd(), "src/emailTemplates/emailAttendeesTemplate.pug");

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse<any>) => {
  const message = req.body.message as string;
  const salon = await getSalonById(req.body.id as string);
  const attendees = await getAttendees(salon!);
  attendees.push(req.body.user.email);
  try {
    const renderTemplate = pug.compileFile(pugEmailAttendeesPath);

    const htmlBody = renderTemplate({
      salon,
      message
    });

    await sendEmail(attendees, `Update Regarding Salon: ${salon!.title}`, htmlBody);
    res.status(200).json("Email Sent");
  } catch (error) {
    console.error("Error sending confirmation Email:", error);
    res.status(500).json({ error: "Failed to clear member attendees" });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<any>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
