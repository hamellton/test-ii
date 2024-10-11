import React from 'react';
import { Backdrop, CircularProgress, Modal, Box } from '@mui/material';

function LoadingModal({ isLoading }: { isLoading: boolean }) {
  return (
    <Modal
      open={isLoading}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    </Modal>
  );
}

export default LoadingModal;