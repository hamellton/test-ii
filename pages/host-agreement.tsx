import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, Box, Link } from '@mui/material';
import Layout from '@components/Layout/Layout';
import { logHostingFAQClick } from '@utils/analytics-helpers';

const HostingPublicEvents = () => {
  return (
    <Layout>
      <Container sx={{
        mt: 10
      }}>
        <Box sx={{
          textAlign: 'center',
          maxWidth: '700px',
          margin: 'auto',
        }}>
          <Box>
            <Typography variant="h3" gutterBottom>
              HOSTING PUBLIC EVENTS AT INTERINTELLECT
            </Typography>

            <Typography variant="h6" gutterBottom>
              The Revised Agreement Between Interintellect and Hosts
            </Typography>

            <Typography variant="body1" gutterBottom>
              Pynchon Ideas, Inc.
            </Typography>

            <Typography variant="body1" gutterBottom>
              www.interintellect.com
            </Typography>

            <Typography variant="body1" gutterBottom>
              May 2024. Last revised 5/25/2024
            </Typography>

            <Typography variant="h5" gutterBottom>
              Congratulations on listing your event!
            </Typography>

            <Typography variant="body1" gutterBottom>
              Interintellect is a global community built on the principles of open-minded conversation, intellectual play, deep personal connections, and inspiring change.
            </Typography>

          </Box>

        </Box>

        <Typography variant="h6" gutterBottom>
          Welcome Interintellect Hosts
        </Typography>
        <Typography variant="body1" gutterBottom>
          Interintellect events are discussions that typically span around one to three hours, either online or in-person, curated and led by passionate hosts within the Interintellect community. These gatherings foster an environment of inclusivity, where diverse perspectives converge to explore a chosen topic.
        </Typography>

        <Typography variant="body1" gutterBottom>
          Read our FAQ to find out more. <Link href="/faq" onClick={logHostingFAQClick}>here</Link>
        </Typography>

        <Typography variant="body1" gutterBottom>
          Our events embody the principles of multidisciplinarity, fostering an atmosphere of openness, embracing a variety of viewpoints, fueled by curiosity and patience. The aim is not only to discuss the event&apos;s subject matter but also to ask further questions that may inspire future discussions.
        </Typography>

        <Typography variant="body1" gutterBottom>
          Some events will be more focused on a single speaker, while others, such as workshops and book clubs, will encourage the attendees to join in. Please read the description for each event to understand its structure better.
        </Typography>

        <Divider sx={{
          m: 4,
        }} />

        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" gutterBottom>
          Begin your hosting journey by referring to the following resources:
        </Typography>

        <Typography variant="h6" gutterBottom>
          Guide to Listing an Event
        </Typography>
        <Typography variant="body1" gutterBottom>
          Ensure your event or series meets three requirements within 24 hours of submission:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Create a host account.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Set up payment.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Complete and submit the W9 form (for US taxpayers) or W8-BEN form (for non-US taxpayers).
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Create a new Zoom account, which you&apos;ll provide to us.
            </Typography>
          </li>
        </ul>
        <Typography variant="body1" gutterBottom>
          Once submitted, we&apos;ll upgrade your Zoom account to a paid version at no cost, ensuring everything is set for your event.
        </Typography>

        <Typography variant="h6" gutterBottom>
          A guide to listing your event in easy steps:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Create a host profile
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              List your first event
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Spend some time writing a great title and description of what you will talk about
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Allow 48 hours for a review of your event, during which you may receive editorial help or feedback
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              After editorial review, your event will be published
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Promote your event on social media, in your newsletter, or record a video about your event, and we’ll retweet it (Interintellect socials: X, Instagram, Facebook, LinkedIn)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Visit Discord to share your event with the community
            </Typography>
          </li>
        </ul>

        <Divider sx={{
          m: 4,
        }} />

        <Typography variant="h6" gutterBottom>
          Promotion
        </Typography>
        <Typography variant="body1" gutterBottom>
          Promoting your event is key to its success and the growth of the Interintellect community. While the Interintellect team supports your efforts, the primary responsibility lies with the host. Your promotion efforts extend our reach, boost attendance, and draw new members into our community.
        </Typography>
        <Typography variant="body1" gutterBottom>
          We recommend allocating at least 10 days for promotion after listing your event, ideally submitting it around 12 days before the hosting date. The Interintellect team reserves the right to decline to publish an event with insufficient promotion time.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Consider these promotion avenues:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Discord: Engage with the community in one of our many channels and DM community members to share details about your event.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Twitter: Engage with @interintellect_, retweet event-related tweets, share your thoughts, readings, and media, and interact with relevant conversations.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Personal Channels: Spread the word through your own newsletter or blog posts.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Emails/DMs: Reach out to individuals or groups through professional, academic, or interest-based platforms.
            </Typography>
          </li>
        </ul>
        <Typography variant="body1" gutterBottom>
          The more you work on sharing the news about your event with others, the more success your event will have.
        </Typography>
        <Divider sx={{
          m: 4,
        }} />
        <Typography variant="h6" gutterBottom>
          Changes Regarding Membership Plans
        </Typography>
        <Typography variant="body1" gutterBottom>
          Interintellect has made some changes to its membership plans in an effort to provide a better experience to members.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Beginner Plan
        </Typography>
        <Typography variant="body1" gutterBottom>
          $15.99 per month or $154.99 per year
        </Typography>
        <Typography variant="body1" gutterBottom>
          Members who are currently on a Monthly Plan will be moved to the Beginner Plan, and have 1 free code per month (excluded of 30% discount on yearly events).
        </Typography>
        <Typography variant="body1" gutterBottom>
          Members who are currently on a Yearly Plan will be moved to the Beginner Plan and will receive 1 free code per month in addition to a 30% discount on public tickets.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Members who fall in this category will be offered a discount if they wish to upgrade to the yearly plan.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Intellectual Explorer Plan
        </Typography>
        <Typography variant="body1" gutterBottom>
          $24.99 per month or $239.99 per year
        </Typography>

        <Divider sx={{
          m: 4,
        }} />

        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <Typography variant="body1" gutterBottom>
          Members currently on any membership plans, excluding the SuperSupporter and Student Plan, can upgrade to a yearly membership for $179.99 until May 21st, 2024.
        </Typography>
        <Divider sx={{
          m: 4,
        }} />

        <Typography variant="h6" gutterBottom>
          Attendee Communication
        </Typography>
        <Typography variant="h6" gutterBottom>
          Pre-Event Communication
        </Typography>
        <Typography variant="body1" gutterBottom>
          When tickets are offered through our website, you&apos;ll receive notifications of bookings and can access your list of attendees via your Dashboard. This dashboard serves as your command center, allowing you to monitor your event’s performance and adjust your promotion and preparation efforts accordingly.
        </Typography>

        <Typography variant="h6" gutterBottom>
          During the Event
        </Typography>
        <Typography variant="body1" gutterBottom>
          As the host, you guide a diverse group of individuals through a discussion, ensuring each participant has an opportunity for equitable participation. You&apos;ll also communicate house rules, including whether the conversation will be recorded, the preservation of the Zoom chat (accessible for forum members via channels, while others can request it via hello@interintellect.com), and the creation of a follow-up forum channel.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Stay attentive to attendees&apos; needs and behaviors throughout the event, and be prepared for private messages via Zoom chat for inquiries.
        </Typography>
        <Typography variant="body1" gutterBottom>
          As an Interintellect host, your income is derived from ticket sales, with the following breakdown:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Hosts earn 85% of Individual event sales.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              For non-members, in addition to the price of non-member tickets, Interintellect charges a 30% platform fee (subject to change); the proceeds minus the platform fee go to the host.
            </Typography>
          </li>
        </ul>
        <Typography variant="body1" gutterBottom>
          Payments are manually processed, with US hosts paid via Stripe and international hosts via TransferWise.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please note that currently we do not offer an invoicing service for hosts or creators. It is your responsibility to track payments through your bank statements. For tax-related inquiries or information, such as our company address and VAT-ID, please contact us at hello@interintellect.com.
        </Typography>
        <Divider sx={{
          m: 4,
        }} />
        <Typography variant="h6" gutterBottom>
          Zoom Housekeeping
        </Typography>
        <Typography variant="h6" gutterBottom>
          Zoom Account and Setup
        </Typography>
        <Typography variant="body1" gutterBottom>
          Interintellect provides hosts with access to Zoom licenses for their events. To publish your event, you&apos;ll need to create an Interintellect Zoom User Account. This account, shared with Interintellect, grants you the ability to initiate and manage your online events.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Once your event is published, we&apos;ll send you a reminder with your Interintellect Zoom User Account email. However, your password and sign-in verification remain private to you. This process involves two steps: providing us with your email address and logging into your dedicated Interintellect Zoom User Account to approve the request. If you don&apos;t have an Interintellect Zoom user account, you&apos;ll receive an email with instructions after your event is published.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please ensure you have your Zoom link at least 24 hours before your event. If you encounter any issues receiving it, please contact the Interintellect team.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Event Conduct on Zoom
        </Typography>
        <Typography variant="body1" gutterBottom>
          During your event, it&apos;s essential to uphold certain practices:
        </Typography>
        <Typography component="ul" variant="body1">
          <li>
            <Typography variant="body1">Add &apos;Host&apos; to your Zoom name.</Typography>
          </li>
          <li>
            <Typography variant="body1">Ensure all attendees are muted when not speaking.</Typography>
          </li>
          <li>
            <Typography variant="body1">Encourage attendees to turn on their video when speaking.</Typography>
          </li>
          <li>
            <Typography variant="body1">Use the Gallery View.</Typography>
          </li>
          <li>
            <Typography variant="body1">Have notes prepared to guide the discussion.</Typography>
          </li>
          <li>
            <Typography variant="body1">Keep an eye on private messages for attendee inquiries.</Typography>
          </li>
          <li>
            <Typography variant="body1">Prompt latecomers with any introductory questions shared in the chat.</Typography>
          </li>
          <li>
            <Typography variant="body1">After the event, promptly submit event documentation via the provided form.</Typography>
          </li>
        </Typography>

        <Typography variant="h6" gutterBottom>
          Event Documentation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Following your event, submitting accurate documentation is crucial:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Take a screenshot of attendees during the first hour when all participants are present. Remove names before submission.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Save the Zoom chat in a Google Document for editing and privacy reasons.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              For workshop events, log the output in your Discord host channel and share it with hello@interintellect.com for wider dissemination.
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" gutterBottom>
          Post-event Recaps
        </Typography>
        <Typography variant="body1" gutterBottom>
          Post-event recaps summarize the key points raised during your event. These one-paragraph summaries omit private information or opinions expressed by attendees. They serve to preserve the essence of the event and can be shared across Interintellect channels to engage potential attendees for future events.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Optional Documentation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Feel free to share any additional notes, readings, or tweets after your event. Your host channel is an excellent platform for post-event engagement and generating interest in upcoming events. Remember to celebrate your hosting achievements—it&apos;s a significant endeavor!
        </Typography>

        <Divider sx={{
          m: 4,
        }} />
        <Typography variant="h6" gutterBottom>
          Event Frequency
        </Typography>
        <Typography variant="body1" gutterBottom>
          Determining how often to host an Interintellect event is essential for maintaining engagement and momentum within the community. Here&apos;s our recommendation:
        </Typography>
        <Typography variant="body1" gutterBottom>
          Frequency: Aim for an event frequency ranging from every 10 days to every 30 days. This balance allows hosts ample time for preparation while ensuring attendees can establish a routine of attending your events. Additionally, hosting within this timeframe enables you to accumulate valuable &apos;pilot hours&apos; and refine your hosting skills.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Planning ahead: We suggest having 3-4 event ideas ready to go on the website at all times. This proactive approach alleviates pressure during hosting, preventing it from feeling like a one-time opportunity. It also assists in managing your energy and time effectively.
        </Typography>

        <Divider sx={{
          m: 4,
        }} />

        <Typography variant="h6" gutterBottom>
          Event Series
        </Typography>
        <Typography variant="body1" gutterBottom>
          For hosts interested in hosting a series of events, more information is available on the event types page. Event series and tracks offer a deeper exploration of a topic over multiple sessions, fostering sustained engagement and deeper discussions among participants. Please review the Hosting a Series documentation for specific guidelines and conditions.
        </Typography>
        <Typography variant="body1" gutterBottom>
          By publishing and advertising an Interintellect event as a host or co-host, you have agreed to the above terms and our workflow. (Should there be any changes to the terms or workflow, these will be communicated to you and a new agreement will be shared with you before the updated terms apply.)
        </Typography>
        <Divider sx={{
          m: 4,
        }} />
        <Typography variant="h6" gutterBottom>
          Host Agreement and Conduct Standards
        </Typography>
        <Typography variant="body1" gutterBottom>
          Before proceeding, ensure you&apos;ve thoroughly reviewed and understood the Code of Conduct, which serves as the foundation for the expectations your attendees hold regarding Interintellect events.
        </Typography>
        <Typography variant="body1" gutterBottom>
          It&apos;s also important that you read this Host Agreement carefully, because it explains what Interintellect expects from you as a host.
        </Typography>

        <Divider sx={{
          m: 4,
        }} />
        <Typography variant="h6" gutterBottom>
          Host Training and Resources
        </Typography>

        <Typography variant="body1" gutterBottom>
          For existing Forum members:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Hosting resources can be found in the #💚 host_greenroom Discord channel.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              This channel is a great place to ask questions about hosting. You will also receive tips from experienced hosts on how to host a good event.
            </Typography>
          </li>
        </ul>
        <Typography variant="body1" gutterBottom>
          Every month, we conduct Host Training sessions facilitated by either an Interintellect team member or an experienced host. These sessions cover tips, address queries, and are recorded for future reference.
        </Typography>

        <Typography variant="body1" gutterBottom>
          As a host, you will be able to earn badges for your achievements, e.g., being a regular host, a high-earning host, or for training other hosts. Badges will allow you to release more paid tickets beyond the 50% member seat limit (Yes: hosting on the old platform will count towards your badges!).
        </Typography>

        <Typography variant="body1" gutterBottom>
          The following section is accessible exclusively to logged-in hosts. Here are direct links to the
        </Typography>

        <Typography variant="body1" gutterBottom>
          Embarking on Your Journey as an Interintellect Host
        </Typography>

        <Typography variant="body1" gutterBottom>
          As always, your primary point of contact remains hello@interintellect.com.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Connecting with the Interintellect Team
        </Typography>

        <Typography variant="body1" gutterBottom>
          If you need to reach out to the Interintellect team, the quickest and most efficient way is via email at hello@interintellect.com.
        </Typography>

        <Typography variant="body1" gutterBottom>
          If you have any questions, get in touch!
        </Typography>

        <Typography variant="body1" gutterBottom>
          Great to have you on board!
        </Typography>

        <Typography variant="body1" gutterBottom>
          Best,
        </Typography>

        <Typography variant="body1" gutterBottom>
          The Interintellect Team
        </Typography>
      </Container>
    </Layout>
  )

}

export default HostingPublicEvents;