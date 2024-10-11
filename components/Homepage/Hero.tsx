import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* Mobile Hero */}
      <Box sx={{
        display: {
          xs: "flex",
          md: "none",
        },
        p: 4
      }}>
        <Typography variant="h3">
          Top Picks
        </Typography>
      </Box >

      {/* Desktop Hero */}
      < Box sx={{
        display: {
          xs: "none",
          md: "flex",
        },
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: "1em",
      }
      }>
        <Image src="/images/left-hero.svg" alt="hero" width={357} height={511} />
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          maxWidth: "680px",
          marginLeft: "3em",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: 48,
            marginBottom: "0",
            lineHeight: "1em",
          }}>
            {/* Where minds meet */}
          </h1 >
          <h1>You don&apos;t have to think alone.<br></br> Step into a world of conversation online and offline, awaken your mind, and meet other intellectual explorers!</h1>
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "1em",
            width: "100%",
            marginTop: "1em",
          }}>
            <Link href="/salons">
              <Button variant="contained">Explore Salons</Button>
            </Link>
            <Link href="/dashboard/salon">
              <Button variant="outlined">Host a Salon</Button>
            </Link>
          </Box>
        </Box>
        <Image src="/images/right-hero.svg" alt="hero" width={357} height={545} priority />
      </Box >
    </>
  );
}