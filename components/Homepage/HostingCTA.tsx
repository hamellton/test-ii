import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from 'next/link';

export default function HostingCTA() {
  return (
    <Grid container sx={{
      maxWidth: '1300px',
      margin: 'auto',
      marginBottom: '4em',
    }}>

      {/* Desktop CTA */}
      <Grid item md={6} sx={{
        pr: 10,
        display: {
          xs: 'none',
          md: 'flex',
        },
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'column',
          }
        }}>
          <Typography sx={{
            fontWeight: 700,
            fontSize: 32,
          }} >
            The Art of Hosting
          </Typography>
          <Typography sx={{
            fontWeight: 400,
            fontSize: 18,
            marginBottom: '1em',
          }}>
            <p>
              Becoming an Interintellect host is about more than just sharing your ideas.
            </p>
            <p>
              It will deepen your intellectual journey, inspire new ideas, and support your career as you bring your insights to online and offline events.
            </p>
            <p>
              Immerse yourself in our vibrant community, expand your friendship and audience reach, receive salon hosting training from experts, and even get paid to pursue your passion!
            </p>
          </Typography>
          <Box>
            <Link href="/dashboard/salon">
              <Button variant="contained" sx={{ marginRight: '2em' }}>Host a salon</Button>
            </Link>
            <Link href="/hosting">
              <Button variant="outlined">Learn more</Button>
            </Link>
          </Box>
        </Box>
      </Grid>



      <Grid item xs={12} md={6}>
        <Box sx={{
          padding: 2
        }}>
          <Image src="/images/index/index-hosting.png" alt="" layout='responsive' height={400} width={608} />
        </Box>
      </Grid>


      {/* Mobile CTA */}
      <Box sx={{
        p: 2,
        display: {
          xs: 'flex',
          md: 'none',
        },
        flexDirection: 'column',
      }}>
        <Typography sx={{
          fontWeight: 700,
          fontSize: 32,
          marginBottom: '1em',
        }} >
          The Art of Hosting
        </Typography>
        <Typography sx={{
          fontWeight: 400,
          fontSize: 18,
          marginBottom: '1em',

        }}>
          <p>
            Becoming an Interintellect host is about more than just sharing your ideas.
          </p>
          <p>
            It will deepen your intellectual journey, inspire new ideas, and support your career as you bring your insights to online and offline events.
          </p>
          <p>
            Immerse yourself in our vibrant community, expand your friendship and audience reach, receive salon hosting training from experts, and even get paid to pursue your passion!
          </p>
        </Typography>
      </Box>
    </Grid >
  )
}