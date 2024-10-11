import Layout from "@components/Layout/Layout";
import { Box, Container, Typography } from "@mui/material";

export default function Event() {
  return (
    <Layout>
      <Box sx={{
        height: '100%',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
      }}>
        <Container maxWidth="md" sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h1">404</Typography>
          <Typography>Oh no! We couldn&apos;t find what you were looking for.</Typography>
        </Container>
      </Box>
    </Layout>
  )
}