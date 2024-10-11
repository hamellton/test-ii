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

// Path to the Pug templates
const pugEmailConfirmationTemplatePath = path.join(process.cwd(), "src/emailTemplates/emailConfirmationTemplate.pug");
const pugSalonApprovalEmailPath = path.join(process.cwd(), "src/emailTemplates/salonApprovalEmail.pug");
const pugTicketConfirmationVirtualEmailPath = path.join(process.cwd(), "src/emailTemplates/emailTicketConfirmationVirtual.pug");
const pugTicketConfirmationIRLEmailPath = path.join(process.cwd(), "src/emailTemplates/emailTicketConfirmationIRL.pug");

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

// import mailchimpTransactional from "@mailchimp/mailchimp_transactional";

// const mailchimp = mailchimpTransactional(process.env.MAILCHIMP_MADRILL_II_API_KEY);

// export const sendEmail = async (
//   recipients: string[],
//   subject: string,
//   body: string,
//   useDoNotReply: boolean = false
// ) => {
//   const message = {
//     from_email: process.env.EMAIL_FROM,
//     // from_email: "do-not-reply@interintellect.com",
//     subject: subject,
//     text: body,
//     html: `<html><body>${body}</body></html>`,
//     to: recipients.map(email => ({ email })),
//   };

//   try {
//     const response = await mailchimp.messages.send({ message });
//     console.log("🚀 ~ sendEmail ~ response:", response);

//     if (!response || !Array.isArray(response) || response.length === 0 || response[0].status !== "sent") {
//       throw new Error("Failed to send email. Response: " + JSON.stringify(response));
//     }

//     return response;
//   } catch (error: any) {
//     console.error("An error occurred while sending email:", error);

//     const errorMessage = error.response?.body?.detail || error.message || "Failed to send email";
//     throw new Error(errorMessage);
//   }
// };


// export const sendEmail = async (recipients: string[], subject: string, body: string, useDoNotReply: boolean = false) => {
//   // const senderEmail = useDoNotReply ? "do-not-reply@interintellect.com" : process.env.EMAIL_FROM;
//   // const senderEmail = process.env.EMAIL_FROM;
//   const senderEmail = process.env.EMAIL_FROM;
//   try {
//     let transporter = nodemailer.createTransport({
//       host: "smtp.mandrillapp.com",
//       port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
//       secure: process.env.EMAIL_SERVER_PORT === "465", // Assumes '465' is used for secure connections
//       auth: {
//         user: "hamelltonn",
//         pass: process.env.MAILCHIMP_MADRILL_II_API_KEY
//       },
//     });

//     let response = await transporter.sendMail({
//       from: `Interintellect <${senderEmail}>`,
//       to: recipients && recipients.length > 0 ? recipients[0] : process.env.EMAIL_FROM,
//       bcc: recipients.join(","),
//       subject: subject,
//       text: body,
//       html: `<html><body>${body}</body></html>`
//     });

