import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { BasicModalProps } from '@utils/types'

export default function ZoomSent({ close }: BasicModalProps) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8em',
    }}>
      <Typography sx={{
        fontWeight: 'bold',
        fontSize: '28px'
      }}>
        Zoom Email Sent!
      </Typography>
      <Typography sx={{
      }}>
        Please check your email for a Zoom Confirmation. Please refresh this page if you&apos;ve already confirmed.
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: '1em',
        justifyContent: 'flex-end',
        mt: '1em'
      }}>
        <Button onClick={close} variant="outlined">Cancel</Button>
      </Box>
    </Box>
  )
}
