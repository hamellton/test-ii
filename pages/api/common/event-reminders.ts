import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { PrismaClient, Salon } from "@prisma/client";

const prisma = new PrismaClient();

export const createGoogleCalendarEventUrl = (salon: Salon) => {
  const event = {
    title: salon.title,
    start: new Date(salon.startTime).toISOString().replace(/[:-]/g, ""),
    end: new Date(salon.endTime).toISOString().replace(/[:-]/g, ""),
    description: salon.description,
    location: salon.locationType === "VIRTUAL" ? "Online" : "In Person",
  };

  const textParam = `&text=${encodeURIComponent(event.title)}`;
  const datesParam = `&dates=${event.start}/${event.end}`;
  const detailsParam = `&details=${encodeURIComponent(event.description)}`;
  const locationParam = `&location=${encodeURIComponent(event.location)}`;
  const result = `${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TEMPLATE}${textParam}${datesParam}${detailsParam}${locationParam}`;
  return result;
  // window.open(result, "_blank", "noopener,noreferrer");
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const sendEmailReminder = async (to: string, subject: string, message: { name: string; content: string }) => {
  const body = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body { height: 100%; }
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .email-container { max-width: 635px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 0 20px 20px 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); min-height: 600px; }
          .email-header { height: 250px; display: flex; justify-content: center; align-items: center; overflow: hidden; margin: 0 auto; }
          .email-header img { height: 325px; margin: 0 auto; }
          .email-body h1 { font-size: 24px; color: #333; margin-bottom: 20px; }
          .email-body p { font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px; }
          .email-footer { font-size: 12px; color: #777; text-align: center; margin-top: 120px; margin-bottom: 100px; }
          .email-footer a { color: #777; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <img src="https://interintellect.nyc3.digitaloceanspaces.com/logos/email-logo.png" alt="Interintellect">
          </div>
          <div class="email-body">
            <p>Dear ${message.name},</p>
            <p>${message.content}</p>
          </div>
          <div class="email-footer">
            <p>© 2024 Pynchon Ideas.</p>
            <p>2810 N Church St. PMB 59729 Wilmington, Delaware 19802</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `\"Interintellect\" ${process.env.EMAIL_FROM_NOT_REPLY}`,
      to,
      subject,
      html: body,
    });
    console.log(`🚀 Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("🚀 Error sending email:", error);
  }
};

const sendReminders = async () => {
  const now = new Date();

  const salons = await prisma.salon.findMany({
    where: {
      state: "APPROVED",
      startTime: {
        gte: now,
      },
    },
    include: {
      host: true,
      coHosts: true,
      publicTickets: true,
      memberTickets: {
        include: {
          user: true,
        },
      },
      specialGuests: true,
    },
  });

  for (const salon of salons) {
    const formattedDate = new Date(salon.startTime).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
    });

    const participants = [
      { name: salon.host.name, email: salon.host.email, isHost: true },
      // ...salon.coHosts.map((coHost) => ({ name: coHost.name, email: coHost.email, isHost: false })),
      ...salon.publicTickets.map((ticket) => ({ name: ticket.name, email: ticket.email, isHost: false })),
      ...salon.memberTickets.map((ticket) => ({ name: ticket.user.name, email: ticket.user.email, isHost: false })),
    ];

    const zoomInfo = salon.locationType === "VIRTUAL"
      ? `\nZoom link to join: ${salon.zoomJoinUrl}`
      : `\nLocation: ${salon.location}`;
    
    const eventLink = `${process.env.NEXTAUTH_URL}/salon/${salon.slug}`;

    const nextNotificationTime = {
      tomorrow: salon.startTime.getTime() - 24 * 60 * 60 * 1000,
      today: salon.startTime.getTime() - 8 * 60 * 60 * 1000,
      startingSoon: salon.startTime.getTime() - 15 * 60 * 1000,
      thirtyMinutesBefore: salon.startTime.getTime() - 30 * 60 * 1000,
      threeHoursAfter: salon.endTime.getTime() + 3 * 60 * 60 * 1000,
    };

    for (const participant of participants) {
      const participantName = participant.name ?? "Participant";

      const generateContent = (timeframe: "tomorrow" | "today" | "startingSoon" | "thirtyMinutesBefore" | "threeHoursAfter", isHost: boolean) => {
        if (isHost) {
          switch (timeframe) {
          case "tomorrow":
            return `
                <p>Your salon, <a href="${eventLink}">${salon.title}</a> is taking place on ${formattedDate}.</p>
                <p>${zoomInfo}</p>
                <p>Thank you for hosting with Interintellect!</p>
                <p>Interintellect Team</p>
              `;
          case "today":
            return `
                <p>Your salon, <a href="${eventLink}">${salon.title}</a>, is taking place today at ${formattedDate}.</p>
                <p>${zoomInfo}</p>
                <p>We hope you have a wonderful event!</p>
                <p>Interintellect Team</p>
              `;
          case "startingSoon":
            return `
                <p>Your salon, <a href="${eventLink}">${salon.title}</a>, is starting in 15 minutes.</p>
                <p>${zoomInfo}</p>
                <p>Wishing you a successful salon!</p>
                <p>Interintellect Team</p>
              `;
          }
        } else {
          switch (timeframe) {
          case "tomorrow":
            if (salon.locationType === "VIRTUAL") {
              return `
                  <p><a href="${eventLink}">${salon.title}</a> is taking place on ${formattedDate}.</p>
                  <p>Zoom link to join: ${salon.zoomJoinUrl}</p>
                  <p>Add to my calendar: <a href="${createGoogleCalendarEventUrl(salon)}">Google Calendar</a></p>
                  <p>To manage your notification settings, click <a href="${process.env.NEXTAUTH_URL}/dashboard/settings">here</a></p>
                  <p>Enjoy your salon!</p>
                  <p>Interintellect Team</p>
                `;
            } else if (salon.locationType === "IRL") {
              return `
                  <p><a href="${eventLink}">${salon.title}</a> will be held at ${salon.location}.</p>
                  <p>Google Maps Link: <a href="${salon.locationUrl}">${salon.locationUrl}</a></p>
                  <p>Date and time: ${formattedDate}</p>
                  <p>Add to my calendar: <a href="${createGoogleCalendarEventUrl(salon)}">Google Calendar</a></p>
                  <p>To manage your notification settings, click <a href="${process.env.NEXTAUTH_URL}/dashboard/settings">here</a></p>
                  <p>Feel free to reach out if you have any questions or need further information.</p>
                  <p>Enjoy your salon!</p>
                  <p>Interintellect Team</p>
                `;
            }
            break;
        
          case "today":
            if (salon.locationType === "VIRTUAL") {
              return `
                  <p><a href="${eventLink}">${salon.title}</a> is taking place today at ${formattedDate}.</p>
                  <p>${zoomInfo}</p>
                  <p>Add to my calendar: <a href="${createGoogleCalendarEventUrl(salon)}">Google Calendar</a></p>
                  <p>To manage your notification settings, click <a href="${process.env.NEXTAUTH_URL}/dashboard/settings">here</a></p>
                  <p>Enjoy your salon!</p>
                  <p>Interintellect Team</p>
                `;
            } else if (salon.locationType === "IRL") {
              return `
                  <p><a href="${eventLink}">${salon.title}</a> will be held at ${salon.location}.</p>
                  <p>Google Maps link: <a href="${salon.locationUrl}">${salon.locationUrl}</a></p>
                  <p>Date and time: ${formattedDate}</p>
                  <p>Add to my calendar: <a href="${createGoogleCalendarEventUrl(salon)}">Google Calendar</a></p>
                  <p>To manage your notification settings, click <a href="${process.env.NEXTAUTH_URL}/dashboard/settings">here</a></p>
                  <p>Feel free to reach out if you have any questions or need further information.</p>
                  <p>Enjoy your salon!</p>
                  <p>Interintellect Team</p>
                `;
            }
            break;
        
          case "startingSoon":
            return `
                <p><a href="${eventLink}">${salon.title}</a> is starting in 15 minutes.</p>
                <p>${zoomInfo}</p>
                <p>Add to my calendar: <a href="${createGoogleCalendarEventUrl(salon)}">Google Calendar</a></p>
                <p>To manage your notification settings, click <a href="${process.env.NEXTAUTH_URL}/dashboard/settings">here</a></p>
                <p>Enjoy your salon!</p>
                <p>Interintellect Team</p>
              `;
          }
        }

        if (timeframe === "thirtyMinutesBefore" && isHost && salon.locationType === "VIRTUAL") {
          return `
            <p>Your online salon, <a href="${eventLink}">${salon.title}</a>, is starting in 30 minutes.</p>
            <p>${zoomInfo}</p>
            <p>Please make sure you're ready to host!</p>
            <p>Interintellect Team</p>
          `;
        }

        if (timeframe === "threeHoursAfter") {
          if (isHost) {
            if (salon.locationType === "VIRTUAL") {
              return `
                <p>Thank you for hosting <a href="${eventLink}">${salon.title}</a>.</p>
                <p>If you have a minute, we invite you to fill out this salon <a href="https://docs.google.com/forms/d/e/1FAIpQLSfDIwhPbTK1L0orZTSryvzAFB0A615uOCLJAxYliSRajM5Qkg/viewform">documentation form</a>. The material you submit through this form may be used for promotional purposes to help us grow as a community and as a platform where intellectual conversations thrive.</p>
                <p>Interintellect Team</p>
              `;
            } else {
              return `
                <p>Thank you for hosting <a href="${eventLink}">${salon.title}</a>.</p>
                <p>If you have a minute, we invite you to fill out this salon <a href="https://docs.google.com/forms/d/e/1FAIpQLSexjebbTpoTIIlIVK8wC4X9oWdvsUZrVswpHFMxnZNS5CYQNQ/viewform?pli=1">documentation form</a>. The material you submit through this form may be used for promotional purposes to help us grow as a community and as a platform where intellectual conversations thrive.</p>
                <p>Interintellect Team</p>
              `;
            }
          } else {
            return `
              <p>Thank you for attending <a href="${eventLink}">${salon.title}</a>.</p>
              <p>If you have a moment, we invite you to fill out this brief <a href="https://docs.google.com/forms/d/e/1FAIpQLSeT_yzFNpP_AZ5m6zf6TFHzBhglpLL2nkXVKbM-9FL6TlZ4-w/viewform">feedback form</a> to help us improve as hosts, as a community, and as an organization.</p>
              <p>Interintellect Team</p>
            `;
          }
        }

        return "";
      };

      if (now.getTime() >= nextNotificationTime.tomorrow && now.getTime() < nextNotificationTime.tomorrow + 60 * 1000) {
        const content = generateContent("tomorrow", participant.isHost);
        const message = { name: participantName, content };
        await sendEmailReminder(participant.email, `🔔 TOMORROW | ${salon.title}`, message);
      } else if (now.getTime() >= nextNotificationTime.today && now.getTime() < nextNotificationTime.today + 60 * 1000) {
        const content = generateContent("today", participant.isHost);
        const message = { name: participantName, content };
        await sendEmailReminder(participant.email, `🔔 TODAY | ${salon.title}`, message);
      } else if (now.getTime() >= nextNotificationTime.startingSoon && now.getTime() < nextNotificationTime.startingSoon + 60 * 1000) {
        const content = generateContent("startingSoon", participant.isHost);
        const message = { name: participantName, content };
        await sendEmailReminder(participant.email, `🔔 STARTING SOON | ${salon.title}`, message);
      }

      if (participant.isHost && salon.locationType === "VIRTUAL" && 
        now.getTime() >= nextNotificationTime.thirtyMinutesBefore && now.getTime() < nextNotificationTime.thirtyMinutesBefore + 60 * 1000) {
        const content = generateContent("thirtyMinutesBefore", participant.isHost);
        const message = { name: participantName, content };
        await sendEmailReminder(participant.email, `🔔 HAPPENING SOON | ${salon.title}`, message);
      }
      
      
      if (now.getTime() >= nextNotificationTime.threeHoursAfter && now.getTime() < nextNotificationTime.threeHoursAfter + 60 * 1000) {
        const content = generateContent("threeHoursAfter", participant.isHost);
        const message = { name: participantName, content };
        let subject;
        if (participant.isHost) {
          subject = `${salon.title}: Documentation`;
        } else {
          subject = `${salon.title}: How did we do?`;
        }
        await sendEmailReminder(participant.email, subject, message);
      }
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  await sendReminders();
  console.log("Cron job executed!");
  res.status(200).end("Cron job completed");
}
