import React from 'react';
import { Typography, Grid, Box, Paper, Link, Container } from '@mui/material';
import Image from 'next/image';

const logos = [
  { src: '/images/logos/penguin.svg', alt: 'penguin', width: 144, height: 73 },
  { src: '/images/logos/tony_blair.svg', alt: 'tony_blair', width: 159, height: 66 },
  { src: '/images/logos/a16z.svg', alt: 'a16z', width: 120, height: 68 },
  { src: '/images/logos/bloomberg.svg', alt: 'bloomberg', width: 126, height: 43 },
  { src: '/images/logos/mercatus.svg', alt: 'mercatus', width: 169, height: 31 },
  { src: '/images/logos/stripe.svg', alt: 'stripe', width: 38, height: 92 },
  { src: '/images/logos/higher_ground.svg', alt: 'higher_ground', width: 144, height: 42 },
  { src: '/images/logos/e.png', alt: 'e', width: 88, height: 85 },
  { src: '/images/logos/oshaughnessy.svg', alt: 'oshaughnessy', width: 155, height: 49 },
  { src: '/images/logos/liberties.svg', alt: 'liberties', width: 147, height: 32 },
]

const pressLogos = [
  { src: '/images/logos/vox.svg', alt: 'vox', width: 81, height: 40 },
  { src: '/images/logos/ny.png', alt: 'ny', width: 173, height: 46 },
  { src: '/images/logos/tablet.svg', alt: 'tablet', width: 142, height: 23 },
]

const PartnerSection = () => {
  return (
    <Box sx={{
      backgroundColor: '#E3EBAC',
      padding: 4,
      textAlign: 'center',
      paddingTop: '4em',
      paddingBottom: '4em',
    }}>
      <Container>
        <Typography variant="h4" fontWeight={700} fontSize={32} gutterBottom>
          Meet our Partners
        </Typography>
        <Typography variant="body2" color={'#605054'} gutterBottom>
          Get to know the incredible collaborators behind Interintellect&lsquo;s success. <br></br>
          Meet our partners and discover the power of collaboration
        </Typography>
        <Container maxWidth={'lg'}>
          <Grid container spacing={2} justifyContent="center" alignItems="center" maxWidth={'1100px'}>
            {logos.map((logo, index) => (
              <Grid item xs={6} sm={6} md={2.4} key={index} sx={{ flexGrow: 1 }}>
                <Paper
                  component={Link}
                  href="#"
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, backgroundColor: 'transparent', boxShadow: 'none' }}
                  elevation={4}
                >
                  <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>

      <Container sx={{ marginTop: '4em' }}>
        <Typography variant="h4" fontWeight={700} fontSize={32} gutterBottom>
          Explore the latest stories about Interintellect
        </Typography>
        <Typography variant="body2" color={'#605054'} gutterBottom>
          See what the press is saying and get an inside look at our world. <br></br>
          Read our press coverage now and stay informed!
        </Typography>
        <Container maxWidth={'lg'} sx={{ display: 'flex', justifyContent: 'center' }} >
          <Grid container spacing={2} justifyContent="center" alignItems="center" maxWidth={'600px'}>
            {pressLogos.map((logo, index) => (
              <Grid item xs={6} sm={6} md={4} key={index} sx={{ flexGrow: 1 }}>
                <Paper
                  component={Link}
                  href="#"
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, backgroundColor: 'transparent', boxShadow: 'none' }}
                  elevation={4}
                >
                  <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </Box>
  );
};

export default PartnerSection;
