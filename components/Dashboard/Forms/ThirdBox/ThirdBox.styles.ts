import styled from "styled-components";
import { Grid, FormControlLabel } from "@mui/material";

export const ThirdBoxContainer = styled(Grid)`
  width: 768px;
  padding: 32px;
  border: 1px solid #00000029;
  border-radius: 12px;
  background-color: #FFF;
  margin-top: 40px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const BoxHeading = styled(Grid)`
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-label {
    font-family: "Abhaya Libre";
    font-size: 16px;
    font-weight: 700;
    line-height: 25.6px;
    letter-spacing: 0.01em;
  }
`;