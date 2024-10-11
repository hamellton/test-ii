import { Box, Grid, Paper } from '@mui/material';
import React from 'react';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';

import { ReactNode } from 'react';

interface FullWidthGridProps {
  children: ReactNode;
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Your primary color
    },
    secondary: {
      main: '#19857b', // Your secondary color
    },
    // You can also customize error, warning, info, success, and other color aspects
  },
  // ...you can also customize other theme aspects like typography, breakpoints, etc.
});

const FullWidthGrid = ({ children }: FullWidthGridProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative', minHeight: '100vh' }}>
        {/* Background with full width */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            minHeight: '100vh',
            backgroundImage: 'url(/images/Gradient.svg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            zIndex: 1, // Ensure this is the lowest zIndex
          }}
        />


        {/* Grid container with sidebar and content */}
        <Grid container spacing={2} sx={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
          {/* Sidebar */}
          <Grid item xs={12} md={5} sx={{
            zIndex: 2,
            backgroundColor: 'white',
            minHeight: '100vh', // Ensure this Grid item takes the full viewport height
            boxSizing: 'border-box', // Include padding and borders in height calculation
          }}>
            <Box sx={{
              width: '100%',
              minHeight: '100vh',
              overflow: 'hidden',
              display: 'flex', // Enables flexbox
              flexDirection: 'column', // Stack children vertically
              justifyContent: 'center', // Center children vertically
              alignItems: 'center', // Center children horizontally (optional, depending on your layout)
            }}>
              {children}
            </Box>
          </Grid>

          <Grid item xs={12} md={7} sx={{
            backgroundImage: 'url(/images/Illustration.svg)',
            backgroundRepeat: 'no-repeat',
          }}>

          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default FullWidthGrid;