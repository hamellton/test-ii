import { Box, Button } from "@mui/material";
import { ticketBoxStyle } from "@utils/style-helpers";


export default function SeriesTicketBox({
  handleModalOpen
}: {
  handleModalOpen: () => void
}) {

  
  // if (!hasValidSalonData) {
  //   return <Box sx={ticketBoxStyle()}><span>Required data is missing.</span></Box>;
  // }

  return (
    <Box sx={ticketBoxStyle()}>
      {/* <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} /> */}

      <Button variant="contained" onClick={handleModalOpen}>Buy series</Button>
    </Box>
  );
}
