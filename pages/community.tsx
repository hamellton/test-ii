import Layout from "@components/Layout/Layout";
import { Avatar, Box, Button, Chip, Container, Divider, Grid, List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import LanguageIcon from '@mui/icons-material/Language';
import { logJoinNowClick } from "@utils/analytics-helpers";

const LocationChip = ({ name }: { name: string }) => {
  return (
    <Chip
      icon={<LanguageIcon />}
      label={name}
      variant="outlined"
      sx={{ position: 'absolute', mr: 2, bottom: '20px', right: '0', backgroundColor: 'white' }}
    />
  );
};
const AboutHeroMobile = () => {
  return (
    <Box sx={{
      display: {
        xs: 'flex',
        md: 'none',
      },
      justifyContent: 'space-between',
      mt: 8
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '800px',
        paddingLeft: 4,
        paddingRight: 4
      }}>
        <Typography sx={{
          fontSize: '3em',
          fontWeight: 600,
          mb: 4
        }}>
          What is Interintellect?
        </Typography>
        <Typography sx={{
          fontFamily: 'Post Grotesk',
          fontSize: '1.5em',
          fontWeight: 400,
        }}>
          Meaningful conversations should spark curiosity, foster connections, and drive positive change in the world. Our journey began with a simple yet profound realization: that in an increasingly interconnected world, genuine human connection is more valuable than ever.
        </Typography>
      </Box>
    </Box >
  )
}

const AboutHeroDesktop = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{
      display: {
        xs: 'none',
        md: 'flex',
      },
      justifyContent: 'space-between',
      mt: 8
    }}>
      <Box>
        <div style={{ width: '250px', height: 'auto' }}>
          <Image src="/images/life-in-1.png" alt="About Hero" width={400} height={400} layout="responsive" />
        </div>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '800px',
        ml: 6,
      }}>
        <Typography sx={{
          fontFamily: 'Post Grotesk',
          fontSize: '3em',
          fontWeight: 600,
        }}>
          Life in the community
        </Typography>
        <Typography sx={{
          fontFamily: 'Post Grotesk',
          fontSize: '1.5em',
          fontWeight: 400,
        }}>
          Our community learns together, laughs together, and creates together.
          Join us in having the best conversations on the internet.
        </Typography>
      </Box>
      <Box sx={{
        minWidth: '10px',
        textAlign: 'right',
      }}>
        <div style={{
          width: '440px',
          height: 'auto',
          top: '40px',
          position: 'relative',
        }}>
          <Image src="/images/life-in-2.png" alt="About Hero" width={150} height={200} layout="responsive" />
        </div>
      </Box>
    </Box>
  )
}

const FirstSection = () => {
  return (
    <Box sx={{ mt: 5 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/images/community/hosts-1.png" alt="Image 1" width="100%" />
            <LocationChip name="New York" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/images/community/hosts-2.png" alt="Image 2" width="100%" />
            <LocationChip name="Austin" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/images/community/hosts-3.png" alt="Image 2" width="100%" />
            <LocationChip name="London" />
          </Box>
        </Grid>
      </Grid>
    </Box >
  )
}

const SecondSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Box sx={{
        flexDirection: isMobile ? 'column' : 'row',
        display: 'flex',
        gap: 10,
        mb: 16,
      }}>
        <Box sx={{
          flex: 1,
          minWidth: '457px',
          minHeight: '451px',
          maxWidth: '457px',
          maxHeight: '451px',
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          bottom: {
            md: '-279px',
            xs: '-160px',
          },
          ml: 4,
        }}>
          <Image
            src={'/images/community/isabela.png'}
            alt={'isabela'}
            width={511}
            height={420}
            priority
            style={{
              position: 'absolute',
              bottom: '40px',
            }}
          />
        </Box>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10,
        }}>
          <Typography sx={{
            fontSize: '40px',
            fontWeight: 'bold',
            mt: '2rem',
          }}>
            “For me, the ii represents a collective consciousness that fuses some of the brightest, most inspiring, and curious minds in an emergent mash up of wisdom and fun.”
          </Typography>
          <Typography sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}>
            Isabela Granic
          </Typography>
          <Typography sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#460B24',
          }}>
            Developmental psychologist
          </Typography>
        </Box>
      </Box>
      {/* <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} /> */}
    </>
  );
}