//     if (!response.accepted) {
//       throw new Error("Failed to send email");
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     throw error;
//   }
// };

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
  // const senderEmail = useDoNotReply ? "do-not-reply@interintellect.com" : process.env.EMAIL_FROM;
  const senderEmail = process.env.EMAIL_FROM;
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
      secure: process.env.EMAIL_SERVER_PORT === "465", // Assumes '465' is used for secure connections
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      },
    });

    let response = await transporter.sendMail({
      from: `Interintellect <${senderEmail}>`,
      to: recipients && recipients.length > 0 ? recipients[0] : process.env.EMAIL_FROM,
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

// export const sendEmail = async (recipients: string[], subject: string, body: string, useDoNotReply: boolean = false) => {
//   // const senderEmail = useDoNotReply ? "do-not-reply@interintellect.com" : process.env.EMAIL_FROM;
//   const senderEmail = process.env.EMAIL_FROM;
//   try {
//     let transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_SERVER_HOST,
//       port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
//       secure: process.env.EMAIL_SERVER_PORT === "465", // Assumes '465' is used for secure connections
//       auth: {
//         user: process.env.EMAIL_SERVER_USER,
//         pass: process.env.EMAIL_SERVER_PASSWORD
//       },
//     });

//     let response = await transporter.sendMail({
//       from: `Interintellect <${senderEmail}>`,
//       to: recipients && recipients.length > 0 ? recipients[0] : process.env.EMAIL_FROM,
//       bcc: recipients.join(","),
//       subject: subject,
//       text: body,
//       html: `<html><body>${body}</body></html>`
//     });

//     if (!response.accepted) {
//       throw new Error("Failed to send email");
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     throw error;
//   }
// };

// export async function emailTicketConfirmation(salonId: string, emails: string[], names: string[]): Promise<void> {
//   console.log("🚀 ~ emailTicketConfirmation ~ names:", names)
//   try {
//     const salon = await getSalonById(salonId);
//     if (!salon) {
//       throw new Error("Salon not found.");
//     }

//     let body = "";
//     let subject = "";

//     if (salon.locationType === "IRL") {
//       subject = `Interintellect Gathering: ${salon.title}`;
//       body = `
//         The event you have registered for: <a href="${process.env.NEXTAUTH_URL}/${salon.slug}">${process.env.NEXTAUTH_URL}/${salon.slug}</a> will be held at: <br>
//         <br>
//         Address: ${salon.location} <br>
//         Google Maps Link: <a href="${salon.locationUrl}">${salon.locationUrl}</a> <br>
//         Date and Time: ${getLocalTimeFromUTC(salon.startTime.toString())} <br>
//         <br>
//         Engage in inspiring conversations and connect with fellow intellectual explorers. <br>
//         <br>
//         Have a great time! <br>
//         <br>
//         Kind regards, <br>
//         Interintellect Team
//       `;
//     } else if (salon.locationType === "VIRTUAL") {
//       subject = `Your Zoom Details for ${salon.title}`;
//       body = `
//         Below are the details for your upcoming Salon: <br>
//         <a href="${process.env.NEXTAUTH_URL}/${salon.slug}">${process.env.NEXTAUTH_URL}/${salon.slug}</a> on ${getLocalTimeFromUTC(salon.startTime.toString())} <br>
//         Zoom link to join: <a href="${salon.zoomJoinUrl}">${salon.zoomJoinUrl}</a> <br>
//         <br>
//         Step into a world of conversation and awaken your mind. <br>
//         <br>
//         Enjoy your salon! <br>
//         Interintellect Team
//       `;
//     }
//     await sendEmail(emails, subject, body);
//   } catch (error) {
//     console.error("Error sending ticket confirmation email: ", error);
//   }
// }

// export async function emailTicketConfirmation(salonId: string, emails: string[], names: string[]): Promise<void> {
  
//   try {
//     const salon = await getSalonById(salonId);
//     if (!salon) {
//       throw new Error("Salon not found.");
//     }

//     if (salon.locationType === "VIRTUAL") {      
//       for (let i = 0; i < emails.length; i++) {
//         const email = emails[i];
//         const name = names[i];
        
//         const subject = `Your Zoom Details for ${salon.title}`;
//         const body = `
//           Dear ${name}, <br><br>

//           Here are the details for your upcoming salon: <br>
//           <a href="${process.env.NEXTAUTH_URL}/salons/${salon.slug}">${salon.title}</a> on ${getLocalDateFromUTC(salon.startTime.toString())} at ${getLocalTimeFromUTC(salon.startTime.toString())}<br>
//           <br>
//           Zoom link to join: <a href="${salon.zoomJoinUrl}">${salon.zoomJoinUrl}</a> <br>
//           <br>
//           Join the world of conversation and enjoy your salon! <br>
//           <br>
//           Interintellect Team
//         `;

//         await sendEmail([email], subject, body);
//       }
//     } else if (salon.locationType === "IRL") {
//       for (let i = 0; i < emails.length; i++) {
//         const email = emails[i];
//         const name = names[i];
        
//         const subject = `${salon.title} meeting details`;
//         const body = `Dear ${name}, <br><br>
//           Here are the details for your upcoming in-person salon: <br>
//           <a href="${process.env.NEXTAUTH_URL}/salons/${salon.slug}">${salon.title}</a> will be held at ${salon.location}.<br>
//           Google Maps link: <a href="${salon.locationUrl}">${salon.locationUrl}</a> <br>
//           Date and time: ${getLocalDateFromUTC(salon.startTime.toString())} at ${getLocalTimeFromUTC(salon.startTime.toString())}<br>
//           <br>
//           Feel free to reach out if you have any questions or need further information.<br>
//           Join the world of conversation and enjoy your salon! <br>
//           <br>
//           Interintellect Team
//         `;

//         await sendEmail([email], subject, body);
//       }
//     }

//   } catch (error) {
//     console.error("Error sending ticket confirmation email: ", error);
//   }
// }

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

      const subject = salon.locationType === "VIRTUAL" 
        ? `Your Zoom Details for ${salon.title}`
        : `${salon.title} meeting details`;

      const body = renderTemplate({
        salon,
        name,
        salonUrl: `${process.env.NEXTAUTH_URL}/salons/${salon.slug}`,
        date: getLocalDateFromUTC(salon.startTime.toString()),
        time: getLocalTimeFromUTC(salon.startTime.toString())
      });

      createEvent(event as any, async (error, value) => {
        if (error) {
          console.error("Error generating .ics file:", error);
          return;
        }

        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, `invite_${salon.id}_${i}.ics`);
        fs.writeFileSync(filePath, value);

        await sendEmail([email], subject, body, false, [
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

    // const count = await getSalonCountByHostId(hostId);

    let body = "";
    let subject = "";

    const renderTemplate = pug.compileFile(pugEmailConfirmationTemplatePath);

    subject = `Thank you for submitting the salon: ${salon.title}`;
    body = renderTemplate({
      salon,
      host
    });

    // if (count === 1) {
    //   subject = `Congratulations on listing your first Salon! ${salon.title}`;
    //   body = `
    //     <p>Dear ${host.name},</p>
    //     <p>Welcome to a world where minds meet and ideas flourish. To finalize the publication process and receive payment for your events, please ensure the following requirement is met:</p>
    //     <p><b>Payment Setup:</b></p>
    //     <ol>
    //         <li>Confirm your Stripe account.</li>
    //         <li>Please send tax forms to <a href="mailto:hello@interintellect.com">hello@interintellect.com</a>.</li>
    //     </ol>
    //     <p>For US taxpayers: complete the <a href="https://www.irs.gov/pub/irs-pdf/fw9.pdf">W9 form</a>.</p>
    //     <p>For non-US taxpayers: complete the <a href="https://www.irs.gov/pub/irs-pdf/fw8ben.pdf">W8-BEN form</a>.</p>
    //     <p>All the best,</p>
    //     <p>Interintellect Team</p>
    //   `;
    // } else {
    //   subject = `Thank you for submitting the salon: ${salon.title}`;
    //   body = `
    //     Thank you for submitting your salon! <br>
    //     <br>
    //     We're thrilled to have you join our community of intellectual explorers. Your efforts in hosting these conversations help create a vibrant space where minds meet and ideas grow.  <br>
    //     <br>
    //     We will review your submission and get back to you shortly with the next steps. <br>
    //     <br>
    //     Interintellect Team
    //   `;
    // }
    await sendEmail([host.email], subject, body, true);
  } catch (error) {
    console.error("Error sending ticket confirmation email: ", error);
  }
}

export async function emailSalonApproval(salonId: string, hostId: string): Promise<void> {
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

    if (count === 1) {
      subject = "Congratulations on listing your first salon!";
      htmlBody = compiledFunction({
        count,
        host,
        salon,
      });
    } else {
      subject = "Your salon has been approved!";
      htmlBody = compiledFunction({
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
      subject = `Event Canceled: ${options?.salonTitle}`;
      body = `${userName} has canceled the following event: ${eventLink}.`;
    } else if (type === "edited" && options?.changes) {
      const changes = options.changes;
      if (changes.title || changes.description) {
        subject = `Event Edited: ${options?.salonTitle}`;
        body = `${userName} has edited the description of the following event: ${eventLink}.`;
      } else if (changes.startTime || changes.endTime) {
        subject = `Event Rescheduled: ${options?.salonTitle}`;
        body = `${userName} has rescheduled the following event: ${eventLink}.<br>`;
        if (changes.startTime) {
          body += `Date changed from ${formatValue(changes.startTime.old)} to ${formatValue(changes.startTime.new)}.<br>`;
        }
        if (changes.endTime) {
          body += `End time changed from ${formatValue(changes.endTime.old)} to ${formatValue(changes.endTime.new)}.<br>`;
        }
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
      } else {
        subject = `Event Updated: ${options?.salonTitle}`;
        body = `${userName} has updated the following event: ${eventLink}.`;
      }
    } else {
      subject = `Event Created: ${options?.salonTitle}`;
      body = `The following event has been created: ${eventLink}.`;
    }

    await sendEmailToAdmins(subject, body, type);
  } catch (error) {
    console.error("Error sending event notification email: ", error);
  }
}

// export async function notifyPurchaseEvent(ticketInfo: StripeTicketData, paymentIntent: Stripe.Response<Stripe.PaymentIntent>): Promise<void> {
//   try {
//     const salon = await getSalonById(ticketInfo.salonId);
//     if (!salon) {
//       throw new Error("Salon not found.");
//     }
//     const body = `
//       <p>Purchase Event has Occurred for the following salon:</p>
//       <p><a href="${process.env.NEXTAUTH_URL}/salons/${salon.slug}">${salon.title}</a></p>
//       <p>${ticketInfo.customerEmail} bought ${ticketInfo.attendees.length} ticket(s)
//       <p>More info can be found at the Stripe: ${JSON.stringify(paymentIntent)}</p>
//     `;
//     let subject = `Purchase Event has Occurred for the salon ${salon.title}`;
//     await sendEmail([process.env.EMAIL_NOTIFY!], subject, body);
//   } catch (error) {
//     console.error("Error sending ticket confirmation email: ", error);
//   }
// }

export async function notifyPurchaseEvent(ticketInfo: StripeTicketData, paymentIntent: Stripe.Response<Stripe.PaymentIntent>): Promise<void> {
  try {
    const salon = await getSalonById(ticketInfo.salonId);
    if (!salon) {
      throw new Error("Salon not found.");
    }
    
    const subject = `Ticket purchased for the salon ${salon.title}`;
    
    const body = `
      <p>The checkout was completed by ${ticketInfo.customerEmail}.</p>
    `;
    
    await sendEmail([process.env.EMAIL_NOTIFY!], subject, body);
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
    await sendEmail([process.env.EMAIL_NOTIFY!], subject, body);
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
    await sendEmail([process.env.EMAIL_NOTIFY!], subject, body);
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
