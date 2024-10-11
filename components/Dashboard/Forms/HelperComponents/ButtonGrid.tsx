
import { Grid, Stack } from "@mui/material";
// import { LaptopIcon, SendIcon, DotPointsIcon, MessageTextIcon, BookIcon, RocketIcon } from "@/icons/svgIcons";
// import InfoButton from "@components/Dashboard/Forms/HelperComponents/InfoButton";
import styled from "styled-components";

const Container = styled(Grid)`
  width: 100%;
  max-width: 768px;

  @media (max-width: 768px) {
    padding: 0 16px;
    width: auto;
    max-width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

const Heading = styled.div`
  font-weight: 700;
  font-size: 2rem;
  line-height: 3rem;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 2.25rem;
  }
`;

export default function ButtonGrid({ heading }: { heading: string }) {
  return (
    <Container container>
      <Heading>{heading}</Heading>
    </Container>
  );
  // return (
  //   <Grid container style={{ width: "768px" }}>
  //     <div style={{ fontWeight: 700, fontSize: "32px", lineHeight: "48px" }}>
  //       {heading}
  //     </div>

    

  //     {/* <div style={{ fontWeight: 400, fontSize: '16px', lineHeight: '25.6pxpx'}}>
  //       Before you start we have gathered some tools that will help you go through all the details about the community so you don&apos;t feel lost, we will be here next to you, for the whole journey, pinky promise.
  //     </div> */}

  //     {/* <Grid container spacing={2}>

  //       <Grid item xs={6}>
  //         <Stack direction="column" spacing={2}>
  //           <InfoButton
  //             buttonText="How to Run a Show"
  //             startIcon={<LaptopIcon />}
  //             link='howto'
  //           />
  //           <InfoButton
  //             buttonText="The Five Rules of Gathering"
  //             startIcon={<DotPointsIcon />}
  //             link='rules'
  //           />
  //           <InfoButton
  //             buttonText="Salon Code of conduct"
  //             startIcon={<BookIcon />}
  //             link='code'
  //           />
  //         </Stack>
  //       </Grid>

  //       <Grid item xs={6}>
  //         <Stack direction="column" spacing={2}>
  //           <InfoButton
  //             buttonText="Submit To Our Host Pages"
  //             startIcon={<SendIcon />}
  //             link='submit'
  //           />
  //           <InfoButton
  //             buttonText="Hosts Hot Tips"
  //             startIcon={<MessageTextIcon />}
  //             link='hosttips'
  //           />
  //           <InfoButton
  //             buttonText="Request a Feature"
  //             startIcon={<RocketIcon />}
  //             link='request'
  //           />
  //         </Stack>
  //       </Grid>
  //     </Grid> */}
  //    </Grid>
  // );
}