const ThirdSection = () => {
  return (
    <Box sx={{
      mt: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <Typography sx={{
        fontFamily: 'Post Grotesk',
        fontSize: '2em',
        fontWeight: 600,
        textAlign: {
          xs: 'center',
        }
      }}>
        Perks of being a member
      </Typography>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={4} sx={{ padding: 10 }}>
          <Typography sx={{ fontSize: '30px' }}>
            Events
          </Typography>
          <ul style={{ marginLeft: '-2em' }}>
            <li>Access to online from hosts across the globe</li>
            <li>Access to offline events and members meet-ups</li>
            <li>Special discount to Interintellect conferences</li>
            <li>Premium videos of celebrity salons and panels</li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ padding: 10 }}>
          <Typography sx={{ fontSize: '30px' }}>
            Forum
          </Typography>
          <ul style={{ marginLeft: '-2em' }}>
            <li>Access to the online forum</li>
            <li>Channels include: Jobs Board, Writing Lab, and city specific groups</li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ padding: 10 }}>
          <Typography sx={{ fontSize: '30px' }}>
            Perks
          </Typography>
          <ul style={{ marginLeft: '-2em' }}>
            <li>Receive discounts to renowned magazines </li>
            <li>Receive discounts on our hosts’ Substacks</li>
            <li>Access to exclusive software, from builders in our community</li>
          </ul>
        </Grid>
      </Grid>
    </Box>
  )
}

const FourthSection = () => {
  return (
    <Box sx={{ mt: 5 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/images/community/hosts-1.png" alt="Image 1" width="100%" />
            <LocationChip name="New York" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/images/community/hosts-2.png" alt="Image 2" width="100%" />
            <LocationChip name="Austin" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/images/community/hosts-3.png" alt="Image 2" width="100%" />
            <LocationChip name="London" />
          </Box>
        </Grid>
      </Grid>
    </Box >
  )
}

const FifthSection = () => {
  return (
    <Box sx={{
      mt: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <Typography sx={{
        fontFamily: 'Post Grotesk',
        fontSize: '2em',
        fontWeight: 600,
        textAlign: {
          xs: 'center',
        }
      }}>
        What else to expect
      </Typography>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={4} sx={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '30px' }}>
            Hosting Resources
          </Typography>
          <Typography>
            Master the art of hosting with our extensive resources tailored to empower you in organizing, promoting, and maximizing the impact of your salons on our platform.
          </Typography>
          <Typography>
            From event logistics to effective promotional strategies, we provide you with the tools for success.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '30px' }}>
            Community Growth
          </Typography>
          <Typography>
            Join our expansive platform of salons to connect with a diverse and engaged audience you might not reach elsewhere.
          </Typography>
          <Typography>
            We believe that the more engaged a host is, the greater the rewards!
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '30px' }}>
            Discord Forum
          </Typography>
          <Typography>
            Engage in exclusive events within our Discord forum, where burgeoning talents can showcase their expertise to a receptive audience.
          </Typography>
          <Typography>
            Collaborate on projects, delve into diverse discussions, and forge meaningful connections with like-minded individuals worldwide.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

const SixthSection = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: {
        xs: 'column',
        md: 'row',
      }
    }}>
      <Box component="img" src="/images/community/zoom.png" alt="Image 2" sx={{ flex: 1, width: '100%', padding: 5 }} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 5 }}>
        <Typography sx={{ fontSize: '30px' }}>
          Join us
        </Typography>
        <Typography>
          Your weekly dose of hosting wisdom,
          early bird discounts and offers, host highlights, new listings,
          and celebrity appearances.
        </Typography>
        <Button variant="contained" sx={{ maxWidth: '200px' }} onClick={logJoinNowClick}>Join now</Button>
      </Box>
    </Box >
  )
}



export default function About() {
  return (
    <Layout>
      <AboutHeroMobile />
      <AboutHeroDesktop />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <FifthSection />
      <SixthSection />
    </Layout>
  )
}
