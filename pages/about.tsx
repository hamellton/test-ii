import Layout from "@components/Layout/Layout";
import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";

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
      <Box>
        <div style={{
          width: '80px', height: '102',
          position: 'absolute',
          top: '414px',
        }}>
          <Image
            src="/images/Man.svg"
            alt="About Hero"
            width={0}
            height={1}
            layout="responsive"
          />
        </div>
        <div style={{
          width: '80px', height: '102',
          position: 'absolute',
          top: '134px',
          left: '29px'
        }}>
          <Image
            src="/images/gurl_book.svg"
            alt="About Hero"
            width={0}
            height={1}
            layout="responsive"
          />
        </div>
      </Box>


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
          fontFamily: 'Post Grotesk',
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

      <Box>
        <div style={{
          width: '118px', height: '102',
          position: 'absolute',
          top: '134px',
          right: '29px',
        }}>
          <Image
            src="/images/lady.svg"
            alt="About Hero"
            width={0}
            height={1}
            layout="responsive"
          />
        </div>
        <div style={{
          width: '118px', height: '102',
          position: 'absolute',
          top: '433px',
          right: '0px',
        }}>
          <Image
            src="/images/Shape.svg"
            alt="About Hero"
            width={0}
            height={1}
            layout="responsive"
          />
        </div>
      </Box>
    </Box >
  )
}

const AboutHeroDesktop = () => {
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
        <div style={{ width: '134px', height: 'auto' }}>
          <Image src="/images/Man.svg" alt="About Hero" width={134} height={200} layout="responsive" />
        </div>
        <div style={{
          width: '143px', height: 'auto',
          position: 'absolute',
          top: '150px',
          left: '150px'
        }}>
          <Image src="/images/gurl_book.svg" alt="About Hero" width={143} height={200} layout="responsive" />
        </div>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '800px',
      }}>
        <Typography sx={{
          fontFamily: 'Post Grotesk',
          fontSize: '3em',
          fontWeight: 600,
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
      <Box sx={{
        minWidth: '10px',
        textAlign: 'right',
      }}>
        <div style={{
          width: '227px', height: 'auto',
          position: 'absolute',
          top: '100px',
          right: '200px'
        }}>
          <Image src="/images/lady.svg" alt="About Hero" width={227} height={300} layout="responsive" />
        </div>
        <div style={{
          width: '150px',
          height: 'auto',
          top: '200px',
          position: 'relative',
        }}>
          <Image src="/images/Shape.svg" alt="About Hero" width={150} height={200} layout="responsive" />
        </div>
      </Box>
    </Box>
  )
}

const FirstSection = () => {
  return (
    <Box>
      <Grid container spacing={2} sx={{
        mt: 12
      }}>
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{
            maxWidth: '600px',
          }}>
            <Typography sx={{
              fontFamily: 'Post Grotesk',
              fontSize: '2em',
              fontWeight: 600,
              textAlign: {
                xs: 'center',
                md: 'left'
              }
            }}>
              Our Story
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <Typography>
                It all started with an essay back in May of 2019: “We’re a Niche, We Just Didn’t Know”, written by Founder of Interintellect, Anna Gat.
              </Typography>

              <Typography>
                As part of a transitory generation who saw the internet reinvent libraries, and in search for identity and community, Anna realized that traditional labels for intellect now fell short. The landscape had shifted; intellectual activity now thrived online, transcending borders and embracing audiences as the true measure of impact.
              </Typography>
              <Typography>
                Interintellect emerged from a deep-seated desire to create a space where intellectual exploration transcends boundaries and empowers individuals to unlock their full potential. Our story is one of evolution, growth, and relentless pursuit for thoughtful connections.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Image
            src="/images/about1.png"
            alt="About Hero"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }} // optional
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
            <Typography sx={{
              fontFamily: 'Post Grotesk',
              fontSize: '2em',
              fontWeight: 600,
              textAlign: {
                xs: 'center',
                md: 'left'
              }
            }}>
              A New Community, a New Intellectual Practice
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <Typography>
                She didn’t have to look for long. On corners of the internet and in cities across the world, she found a generation’s “intellectual orphans” coming together and trusting each other with their ideas and ambitions. Soon Anna was forming a digital community that wasn’t bounded by geography, academic affiliation, or area of expertise.
              </Typography>
              <Typography>
                Interintellect is committed to open participation in intellectual discourse: rather than prioritzing titles and degrees, our community embraces anyone’s ability to think critically–or poetically!––and engage constructively with each other. Here, ideas stand on their own merit, and individuals engage as equals in their pursuit of knowledge.
              </Typography>
              <Typography>
                As the community brings together strangers from across the globe, its ethos of engagement centers on kindness, open mindedness, and patience. These guidelines create a space for both playful conversations and deeper debates, where diverse fields of study, from the humanities to the sciences to the arts, can come together.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}>
            <Typography sx={{
              fontSize: '40px',
              fontWeight: 200,
              padding: 8
            }}>
              “Everybody thinks their life is weird. Most of us are right.” - Anna Gát
            </Typography>
          </Box>
        </Grid>


        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{
            maxWidth: '600px',
          }}>
            <Typography sx={{
              fontFamily: 'Post Grotesk',
              fontSize: '2em',
              fontWeight: 600,
              textAlign: {
                xs: 'center',
                md: 'left'
              }
            }}>
              Our Why
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <Typography>
                Our purpose is to provide a dynamic platform where thinkers from all backgrounds can converge, collaborate, and transcend conventional boundaries. We believe that traditional academic and societal structures often hinder our ability to engage with each other, and we’re committed to bringing equality and open-mindedness to this space.
              </Typography>
              <Typography>
                Through our platform, we work to democratize intellectual discourse, creating a forum where every voice is heard and valued based on the merit of ideas, not credentials. At Interintellect, we do more than share ideas –– we’re building a network that encourages personal growth, mutual respect, and the pursuit of knowledge as a communal endeavor. You don’t have to think alone.
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Image
            src="/images/about2.png"
            alt="About Hero"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }} // optional
          />
        </Grid>

      </Grid>
    </Box >
  )
}

const SecondSection = () => {
  const profiles = [
    { src: '/images/anna-profile.png', alt: 'Profile 1', name: 'Anna Gát', title: 'Founder and CEO', quote: '"Being part of this community has not only expanded my horizons but also allowed me to build meaningful relationships with individuals who share my passion for learning and exploration."' }, // Replace with actual image paths and alt text
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center', // Add this line to center the content horizontally
      mt: 12
    }}>
      <Typography sx={{
        fontFamily: 'Post Grotesk',
        fontSize: '3em',
        fontWeight: 600,
        textAlign: 'center',
      }}>
        Our Founder
      </Typography>
      <Grid container
        maxWidth={{ xs: '100%', md: '80%' }} // Responsive max width for xs and md breakpoints
        gap={{ xs: 2, md: 12 }}
        sx={{
          marginTop: '2em',
          marginBottom: '6em',
          display: 'flex',
          justifyContent: 'center', // Center the grid horizontally
        }}
      >
        {
          profiles.map((profile, index) => (
            <Grid item key={index} sx={{
              maxWidth: '400px',
              textAlign: 'center',
            }}>
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginBottom={'1em'}>
                <Avatar key={index} src={profile.src} alt={profile.alt} sx={{ width: 250, height: 250 }}>
                  {profile.name}
                </Avatar>
              </Box>
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
    </Layout>
  )
}
