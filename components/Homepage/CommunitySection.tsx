import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from 'next/link';

export default function CommunitySection() {
  return (
    <Container sx={{
      backgroundColor: '#173A40',
      marginRight: '0 !important',
      marginLeft: '0 !important',
      maxWidth: '100% !important',
      paddingTop: '4em',
      paddingBottom: '4em',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Grid container maxWidth={'1400px'} sx={{
        justifyContent: 'center',
      }}>
        <Grid item md={6}>
          <Image src="/images/community_1.png" alt="" layout='responsive' height={400} width={608} />
        </Grid>

        <Grid item md={6} sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1em',

        }}>
          <Box maxWidth={490}>
            <Typography sx={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: '48px',
              textAlign: 'left',
              color: '#E3EBAC',
            }}>
              Connect with curious minds from around the world
            </Typography>
            <Typography sx={{
              marginTop: '1em',
              marginBottom: '1em',
              color: '#F1EFE2',
              fontSize: 18,
            }}>
              Get free access to the most fascinating and engaging conversations, meet like-minded people, attend amazing salons and events, be part of a friendly and helpful Discord group, and enjoy exclusive content and perks.
            </Typography>
            <Box>
              <Link href="/membership">
                <Button variant="contained" sx={{ marginRight: '2em' }}>Join the community</Button>
              </Link>
              <Link href="/community">
                <Button variant="outlined" sx={{
                  color: '#F1EFE2',
                  borderColor: '#F1EFE2',
                  ":hover": {
                    color: '#F1EFE2',
                    borderColor: '#F1EFE2',
                  }
                }}>
                  Learn more
                </Button>
              </Link>

            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container >
  )
}