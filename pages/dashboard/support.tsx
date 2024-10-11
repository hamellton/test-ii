import { Box, Button, Typography } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import EmailIcon from '@mui/icons-material/Email';

const EmailBlock = ({ leadText, email, subject }: { leadText: string, email: string, subject: string }) => {

  const handleSendEmail = () => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        For <span style={{ fontWeight: 'bold' }}>{leadText}</span>, please email us at {' '}
        <span style={{ fontWeight: 'bold' }}>
          <a href={`mailto:${email}?subject=${subject}`} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {email}
          </a>
        </span>.
      </Typography>
      <Button variant="outlined" onClick={handleSendEmail}>
        {email} <EmailIcon sx={{
          ml: 1,
          fontSize: '1em',
          color: '#8060FE',
        }} />
      </Button>
    </Box>
  );
}

export default function Support() {
  return (
    <DashboardLayout isLoading={false}>
      <Box sx={{
        maxWidth: 730,
      }}>
        <Typography variant="h2" sx={{
          fontWeight: 'bold',
          fontSize: '32px',
          lineHeight: '150%',
          mb: 2,
        }}>
          Support
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You can email us anytime and we will get back to you as soon as possible. Please provide as much detail as possible about your issue or inquiry.
        </Typography>
      </Box>
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid #E5E5E5',
        padding: 4,
        maxWidth: 730,
      }}>
        <EmailBlock
          leadText="general questions"
          email="hello@interintellect.com"
          subject="Support [general]"
        />
        <EmailBlock
          leadText="urgent questions"
          email="support@interintellect.com"
          subject="Support [urgent]"
        />
        <EmailBlock
          leadText="questions about hosting"
          email="editorial@interintellect.com"
          subject="Support [hosting]"
        />
      </Box>
    </DashboardLayout>
  )
}