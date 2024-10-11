import React from 'react';
import { Typography, Box, Container, List, ListItem, ListItemText } from '@mui/material';
import Layout from '@components/Layout/Layout';

const CodeOfConduct = () => {
  return (
    <Layout>
      <Container sx={{
        mt: 10
      }}>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Code of Conduct for Interintellect Salons
          </Typography>

          <Typography variant="h5" gutterBottom>
            Expectations
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc' }}>
            <Box component="li">
              Interintellect Salons are collaborative discussions hosted by a fellow member on specific topics.
            </Box>
            <Box component="li">
              These events are designed to foster multidisciplinary dialogue, curiosity, and balanced participation, encouraging both deep dives and the exploration of new questions.
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Participation
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc' }}>
            <Box component="li">
              Punctuality: Arrive on time; and notify a host if you need to leave early.
            </Box>
            <Box component="li">
              Engagement: Active participation is required; no passive attendance.
            </Box>
            <Box component="li">
              Respect: Wait your turn, raise your hand to speak, and avoid interruptions.
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Technical Guidelines
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc' }}>
            <Box component="li">
              Audio/Video: Keep your microphone muted when not speaking. Video should be on during participation unless an exception is granted by the host.
            </Box>
            <Box component="li">
              Recordings: Events are generally not recorded unless specified. Member-only recordings remain exclusive to members.
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Conduct
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc' }}>
            <Box component="li">
              Respect and Inclusivity: Engage respectfully, avoiding topics or tones that may be uncomfortable to others in a salon, video, or livestream.
            </Box>
            <Box component="li">
              Privacy and Intellectual Property: Do not share personal information of an individual, without prior consent; avoid sharing copyrighted materials.
            </Box>
            <Box component="li">
              Behavior: No hate speech, harassment, or bullying. Engage in lawful activities only.
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Enforcement
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc' }}>
            <Box component="li">
              Violations of these guidelines may lead to removal from a salon, with potential bans for severe or repeated offenses.
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Miscellaneous
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc' }}>
            <Box component="li">
              Screenshots: Hosts may take screenshots for social sharing; you can opt out by notifying the host ahead of a salon.
            </Box>
            <Box component="li">
              Age Restrictions: Some topics may be restricted to an 18+ audience due to content sensitivity.
            </Box>
          </Box>

          <Typography paragraph>
            Thank you for maintaining the standards of our community and contributing to enriching discussions. Enjoy your Salon!
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default CodeOfConduct;
