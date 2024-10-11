import styled from "styled-components";
import { Grid } from "@mui/material";

export const FormContainer = styled.form`
  margin-top: 50px;

  @media (max-width: 768px) {
    margin-top: 25px;
  }
`;

export const GridContainer = styled(Grid)`
  width: 760px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SalonBox = styled(Grid)<{ isFirstBox?: boolean }>`
  width: 768px;
  padding: 32px;
  border: 1px solid #00000029;
  border-radius: 12px;
  background-color: #FFF;
  margin-top: ${({ isFirstBox }) => (isFirstBox ? "0" : "40px")};

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

export const SalonBoxHeading = styled(Grid)`
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
    font-size: 20px;
    line-height: 32px;
  }
`;

export const TitleContainer = styled(Grid)`
  margin: 25px 0;
`;

export const DescriptionContainer = styled(Grid)`
  margin: 30px 0 90px;

  @media (max-width: 768px) {
    margin: 15px 0 45px;
  }
`;
