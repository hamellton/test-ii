import Layout from "@components/Layout/Layout";
import { Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link"; 

export default function Legal() {
  return (
    <Layout>
      <Container sx={{
        mt: 10
      }}>
        <div>
          <Typography id="terms" variant="h1" gutterBottom>
            Terms of Service
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Effective Date: March 22, 2024
          </Typography>

          <Typography paragraph>
            Welcome to Interintellect! These Terms of Service (`&quot;`Terms`&quot;`) govern your use of the Interintellect website, services, and related content (`&quot;`Service`&quot;`). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Service.
          </Typography>

          {/* Section 1 */}
          <Typography variant="h2" gutterBottom>
            1. Using Interintellect
          </Typography>

          {/* Eligibility */}
          <Typography variant="h3" gutterBottom>
            Eligibility
          </Typography>
          <Typography paragraph>
            You must be at least 18 years old to use our Service. By agreeing to these Terms, you represent and warrant that you are of legal age.
          </Typography>

          {/* Account Registration */}
          <Typography variant="h3" gutterBottom>
            Account Registration
          </Typography>
          <Typography paragraph>
            To access certain features of our Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Typography>

          {/* Content */}
          <Typography variant="h3" gutterBottom>
            Content
          </Typography>
          <Typography paragraph>
            Content provided through our Service is intended for informational, entertainment, and educational purposes only. Interintellect does not guarantee the accuracy, completeness, or usefulness of any content.
          </Typography>

          {/* Section 2 */}
          <Typography variant="h2" gutterBottom>
            2. Membership and Tickets
          </Typography>

          {/* Subscriptions */}
          <Typography variant="h3" gutterBottom>
            Subscriptions
          </Typography>
          <Typography paragraph>
            Interintellect offers both monthly and yearly subscription plans. Details of subscription benefits and fees are provided on our website.
          </Typography>

          {/* Ticket Purchases */}
          <Typography variant="h3" gutterBottom>
            Ticket Purchases
          </Typography>
          <Typography paragraph>
            Interintellect offers tickets for various intellectual events and discussions. Tickets can be purchased by both members and non-members of the Interintellect community.
          </Typography>

          {/* Member Discounts */}
          <Typography variant="h3" gutterBottom>
            Member Discounts
          </Typography>
          <Typography paragraph>
            Members of Interintellect are eligible for discounts on event tickets. If the quota for member seats at an event is exceeded, members may still purchase tickets at a discounted rate, subject to availability.
          </Typography>

          {/* Payment and Confirmation */}
          <Typography variant="h3" gutterBottom>
            Payment and Confirmation
          </Typography>
          <Typography paragraph>
            Upon successful payment, you will receive confirmation of your ticket purchase via email. Please ensure your email address is entered correctly at checkout.
          </Typography>

          {/* Cancellation and Refund */}
          <Typography variant="h3" gutterBottom>
            Cancellation and Refund
          </Typography>
          <Typography paragraph>
            You may cancel your subscription at any time. Please note that refunds are subject to the terms outlined on our website.
          </Typography>

          {/* Event Attendance */}
          <Typography variant="h3" gutterBottom>
            Event Attendance
          </Typography>
          <Typography paragraph>
            Tickets are issued to you personally and cannot be transferred without the consent of Interintellect.
          </Typography>


          {/* Section 3: User Conduct */}
          <Typography variant="h5" gutterBottom>
            3. User Conduct
          </Typography>
          <Typography paragraph>
            You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service. Prohibited activities include, but are not limited to, spamming, infringing on intellectual property rights, and harassing other users.
          </Typography>

          {/* Section 4: Intellectual Property */}
          <Typography variant="h5" gutterBottom>
            4. Intellectual Property
          </Typography>
          <Typography paragraph>
            The Service and its original content, features, and functionality are owned by Interintellect and are protected by copyright, trademark, and other intellectual property laws.
          </Typography>

          {/* Section 5: Links To Other Websites */}
          <Typography variant="h5" gutterBottom>
            5. Links To Other Websites
          </Typography>
          <Typography paragraph>
            Our Service may contain links to third-party websites or services that are not owned or controlled by Interintellect. We are not responsible for the content, privacy policies, or practices of any third-party websites or services.
          </Typography>

          {/* Section 6: Termination */}
          <Typography variant="h5" gutterBottom>
            6. Termination
          </Typography>
          <Typography paragraph>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, a breach of the Terms.
          </Typography>

          {/* Section 7: Changes to Terms */}
          <Typography variant="h5" gutterBottom>
            7. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on our website.
          </Typography>

          {/* Section 8: Contact Us */}
          <Typography variant="h5" gutterBottom>
            8. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms, please contact us at <Link href="mailto:support@interintellect.com">support@interintellect.com</Link>
          </Typography>

          {/* Privacy Policy and Legal Information */}
          <Typography id="privacy" variant="h1" gutterBottom>
            Privacy Policy and Legal Information
          </Typography>
          <Typography paragraph>
            <strong>Effective Date: March 22, 2024</strong>
          </Typography>
          <Typography paragraph>
            Welcome to Interintellect! We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at <Link href="mailto:support@interintellect.com">support@interintellect.com</Link>
          </Typography>
          <Typography paragraph>
            This privacy notice describes how we might use your information if you:
          </Typography>
          <Typography paragraph>
            - Visit our website at <Link href="https://interintellect.com">https://interintellect.com</Link><br />
            - Engage with us in other related ways ― including any sales, marketing, or events
          </Typography>

          {/* How Do We Use Your Information? */}
          <Typography variant="h6" gutterBottom>
            2. How Do We Use Your Information?
          </Typography>
          <Typography paragraph>
            We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.
            We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </Typography>
          <Typography paragraph>
            - To facilitate account creation and login processes.<br />
            - To send you marketing and promotional communications.<br />
            - To fulfill and manage your orders, payments, returns, and exchanges made through the Services.<br />
            - To post testimonials with your Consent.<br />
            - To request feedback and contact you about your use of the Services.<br />
            - To protect our Services.<br />
            - For other business purposes.
          </Typography>

          {/* Will Your Information Be Shared With Anyone? */}
          <Typography variant="h6" gutterBottom>
            3. Will Your Information Be Shared With Anyone?
          </Typography>
          <Typography paragraph>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </Typography>

          {/* How Long Do We Keep Your Information? */}
          <Typography variant="h6" gutterBottom>
            4. How Long Do We Keep Your Information?
          </Typography>
          <Typography paragraph>
            We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
          </Typography>

          {/* How Do We Keep Your Information Safe? */}
          <Typography variant="h6" gutterBottom>
            5. How Do We Keep Your Information Safe?
          </Typography>
          <Typography paragraph>
            We aim to protect your personal information through a system of organizational and technical security measures.
          </Typography>

          {/* Do We Collect Information from Minors? */}
          <Typography variant="h6" gutterBottom>
            6. Do We Collect Information from Minors?
          </Typography>
          <Typography paragraph>
            We do not knowingly collect data from or market to children under 18 years of age.
          </Typography>

          {/* What Are Your Privacy Rights? */}
          <Typography variant="h6" gutterBottom>
            7. What Are Your Privacy Rights?
          </Typography>
          <Typography paragraph>
            You may review, change, or terminate your account at any time.
            If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority.
          </Typography>

          {/* Controls for Do-Not-Track Features */}
          <Typography variant="h6" gutterBottom>
            8. Controls for Do-Not-Track Features
          </Typography>
          <Typography paragraph>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
          </Typography>

          {/* Do California Residents Have Specific Privacy Rights? */}
          <Typography variant="h6" gutterBottom>
            9. Do California Residents Have Specific Privacy Rights?
          </Typography>
          <Typography paragraph>
            Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.
          </Typography>

          {/* Updates to This Notice */}
          <Typography variant="h6" gutterBottom>
            10. Updates to This Notice
          </Typography>
          <Typography paragraph>
            We may update this privacy notice from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible.
          </Typography>

          {/* Content Streaming and Sharing Section */}
          <Typography variant="h5" gutterBottom>
            11. Content Streaming and Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            In Short: We may stream and share content featuring our members and attendees on platforms such as YouTube and our website.
          </Typography>
          <Typography variant="body1" paragraph>
            With your participation in Interintellect events, you acknowledge that these events may be streamed live or recorded for later viewing. Content featuring our members, including discussions, presentations, and interactions, may be shared on public platforms like YouTube and our website to reach a wider audience and engage our community.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Consent for Multimedia Use:</strong> By participating in our events, you grant Interintellect the permission to use images, video, and audio recordings taken during events that may include your likeness, voice, and contributions in our promotional materials, educational content, and on social media platforms. We commit to using this content respectfully and in line with enhancing our community’s reach and impact.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Opt-Out and Consent Withdrawal:</strong> We respect your privacy and give you control over your personal information. If you wish to opt-out of having your likeness or contributions included in our streamed or recorded content, please inform us prior to the event or contact us at <Link href="mailto:support@interintellect.com">support@interintellect.com</Link>. You have the right to withdraw your consent at any time, and we will make reasonable efforts to accommodate your preferences.
          </Typography>

          {/* Contact Us Section */}
          <Typography variant="h3" gutterBottom>
            12. How Can You Contact Us About This Notice?
          </Typography>
          <Typography variant="body1" paragraph>
            If you have questions or comments about this notice, you may email us at <Link href="mailto:support@interintellect.com">support@interintellect.com</Link>.
          </Typography>


          {/* Cookie Policy Section */}
          <Typography id="cookie" variant="h1" gutterBottom>
            Cookie Policy
          </Typography>
          <Typography variant="body1" paragraph>
            At <Link href="https://interintellect.com">https://interintellect.com</Link>, we use cookies to enhance your experience with our website. This Cookie Policy explains how and why cookies and similar technologies may be stored on and accessed from your device when you use or visit: <Link href="https://interintellect.com">https://interintellect.com</Link>
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>What are Cookies?</strong> Cookies are small text files that are placed on your device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>How do we use Cookies?</strong> We use cookies to understand how you use our website, to personalize your experience, and to improve our services. Cookies help us with:
          </Typography>
          <Typography component="ul" variant="body1">
            <li>Keeping you signed in</li>
            <li>Understanding how you navigate through our site</li>
            <li>Improving your browsing experience</li>
            <li>Personalizing content and ads to your interests</li>
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Your Choices Regarding Cookies.</strong> If you prefer to avoid the use of cookies on our website, first you must disable the use of cookies in your browser and then delete the cookies saved in your browser associated with this website. You may use this option for preventing the use of cookies at any time.
          </Typography>
          <Typography variant="body1" paragraph>
            If you do not accept our cookies, you may experience some inconvenience in your use of our website and some features may not function properly.
          </Typography>
          <Typography variant="body1" paragraph>
            For more information on how to manage and delete cookies, visit <Link href="https://interintellect.com">https://interintellect.com</Link>.
          </Typography>

          {/* Disclaimer Section */}
          <Typography variant="h3" gutterBottom>
            Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            The information provided by Interintellect (`&quot;`we,`&quot;` `&quot;`us,`&quot;` or `&quot;`our`&quot;`) on <Link href="https://interintellect.com">https://interintellect.com</Link> (the`&quot;`Site`&quot;`) is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
          </Typography>

          {/* Copyright Notice Section */}
          <Typography variant="h5" gutterBottom>
            Copyright Notice
          </Typography>
          <Typography variant="body1" paragraph>
            © 2021-2024 Pynchon Ideas Inc. All rights reserved. All content on this website, including texts, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of Pynchon Ideas Inc or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of Pynchon Ideas Inc., with copyright authorship for this compilation by Pynchon Ideas Inc.. Unauthorized reproduction or distribution of any material from this site is strictly prohibited.
          </Typography>

          {/* Accessibility Statement Section */}
          <Typography variant="h1" gutterBottom>
            Accessibility Statement
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Effective Date: March 22, 2024</strong>
          </Typography>
          <Typography variant="body1" paragraph>
            Interintellect is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to achieve these goals.
          </Typography>

          {/* Measures to Support Accessibility */}
          <Typography variant="h6" gutterBottom>
            Measures to Support Accessibility
          </Typography>
          <Typography component="ul" variant="body1">
            <li>Include accessibility as part of our mission statement.</li>
            <li>Integrate accessibility into our procurement practices.</li>
            <li>Provide continual accessibility training for our staff.</li>
            <li>Assign clear accessibility targets and responsibilities.</li>
            <li>Employ formal accessibility quality assurance methods.</li>
          </Typography>

          {/* Conformance Status */}
          <Typography variant="h6" gutterBottom>
            Conformance Status
          </Typography>
          <Typography variant="body1" paragraph>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. <Link href="https://interintellect.com">https://interintellect.com</Link> is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </Typography>

          {/* Feedback Section */}
          <Typography variant="h6" gutterBottom>
            Feedback
          </Typography>
          <Typography variant="body1" paragraph>
            We welcome your feedback on the accessibility of <Link href="https://interintellect.com">https://interintellect.com</Link>. Please let us know if you encounter accessibility barriers on <Link href="mailto:support@interintellect.com">support@interintellect.com</Link>. We try to respond to feedback within 5 working days.
          </Typography>

          {/* Technical Specifications */}
          <Typography variant="h6" gutterBottom>
            Technical Specifications
          </Typography>
          <Typography variant="body1" paragraph>
            Accessibility of <Link href="https://interintellect.com">https://interintellect.com</Link> relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer: HTML, CSS, JavaScript, WAI-ARIA. These technologies are relied upon for conformance with the accessibility standards used.
          </Typography>

          {/* Limitations and Alternatives */}
          <Typography variant="h6" gutterBottom>
            Limitations and Alternatives
          </Typography>
          <Typography variant="body1" paragraph>
            Despite our best efforts to ensure accessibility of <Link href="https://interintellect.com">https://interintellect.com</Link>, there may be some limitations. Below is a description of known limitations, and potential solutions. Please contact us if you observe an issue on <Link href="mailto:support@interintellect.com">support@interintellect.com</Link>.
          </Typography>
          {/* Assessment Approach Section */}
          <Typography variant="h5" gutterBottom>
            Assessment Approach
          </Typography>
          <Typography variant="body1" paragraph>
            Interintellect assessed the accessibility of <a href="https://interintellect.com" target="_blank" rel="noopener noreferrer">https://interintellect.com</a> by the following approaches:
          </Typography>
          <Typography component="ul" variant="body1">
            <li>Self-evaluation</li>
            <li>External evaluation [if applicable]</li>
          </Typography>

          {/* Formal Complaints Section */}
          <Typography variant="h5" gutterBottom>
            Formal Complaints
          </Typography>
          <Typography variant="body1" paragraph>
            We aim to respond to accessibility feedback within 5 business days, and to propose a solution within 20 business days.
          </Typography>
        </div>

      </Container>
    </Layout>
  );

}