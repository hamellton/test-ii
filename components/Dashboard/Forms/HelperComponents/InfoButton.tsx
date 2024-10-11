import React from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'; // Import useRouter from next/router

export default function InfoButton({ buttonText, startIcon, link }: { buttonText: string; startIcon: JSX.Element, link: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(link); // Navigate to the provided link
  };

  return (
    <Button
      variant="outlined"
      startIcon={startIcon}
      fullWidth
      onClick={handleClick} // Added onClick handler
      sx={{
        height: '48px',
        borderWidth: '1px',
        borderRadius: '8px',
        padding: '12px 16px',
        justifyContent: 'flex-start', // Align the text to the left
        fontSize: '16px',
        fontWeight: '600', // Corrected from '600px' to '600'
        lineHeight: '24px'
      }}
    >
      {buttonText}
    </Button>
  );
}