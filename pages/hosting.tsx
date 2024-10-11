import Layout from "@components/Layout/Layout";
import { Avatar, Box, Button, Chip, Container, Divider, Grid, Link, List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import LanguageIcon from '@mui/icons-material/Language';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { actionEvent, logCodeOfConductClick, logCommunityForumGuideClick, logCreateHostAccountClick, logHostAgreementClick, logHostingFAQClick, logReadHostingFAQClick } from "@utils/analytics-helpers";
import { EventNames } from "@config";


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


const AboutHeroDesktop = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{
      display: {
        xs: 'none',
        md: 'flex',
      },
      mt: 8,
      mb: 5,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Image src="/images/hosting/hosts-group.png" alt="About Hero" width={400} height={400} layout="responsive" />
    </Box>
  )
}

const FirstSection = () => {
  return (
    <Box sx={{
      mt: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 4,
      textAlign: 'center',
      maxWidth: '800px',
      width: '100%',
      margin: '0 auto', // Center the Box horizontally
    }}>
      <Typography sx={{
        fontSize: '3em',
      }}>
        Become an Interintellect Host
      </Typography>
      <Typography>
        Join online and offline Interintellect hosts from around the world at the start of their journeys or at the height of their careers. Earn an income doing what you love!
      </Typography>
      <Typography>
        Lead friendly conversations that transcend boundaries and inspire new ideas. Our platform provides training by experts and a supportive community allowing you to grow your audience in a faster and kinder way, and to monetize your work from Day 1.
      </Typography>
      <Typography>
        Embark on your intellectual adventure in the company of new friends and fellow seekers!
      </Typography>
    </Box>
  )
}

const SecondSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Grid container spacing={4} sx={{
        mt: 10,
      }}>

        <Grid item xs={12} md={6}>
          <Image
            src="/images/hosting/hosting-1.png"
            alt="About Hero"
            width={600}
            height={600}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{
            maxWidth: '600px',
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: 5,
            }}>
              <Typography>
                Turn Your Passions Into Profits
              </Typography>
              <Typography>
                Our hosts develop events based on topics close to their hearts, and share them with our public audience and close-knit community.
              </Typography>
              <ul style={{ marginLeft: '-2em' }}>
                <li>Cultivate Your Audience: Amplify your ideas through newsletters, podcasts, or video channels.</li>
                <li>Earn While You Engage: Monetize by hosting discussions and forging meaningful connections with like-minded individuals.</li>
                <li>Hone Your Skills: Develop communication prowess alongside a diverse global community.</li>
              </ul>
            </Box>
          </Box>
        </Grid>
      </Grid >
    </>
  );
}

const ThirdSection = () => {
  return (
    <>
      <Grid container spacing={4} sx={{
        mt: 10,
      }}>


        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 10,
          }}>
            <Typography sx={{
              fontSize: '25px',
              fontWeight: 'bold',
              mt: '2rem',
            }}>
              &quot;My hosting experience has been a source of intellectual and emotional nourishment. But that&apos;s table stakes. The bigger joy, particularly in co-hosting, has been making incomparable friendships of depth, curiosity, and generosity within the community.&quot;
            </Typography>
            <Typography sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}>
              Amir H. Hajizamani
            </Typography>
            <Typography sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#460B24',
            }}>
              Product Manager and Coach
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            <Image
              src="/images/hosting/hosting-2.png"
              alt="About Hero"
              width={300}
              height={300}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
        </Grid>
      </Grid >
    </>
  )
}

