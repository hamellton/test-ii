import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from 'next/router';

export default function CTACommunity() {
  const router = useRouter();

  return (
    <>

      {/* Mobile CTA */}
      <Box sx={{
        display: {
          xs: 'flex',
          md: 'none',
        },
        flexDirection: 'column',
        mt: 1,
        padding: 6,
        textAlign: 'center'
      }}
      >
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
          A Global Community of Thought
        </Typography>
        <p>
          Join the Interintellect community!
        </p>
        <p>
          Our memberships provide free access to events, exclusive in-person gatherings, and a global chat forum.
        </p>
        <p>
          Be part of the discourse that’s expanding our minds.
        </p>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          <Button variant='contained' onClick={() => router.push('/membership')}>Join the community</Button>
          <Button variant='outlined' onClick={() => router.push('/hosting')}>Learn more</Button>
        </Box>
      </Box>

      {/* Desktop CTA */}
      <Box sx={{
        display: {
          xs: 'none',
          md: 'flex',
        },
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: '1em',
      }}>
        <Image src="/images/hand.svg" alt="hero" width={170} height={215} />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%',
          maxWidth: '922px',
          marginRight: '3em',
          textAlign: 'center',
          border: '1px solid #C4C4C4',
          borderRadius: '12px',
          padding: '40px',
          paddingLeft: '64px',
          paddingRight: '64px',
        }}>
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
            A Global Community of Thought
          </Typography>
          <p>
            Join the Interintellect community!
          </p>
          <p>
            Our memberships provide free access to events, exclusive in-person gatherings, and a global chat forum.
          </p>
          <p>
            Be part of the discourse that’s expanding our minds.
          </p>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1em',
            width: '100%',
            marginTop: '1em',
          }}>
            <Button variant='contained' onClick={() => router.push('/membership')}>Join the community</Button>
          </Box>
        </Box>
        <Image src="/images/tree.svg" alt="hero" width={77} height={390} style={{ marginRight: '2em' }} />
      </Box>
    </>
  )
}