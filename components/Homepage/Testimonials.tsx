import { Avatar, Box, Grid, Typography } from "@mui/material";

export default function Testimonials() {

  const profiles = [
    { src: '/images/avatar.png', alt: 'Profile 1', name: 'Patricia Hurducas', title: 'Writer, researcher | The Flâneurs Project', quote: '"Hosting Interintellect salons completely changed my life for the better. I followed my many curiosities and embarked on hour-long conversations with incredible people, many of them I can now call friends."' }, // Replace with actual image paths and alt text
    {
      src: '/images/avatar.png', alt: 'Profile 2', name: 'Christopher Valore', title: 'Writer', quote: '"I love the Interintellect community. There are always people discussing or sharing interesting topics, and the quality of the discourse is unmatched. The Discord community in particular has a welcoming vibe that I find fulfilling to be a part of."'
    },
    { src: '/images/avatar.png', alt: 'Profile 2', name: 'Isabela Granic', title: 'Developmental psychologist', quote: '"For me, the ii represents a collective consciousness that fuses some of the brightest, most inspiring, and curious minds in an emergent mash up of wisdom and fun."' },
    // ...more profiles
  ];

  return (
    <>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '0',
          lineHeight: '1em',
          textAlign: 'center', // Align text center here
          width: '100%', // Ensure the Typography component takes full width
        }}
      >
        Our community and hosts said about us...
      </Typography>

      <Grid container alignItems="flex-start" justifyContent="center" spacing={2} sx={{
        marginTop: '2em',
        marginBottom: '6em',
      }}>
        {
          profiles.map((profile, index) => (
            <Grid item key={index} sx={{
              maxWidth: '333px',
              textAlign: 'center',
            }}>
              <Typography sx={{
                marginBottom: '2em',
                color: '#605054',
                fontSize: '16px',
              }}
              >
                {profile.quote}
              </Typography>
              {/* <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginBottom={'1em'}>
                <Avatar key={index} src={profile.src} alt={profile.alt} sx={{ width: 56, height: 56 }}>
                  {profile.name}
                </Avatar>
              </Box> */}
              <Typography sx={{
                fontWeight: 700,
                fontSize: '20px',
                marginBottom: '0.5em',
              }}>
                {profile.name}
              </Typography>
              <Typography sx={{
                fontWeight: 700,
                fontSize: '15px',
                marginBottom: '1em',
                color: '#827A7A'
              }}>
                {profile.title}
              </Typography>
            </Grid>
          ))
        }
      </Grid >
    </>
  )
}