const FourthSection = () => {
  const resources = [
    { title: 'Hosting FAQ', link: '/faq', icon: <MenuBookIcon sx={{ color: 'black' }} />, onClick: logHostingFAQClick },
    { title: 'Code of conduct', link: '/code-of-conduct', icon: <MenuBookIcon sx={{ color: 'black' }} />, onClick: logCodeOfConductClick },
    { title: 'Host agreement', link: '/host-agreement', icon: <MenuBookIcon sx={{ color: 'black' }} />, onClick: logHostAgreementClick },
    { title: 'Community forum guide', link: '/community', icon: <MenuBookIcon sx={{ color: 'black' }} />, onClick: logCommunityForumGuideClick },
  ];

  return (
    <>
      <Grid container spacing={4} sx={{
        mt: 10,
      }}>
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 10,
          }}>
            <Typography sx={{
              fontSize: {
                xs: '1.5rem',
                md: '2rem',
              },
              mt: '2rem',
              textAlign: 'center',
            }}>
              Where can I learn even more?
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Grid container spacing={4}>
            {resources.map((resource, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Link href={resource.link} underline="none" onClick={resource.onClick}>
                  <Box display="flex" alignItems="center" flexDirection="column">
                    {resource.icon}
                    <Typography variant="subtitle1" align="center" sx={{ color: 'black' }}>
                      {resource.title}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid >
    </>
  )
}

const FifthSection = () => {
  return (
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      <Box component="img" src="/images/hosting/hosting-wide.png" alt="Image 1" width="100%" />
    </Box >
  )
}

const SixthSection = () => {
  return (
    <Box sx={{
      display: 'flex',
      textAlign: 'center',
      gap: 4,
      mt: 10,
      flexDirection: {
        xs: 'column',
        md: 'column',
      }
    }}>
      <Typography sx={{
        fontSize: '3em',
      }}>
        Create your own events
      </Typography>
      <Typography sx={{
        fontSize: '1.5em',
      }}>
        Host an online or offline event on Interintellect, and bring individuals together in conversation.
      </Typography>
    </Box >
  )
}

const SeventhSection = () => {

  const testimonials = [
    {
      text: 'Hosting Interintellect salons completely changed my life for the better. I followed my many curiosities and embarked on hour-long conversations with incredible people, many of them I can now call friends.',
      name: 'Patricia Hurducas',
      title: 'Writer, researcher | The Flâneurs Project',
    },
    {
      text: 'I love the Interintellect community. There are always people discussing or sharing interesting topics, and the quality of the discourse is unmatched. The Discord community in particular has a welcoming vibe that I find fulfilling to be a part of.',
      name: 'Christopher Valore',
      title: 'Writer',
    },
    {
      text: 'For me, the ii represents a collective consciousness that fuses some of the brightest, most inspiring, and curious minds in an emergent mash up of wisdom and fun.',
      name: 'Isabela Granic',
      title: 'Developmental psychologist',
    },
  ];
  return (
    <Container sx={{
      mt: 14
    }}>
      <Typography variant="h4" align="center" gutterBottom>
        What our community and hosts have to say...
      </Typography>
      <Grid container spacing={4} sx={{
        mt: 4,
      }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Typography variant="body1" gutterBottom>
                {testimonial.text}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {testimonial.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {testimonial.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{
        display: 'flex',
        textAlign: 'center',
        gap: 4,
        mt: 10,
        flexDirection: {
          xs: 'column',
          md: 'column',
        },
      }}>
        <Typography sx={{
          fontSize: '2.5em',
        }}>
          What&apos;s your big idea?
        </Typography>
        <Typography sx={{
          fontSize: '1.2em',
        }}>
          Host an online or offline event on Interintellect, and bring thought leaders together in conversation.
        </Typography>
        <Box sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          mt: 4,
          mb: 10,
        }}>
          <Button variant="contained" onClick={logCreateHostAccountClick}>Create your host account</Button>
          <Button variant="outlined" onClick={logReadHostingFAQClick}>Read our hosting FAQ</Button>
        </Box>
      </Box>
    </Container>
  );
}




export default function About() {
  return (
    <Layout>
      <AboutHeroDesktop />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <FifthSection />
      <SixthSection />
      <SeventhSection />
    </Layout>
  )
}
