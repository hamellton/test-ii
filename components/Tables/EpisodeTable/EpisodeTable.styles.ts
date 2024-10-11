import styled from "styled-components";
import { Typography, Box, Button, TableCell  } from "@mui/material";

export const Container = styled.div`
  width: 760px;
  margin-top: 50px;

  th {
    border: none;
    font-family: "Abhaya Libre, serif";
    font-size: 15px;
  }

  td {
    border: none;
    /* text-align: center; */
    font-size: 15px;
  }

  tr {
    border-bottom: 1px solid rgba(224, 224, 224, 1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const StyledGrid = styled.div`
  width: 100%;
`;

export const DetailsLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

export const IconBox = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

export const DateTimeText = styled(Typography)`
  font-size: 14px;
`;

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

export const StyledButton = styled(Button)`
  && {
    margin: 0 8px;
  }
`;

export const TableHeadCell = styled(TableCell)`
  border-bottom: none;
`;

export const SalonBox = styled.div`
  width: 768px;
  padding: 32px;
  border: 1px solid #00000029;
  border-radius: 12px;
  background-color: #FFF;
  margin-top: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SalonBoxHeading = styled(Typography)`
  margin-bottom: 32px;
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
  }
`;

export const EpisodeCardContainer = styled(Box)`
  width: 215px;
  display: block;
`;

export const EpisodeCardTitle = styled(Typography)`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 0.5em;
`;

export const EpisodeDetailsTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 1em;
`;

export const EpisodeDetails = styled.div`
  margin-bottom: 1em;
`;

export const InfoText = styled(Typography)`
  font-size: 14px;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  div {
    font-weight: bold;
  }
`;

export const EpisodeIconTextContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;