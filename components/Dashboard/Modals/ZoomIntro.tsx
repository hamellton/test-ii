import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { BasicModalProps } from '@utils/types'

export default function ZoomIntro({ close, nextClicked }: BasicModalProps) {
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
        Almost there!
      </Typography>
      <Typography sx={{
      }}>
        Register to manage your tickets, host salons and access our community.
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: '1em',
        justifyContent: 'flex-end',
        mt: '1em'
      }}>
        <Button onClick={close} variant="outlined">Maybe later</Button>
        <Button onClick={nextClicked} variant="contained">Let&apos;s do this</Button>
      </Box>
    </Box>
  )
}
