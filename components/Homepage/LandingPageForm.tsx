import { useState } from 'react';
import { Box, Button, Container, FormControl, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import router from "next/router";

export default function LandingPageForm() {
  const theme = useTheme();
  // Using the theme's breakpoints to determine if the device is mobile (small screen)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // State to hold form data
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  // Handle input changes
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event: any) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Build query string and navigate
    const query = new URLSearchParams(formData).toString();
    router.push(`/dashboard/salon?${query}`);
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Images remain unchanged */}

      <Box sx={{
        display: {
          xs: 'none',
          md: 'block'
        }
      }}>
        <Image src="/images/statue_man.svg" alt="hourglass"
          style={{
            position: 'absolute',
            top: '-97px',
            left: '34px',
          }}
          width={156}
          height={209}
        />
        <Image src="/images/chair.png" alt="book"
          style={{
            position: 'absolute',
            bottom: '-131px',
            right: '19px',
          }}
          width={192}
          height={382}
          z-index='-1'
        />
      </Box>
      {/* Form component */}
      <Box sx={{
        maxWidth: '900px',
        border: {
          xs: 'none',
          md: 'solid 1px #C4C4C4'
        },
        padding: 2,
        pl: 8,
        pr: 8,
        margin: 'auto',
        borderRadius: '12px',
      }}>
        <form onSubmit={handleSubmit}>
          <Typography sx={{ fontSize: '32px', fontWeight: 'bold', mt: 2, mb: 2 }}>
            List a salon
          </Typography>
          <TextField
            fullWidth
            id="title"
            label="Title"
            type="text"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            name="title"
            onChange={handleChange}
            value={formData.title}
          />
          {/* Additional fields for date and time */}
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mt: 2, mb: 2 }}>
            Select a date and time
          </Typography>
          <Grid container spacing={2}>
            {/* Date input */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                id="date"
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
                name="date"
                onChange={handleChange}
                value={formData.date}
              />
            </Grid>
            {/* Start time input */}
            <Grid item xs={3.5}>
              <TextField
                fullWidth
                id="start-time"
                label="Start time"
                type="time"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
                name="startTime"
                onChange={handleChange}
                value={formData.startTime}
              />
            </Grid>
            {/* End time input */}
            <Grid item xs={3.5}>
              <TextField
                fullWidth
                id="end-time"
                label="End time"
                type="time"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                margin="normal"
                name="endTime"
                onChange={handleChange}
                value={formData.endTime}
              />
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
              <Button type="submit" variant="contained" fullWidth={isMobile}>
                Continue
                <Image src="/icons/chevron-right-double.svg" alt="" width={30} height={20} style={{ marginLeft: '0.2em', color: 'black' }} />
              </Button>
            </Box>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
