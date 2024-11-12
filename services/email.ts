import { getSalonById, getSalonCountByHostId, getSalonCountByHostIdWithApproverState } from "@models/salon";
import { getAllAdmins, getUserById } from "@models/user";
import { getLocalDateFromUTC, getLocalTimeFromUTC } from "@utils/frontend-helpers";
import { StripeTicketData } from "@utils/types";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import pug from "pug";
import path from "path";
// import { getZoomMeetingDetails } from "./zoom";
import { createEvent } from "ics";
import os from "os"; 
import fs from "fs";
import { getSeriesById } from "@models/series";
import { createGoogleCalendarEventUrl } from "../pages/api/common/event-reminders";

// Path to the Pug templates
const pugEmailConfirmationTemplatePath = path.join(process.cwd(), "src/emailTemplates/emailConfirmationTemplate.pug");
const pugSalonApprovalEmailPath = path.join(process.cwd(), "src/emailTemplates/salonApprovalEmail.pug");
const pugTicketConfirmationVirtualEmailPath = path.join(process.cwd(), "src/emailTemplates/virtual_ticket_confirmation.pug");
const pugTicketConfirmationIRLEmailPath = path.join(process.cwd(), "src/emailTemplates/irl_ticket_confirmation.pug");
const pugSeriesTicketConfirmation = path.join(process.cwd(), "src/emailTemplates/emailSeriesTicketConfirmation.pug");

function wrapWithEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            height: 100%;
          }
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .email-container {
            max-width: 635px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 0 20px 20px 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            min-height: 600px;
          }
          .email-header {
            height: 250px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            margin: 0 auto;
          }
          .email-header img {
            height: 325px;
            margin: 0 auto;
          }
          .email-body {
            font-size: 16px;
            color: #333;
            line-height: 1.5;
          }
          .email-body h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }
          .email-body p {
            margin-bottom: 20px;
          }
          .email-footer {
            font-size: 12px;
            color: #777;
            text-align: center;
            margin-top: 120px;
            margin-bottom: 100px;
          }
          .email-footer a {
            color: #777;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <img src="https://interintellect.nyc3.digitaloceanspaces.com/logos/email-logo.png" alt="Interintellect">
          </div>
          <div class="email-body">
            ${content}
          </div>
          <div class="email-footer">
            © 2024 Pynchon Ideas.<br>
            2810 N Church St. PMB 59729 Wilmington, Delaware 19802
          </div>
        </div>
      </body>
    </html>
  `;
}

export const sendEmailToAdmins = async (
  subject: string, 
  body: string, 
  type: "edited" | "created" | "deleted"
) => {
  const admins: any = await getAllAdmins();

  const adminEmails = admins
    .filter((admin: any) => {
      if (type === "created") return admin.notifyOnCreate;
      if (type === "edited") return admin.notifyOnUpdate;
      if (type === "deleted") return admin.notifyOnDelete;
      return false;
    })
    .map((admin: any) => admin.email)
    .filter((email: string) => email);

  if (adminEmails.length > 0) {
    await sendEmail(adminEmails, subject, body);
  } else {
    console.log("No admin emails found for the selected notification type.");
  }
};

export const sendEmail = async (
  recipients: string[], 
  subject: string, 
  body: string, 
  useDoNotReply: boolean = false,
  attachments?: {
    filename: string;
    path: string;
    contentType: string;
  }[]
) => {
  const senderEmail = useDoNotReply ? process.env.EMAIL_FROM_NOT_REPLY : process.env.EMAIL_FROM;

  try {

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.mandrillapp.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "Interintellect",
    //     pass: "md-Lk8SQYwi9Loq877OpH3Ghg",
    //   },
    // });

    let response = await transporter.sendMail({
      from: `Interintellect <${senderEmail}>`,
      to: recipients && recipients.length > 0 ? recipients[0] : senderEmail,
      bcc: recipients.join(","),
      subject: subject,
      text: body,
      html: `<html><body>${body}</body></html>`,
      attachments: attachments || [],
    });

    if (!response.accepted) {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export async function emailSeriesTicketConfirmation(seriesId: string, customerEmail: string, emails: string[], names: string[]): Promise<void> {
  try {
    const series = await getSeriesById(seriesId);
    if (!series) {
      throw new Error("Series not found.");
    }

    let subject = "";

    const renderTemplate = pug.compileFile(pugSeriesTicketConfirmation);

    subject = `Your Interintellect purchase: ${series.title}`;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const name = names[i];
      
      const body = renderTemplate({
        series,
        name,
      });

      await sendEmail([email], subject, body, true);
    }

  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
}

export async function emailTicketConfirmation(salonId: string, emails: string[], names: string[]): Promise<void> {
  try {
    const salon = await getSalonById(salonId);
    if (!salon) {
      throw new Error("Salon not found.");
    }

    let pugTemplatePath = "";
    
    if (salon.locationType === "VIRTUAL") {
      pugTemplatePath = pugTicketConfirmationVirtualEmailPath;
    } else if (salon.locationType === "IRL") {
      pugTemplatePath = pugTicketConfirmationIRLEmailPath;
    }

    const renderTemplate = pug.compileFile(pugTemplatePath);

    const startTime = new Date(salon.startTime);
    const endTime = new Date(salon.endTime);
    const durationInHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const googleCalendarLink = createGoogleCalendarEventUrl(salon);

    const event = {
      start: getEventDateTime(salon.startTime),
      duration: { hours: durationInHours || 2 },
      title: salon.title,
      description: salon.description || `Join us for the event: ${salon.title}`,
      location: salon.locationType === "VIRTUAL" ? salon.zoomJoinUrl : (salon.location || ""),
      organizer: { name: "Interintellect", email: process.env.EMAIL_FROM },
    };

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const name = names[i];

      const subject = `Your Interintellect purchase: ${salon.title}`;

      const body = renderTemplate({
        salon,
        name,
        salonUrl: `${process.env.NEXTAUTH_URL}/salons/${salon.slug}`,
        date: getLocalDateFromUTC(salon.startTime.toString()),
        time: getLocalTimeFromUTC(salon.startTime.toString()),
        googleCalendarLink,
      });

      createEvent(event as any, async (error, value) => {
        if (error) {
          console.error("Error generating .ics file:", error);
          return;
        }

        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, `invite_${salon.id}_${i}.ics`);
        fs.writeFileSync(filePath, value);

        await sendEmail([email], subject, body, true, [
          {
            filename: "invite.ics",
            path: filePath,
            contentType: "text/calendar"
          }
        ]);

        fs.unlinkSync(filePath);
      });
    }

  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
}

function getEventDateTime(startTime: Date): [number, number, number, number, number] {
  return [
    startTime.getUTCFullYear(),
    startTime.getUTCMonth() + 1,
    startTime.getUTCDate(),
    startTime.getUTCHours(),
    startTime.getUTCMinutes()
  ];
}

// export async function emailSalonConfirmation(salonId: string, hostId: string): Promise<void> {
//   try {
//     const salon = await getSalonById(salonId);
//     if (!salon) {
//       throw new Error("Salon not found.");
//     }

//     const host = await getUserById(hostId);
//     if (!host) {
//       throw new Error("User not found.");
//     }

//     const count = await getSalonCountByHostId(hostId);
//     const isFirstApprovedSalon = count === 1 && salon.state === "APPROVED";

//     let templatePath;
//     if (isFirstApprovedSalon) {
//       templatePath = path.join(process.cwd(), "src/emailTemplates/first-approved-salon.pug");
//     } else {
//       templatePath = path.join(process.cwd(), "src/emailTemplates/regular-confirmation.pug");
//     }

//     const renderTemplate = pug.compileFile(templatePath);
    
//     const subject = isFirstApprovedSalon 
//       ? "Congratulations on listing your first salon!"
//       : `Thank you for your submission: ${salon.title}`;

//     const body = renderTemplate({
//       salon,
//       host,
//       hostPayoutPageUrl: "https://ii-v2.vercel.app/dashboard/payments"
//     });

//     await sendEmail([host.email], subject, body, true);
//   } catch (error) {
//     console.error("Error sending salon confirmation email: ", error);
//   }
// }

export async function emailSalonConfirmation(salonId: string, hostId: string): Promise<void> {
  try {
    const salon = await getSalonById(salonId);
    if (!salon) {
      throw new Error("Salon not found.");
    }

    const host = await getUserById(hostId);
    if (!host) {
      throw new Error("User not found.");
    }

    let body = "";
    let subject = "";

    const renderTemplate = pug.compileFile(pugEmailConfirmationTemplatePath);

    subject = `Thank you for your submission: ${salon.title}`;
    body = renderTemplate({
      salon,
      host
    });

    await sendEmail([host.email], subject, body, true);
  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
}

export async function emailSalonApproval(salonId: string, hostId: string, wasSubmitted: boolean): Promise<void> {
  try {
    const salon = await getSalonById(salonId);
    if (!salon) {
      throw new Error("Salon not found.");
    }

    const host = await getUserById(hostId);
    if (!host) {
      throw new Error("User not found.");
    }

    const count = await getSalonCountByHostIdWithApproverState(hostId);

    // Render the Pug template
    const compiledFunction = pug.compileFile(pugSalonApprovalEmailPath);

    let subject = "";
    let htmlBody = "";

    if (!wasSubmitted) {
      subject = `Approved change request: ${salon.title}`;
      htmlBody = compiledFunction({
        type: "edit_approved",
        host,
        salon,
      });
    } else if (count === 1) {
      subject = "Congratulations on listing your first salon!";
      htmlBody = compiledFunction({
        type: "first_salon",
        count,
        host,
        salon,
      });
    } else {
      subject = "Your salon has been published!";
      htmlBody = compiledFunction({
        type: "new_salon",
        count,
        host,
        salon,
      });
    }

    await sendEmail([host.email], subject, htmlBody, true);
  } catch (error) {
    console.error("Error sending salon approval email: ", error);
  }
}

function formatValue(value: any): string {
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === "object" && item !== null) {
          const displayName = item.name || item.label || JSON.stringify(item);
          return displayName;
        }
        return String(item);
      })
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return value.name || value.label || JSON.stringify(value);
  }

  return String(value);
}

export async function notifyEvent(
  link: string,
  type: "edited" | "created" | "deleted",
  options?: { salonTitle?: string, changes?: Record<string, any>, userName?: string | null }
): Promise<void> {
  try {
    let subject = "";
    let body = "";
    const userName = options?.userName || null;
    const eventLink = `<a href="${process.env.NEXTAUTH_URL}/${link}">${options?.salonTitle}</a>`;

    if (type === "deleted") {
      subject = `Cancellation request: ${options?.salonTitle}`;
      body = `${userName} has requested to delete the following event: ${eventLink}.<br><br>` +
             `<a href="${process.env.NEXTAUTH_URL}/dashboard/admin">Review these changes</a>`;
    } else if (type === "edited" && options?.changes) {
      const changes = options.changes;
      if (changes.title || changes.description) {
        subject = `Event Edited: ${options?.salonTitle}`;
        body = `${userName} has edited the description of the following event: ${eventLink}.`;
      } else if (changes.startTime || changes.endTime) {
        subject = `Date changed: ${options?.salonTitle}`;
        body = `${userName} has rescheduled the following event: ${eventLink}.<br>`;
        if (changes.startTime) {
          body += `Date changed from ${formatValue(changes.startTime.old)} to ${formatValue(changes.startTime.new)}.<br>`;
          body += `Start time changed from ${formatValue(changes.startTime.old)} to ${formatValue(changes.startTime.new)}.<br>`;
        }
        if (changes.endTime) {
          body += `End time changed from ${formatValue(changes.endTime.old)} to ${formatValue(changes.endTime.new)}.<br>`;
        }

        body += `<br><a href="${process.env.NEXTAUTH_URL}/dashboard/admin">Review these changes</a>`;
      } else if (changes.specialGuests) {
        subject = `Event Edited: ${options?.salonTitle}`;
        body = `${userName} has updated the special guests for the following event: ${eventLink}.<br>`;

        if (Array.isArray(changes.specialGuests.new) && changes.specialGuests.new.length === 0) {
          body += "Special guests have been removed.";
        } else {
          body += "Guests added:<br>";
          changes.specialGuests.new.forEach((guest: { name: string; email: string }) => {
            body += `${guest.name} (${guest.email})<br>`;
          });
        }

        body += `<br><a href="${process.env.NEXTAUTH_URL}/dashboard/admin">Review these changes</a>`;
      } else {
        subject = `Event Updated: ${options?.salonTitle}`;
        body = `${userName} has updated the following event: ${eventLink}.`;
      }
    } else {
      subject = `Event Created: ${options?.salonTitle}`;
      body = `The following event has been created: ${eventLink}.`;
    }

    await sendEmailToAdmins(subject, wrapWithEmailTemplate(body), type);
  } catch (error) {
    console.error("Error sending event notification email: ", error);
  }
}

export async function notifyPurchaseEvent(ticketInfo: StripeTicketData, paymentIntent: Stripe.Response<Stripe.PaymentIntent>): Promise<void> {
  try {
    const salon = await getSalonById(ticketInfo.salonId);
    if (!salon) {
      throw new Error("Salon not found.");
    }
    
    const subject = `Ticket purchased: ${salon.title}`;
    
    const body = `
      <p>The checkout was completed by ${ticketInfo.customerEmail}.</p>
    `;
    
    await sendEmail([process.env.EMAIL_NOTIFY!], subject, body, true);
  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
}


export async function notifyMemberCheckout(salonId: string, userId: string): Promise<void> {
  try {
    const salon = await getSalonById(salonId);
    const user = await getUserById(userId);
    const body = `
      <p>The memberCheckout was completed by: ${user!.email}</p>
    `;
    let subject = `A Member bought a ticket for the salon ${salon!.title}`;
    await sendEmail([process.env.EMAIL_NOTIFY!], subject, wrapWithEmailTemplate(body), true);
  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
}


export const notifyTip = async (stripePaymentId: string): Promise<void> => {
  try {
    const body = `
      <p>More info can be found at the Stripe: ${JSON.stringify(stripePaymentId)}</p>
    `;
    let subject = "A Host Received a Tip";
    await sendEmail([process.env.EMAIL_NOTIFY!], subject, wrapWithEmailTemplate(body), true);
  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
};

export async function emailSalonAttendees(salonId: string): Promise<void> {
  try {
    const salon = await getSalonById(salonId);
    if (!salon) {
      throw new Error("Salon not found.");
    }

    const publicTicketEmails = salon.publicTickets.map(ticket => ticket.email);
    const memberTicketEmails = await Promise.all(salon.memberTickets.map(async ticket => {
      const user = await getUserById(ticket.userId);
      return user!.email;
    }));
    const recipients = [...memberTicketEmails, ...publicTicketEmails];

    const subject = "Welcome all Attendees";
    const body = salon.title;

    await sendEmail(recipients, subject, body);
  } catch (error) {
    console.error("Error sending emails to salon attendees: ", error);
  }
}
