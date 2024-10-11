import styled from "styled-components";
import { Grid, Slider } from "@mui/material";

export const SecondBoxContainer = styled(Grid)`
  width: 768px;
  padding: 32px;
  border: 1px solid #00000029;
  border-radius: 12px;
  background-color: #FFF;
  margin-top: 40px;

  @media (max-width: 600px) {
    width: 100%;
    margin-top: 40px;
  }
`;

export const BoxHeading = styled(Grid)`
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;

  @media (max-width: 600px) {
    margin-bottom: 20px;
  }
`;

export const SliderWrapper = styled(Grid)`
  margin-top: 80px;

  @media (max-width: 600px) {
    margin-top: 20px;
  }
`;

export const StyledSlider = styled(Slider)`
  width: 400px;
  & .MuiSlider-thumb {
    background-color: #8060FE;
  }
  & .MuiSlider-track {
    background-color: #8060FE;
    border-color: #8060FE;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const InfoWrapper = styled(Grid)`
  margin: 35px 0 0;

  @media (max-width: 600px) {
    margin: 15px 0 0;
  }
`;

export const InfoText = styled.div`
  font-size: 20px;
  line-height: 30px;
`;

export const EarningsText = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`;

export const HighlightedText = styled.span`
  color: #8060FE;
`;

export const PublicTicketsDescription = styled(Grid)`
  margin: 15px 0;
  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 25.6px;
  letter-spacing: 0.01em;
  color: #231F20;
`;