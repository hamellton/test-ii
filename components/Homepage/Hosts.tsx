import { Avatar, Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";


export default function Hosts() {

  const profiles = [
    {
      src: '/images/index/alaka.png',
      alt: 'Profile 1',
      name: 'Alaka Halder',
      title: 'Healthcare research engineer',
      quote: 'I studied economics at Princeton, focusing on health and labor outcomes, and remain fond of “the dismal science.”',
      link: 'reason-to-be-happy-why-logical-thinking-is-the-key-to-a-better-life-supersalon-with-professor-kaushik-basu'
    },
    {
      src: '/images/index/bronwyn.png',
      alt: 'Profile 1',
      name: 'Bronwyn Williams',
      title: 'Futurist, economist, and business trend analyst',
      quote: 'I host salons mainly on the intersection between economic and social philosophy and the fine lines between positive and normative ideas about the future.',
      link: 'the-philosophy-of-political-beliefs-with-oliver-traldi'
    },
    {
      src: '/images/index/grace.png',
      alt: 'Profile 2',
      name: 'Grace Bialecki',
      title: 'Writer, workshop facilitator, and book coach',
      quote: 'I’m a writer, performance poet, and meditation teacher who facilitates workshops on writing and creativity.',
      link: 'new-york-irl-expansive-conversations-everyday-delight'
    },
    {
      src: '/images/index/henry.png',
      alt: 'Profile 2',
      name: 'Henry Oliver',
      title: 'Writer, speaker, and brand consultant',
      quote: 'I am writer, interested in late bloomers, failures, Samuel Johnson, literature, economics, architecture, London, politics, history.',
      link: 'western-canon-book-club-shakespeareand8217s-inadequate-kings-prospero-hamlet-richard-iii'
    },
  ];
  return (
    <>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: '32px',
          fontWeight: 700,
          marginTop: '2em',
          marginBottom: '0',
          lineHeight: '1em',
          textAlign: 'center', // Align text center here
          width: '100%', // Ensure the Typography component takes full width
        }}
      >
        Our Hosts
      </Typography>

      {/* <Link href="/hosts">
        <Typography sx={{
          marginTop: '1em',
          display: 'flex',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '16px',
        }}>
          Show all
          <Image src="/icons/chevron-right-double.svg" alt="" width={2} height={1} style={{ marginLeft: '0.2em' }} />
        </Typography>
      </Link> */}

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
              <Link
                href={`/salons/${profile.link}`}
                passHref
              >

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginBottom={'1em'}>
                  <Image
                    src={`${profile.src}`}
                    alt="About Hero"
                    width={200}
                    height={300}
                    sizes="100vw"
                    style={{ width: '80%', height: 'auto' }}
                  />
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
                <Typography sx={{
                  marginBottom: '2em',
                  color: '#605054',
                  fontSize: '16px',
                }}
                >
                  {profile.quote}
                </Typography>
              </Link>
            </Grid>
          ))
        }
      </Grid >
    </>
  )
}