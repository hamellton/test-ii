import styled from "styled-components";
import { Grid, TextField, FormControlLabel, RadioGroup, InputLabel } from "@mui/material";

export const FirstBoxContainer = styled(Grid)`
  width: 768px;
  padding: 32px;
  border: 1px solid #00000029;
  border-radius: 12px;
  background-color: #FFF;
  margin-top: 0;

  @media (max-width: 600px) {
    width: 100%;
    padding: 18px;
  }
`;

export const BoxHeading = styled(Grid)`
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
`;

export const SectionHeading = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  margin-bottom: 15px;
`;

export const FormContainer = styled(Grid)`
  margin-bottom: 30px;
`;

export const TimeContainer = styled(Grid)`
  margin-top: 20px;
`;

export const CoverImageHeading = styled.div`
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.25rem;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  margin-bottom: 30px;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  .MuiTypography-root {
    font-size: 1rem;
  }
`;

export const StyledTextField = styled(TextField)`
  margin: 25px 0;
`;

export const StyledTextFieldWithMargin = styled(TextField)`
  margin: 30px 0 50px;
`;

export const StyledSeriesSelectLabel = styled(InputLabel)`
  background-color: #fff;
`;

export const OnlineFormControlLabel = styled(FormControlLabel)`
  .mui-style-1makl9p-MuiFormControlLabel-root {
    margin-left: 0 !important;
  }
`;