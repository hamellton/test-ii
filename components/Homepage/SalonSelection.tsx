import { Box, Container, Grid } from "@mui/material";
import SalonCard from "../Common/SalonCard/SalonCard";
import { ExtendedSalon } from "@utils/types";

export default function SalonSelection({ heading, salons, isSuperSalon }: { heading: string, salons: ExtendedSalon[], isSuperSalon: boolean }) {
  return (
    <Container sx={{
      marginRight: '0 !important',
      marginLeft: '0 !important',
      marginTop: '2em',
      maxWidth: '100% !important',
      display: 'flex',
      justifyContent: 'center',
      color: 'black',
      background: isSuperSalon ? `url('/images/index/gradient.png') no-repeat center center/cover` : ''
    }}>
      <Box sx={{ margin: '1em', maxWidth: '1400px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, textAlign: 'left' }}>{heading}</h2>
        <Grid container spacing={4} alignItems='flex-start'>
          {salons.map((salonItem, index) => (
            <Grid item key={index} sx={{ padding: '30px' }}>
              <SalonCard salon={salonItem} />
            </Grid>
          ))}
        </Grid>
      </Box >
    </Container>
  )
}
