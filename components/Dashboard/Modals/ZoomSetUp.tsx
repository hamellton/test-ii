import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, Button, LinearProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BasicModalProps } from '@utils/types';

export default function SetUpZoom({ close }: BasicModalProps) {
  const [isError, setIsError] = useState(false); // State to manage error
  const [errorMessage, setErrorMessage] = useState(''); // State to manage error
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true); // Start sending
    try {
      const response = await fetch('/api/zoom/user/new', {
        method: 'POST'
      });
      const data = await response.json(); // Attempt to read the body as JSON

      if (!response.ok) {
        setIsError(true)
        setErrorMessage(JSON.parse(data.error).message);
      }
    } catch (error) {
      console.log('Host profile upload error', error)
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1em',
    }}>
      <Box sx={{ width: '100%', color: '#8060FE' }}>
        <LinearProgress variant="determinate" color="inherit" value={30} />
      </Box>
      <Typography sx={{
        fontWeight: 'bold',
        fontSize: '28px'
      }}>
        Set up your Zoom account
      </Typography>
      <Typography>
        To host a salon, you need an Interintellect Zoom account.
      </Typography>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <RefreshIcon sx={{
          marginRight: '0.2em',
          fontSize: '1em',
          color: '#8060FE',
        }} />
        <Typography sx={{
          justifySelf: 'flex-start',
        }}>
          <span style={{ fontWeight: 'bold' }}>Refresh this page</span>  after activating your account via email
        </Typography>
      </Box>

      <Box sx={{
        mt: '1em'
      }}>
        {isError &&
          <Alert severity="error" sx={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <Typography sx={{ fontWeight: 'bold' }}>Error:</Typography>
            <Typography>
              {errorMessage}
            </Typography>
          </Alert>
        }
      </Box>

      <Box sx={{
        display: 'flex',
        gap: '1em',
        justifyContent: 'flex-end',
        mt: '1em'
      }}>
        <Button onClick={close} variant="outlined" sx={{ minWidth: '100px' }}>Cancel</Button>
        <Button onClick={handleSend} disabled={isSending} variant="contained" sx={{ minWidth: '100px' }}>
          {isSending ? 'Activating...' : 'Activate via email'}
        </Button>
      </Box>
    </Box>
  )
}