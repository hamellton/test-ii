import React, { useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import PlaceIcon from "@mui/icons-material/Place";
import { getLocalDateFromUTC, getLocalTimeFromUTC, truncateString, getSalonShareUrl, calculateRevenueAndSold, getStatusLabel } from "@utils/frontend-helpers";
import { ExtendedSalon, SetIsLoadingFunction } from "@utils/types";
import { paginate } from "@utils/frontend-helpers";
import {
  Container,
  StyledGrid,
  DetailsLink,
  IconBox,
  DateTimeText,
  NavigationButtons,
  StyledButton,
  TableHeadCell,
  SalonBox,
  SalonBoxHeading,
  EpisodeCardContainer,
  EpisodeDetails,
  EpisodeDetailsTitle,
  EpisodeCardTitle,
  EpisodeIconTextContainer,
  InfoText
} from "./EpisodeTable.styles";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { showToast } from "@/store";
import { useDispatch } from "react-redux";

const IconComponent = ({ salon }: { salon: ExtendedSalon }) => {
  const Icon = salon.locationType === "VIRTUAL" ? LanguageIcon : PlaceIcon;
  return <Icon sx={{ fontSize: "1em", mr: "0.5em", mt: "-0.15em" }} />;
};

const EpisodeTable = ({ salons, setIsLoading, series }: { salons: ExtendedSalon[], setIsLoading: SetIsLoadingFunction, series: any }) => {
  const [page, setPage] = useState<number>(1);
  const salonsPerPage = 12;
  const paginatedSalons = paginate(salons, salonsPerPage, page) as ExtendedSalon[];

  const dispatch = useDispatch();

  const seriesId = series?.id;

  const { device } = useDevice() ?? {};

  return (
    <div style={{ width: "100%" }}>
      {device !== DeviceTypes.MOBILE && <Container>
        <StyledGrid>
          <SalonBox>
            <SalonBoxHeading>Your Episodes</SalonBoxHeading>
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Salon details</TableHeadCell>
                    {/* <TableHeadCell>Attendees registered</TableHeadCell> */}
                    <TableHeadCell>Sold</TableHeadCell>
                    <TableHeadCell>Revenue</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSalons.map((salon) => {
                    const { revenue, sold } = calculateRevenueAndSold(salon);
                    return (
                      <TableRow key={salon.title} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          <Typography sx={{ fontWeight: "bold", fontSize: "14px", lineHeight: "150%", mb: "0.5em" }}>
                            <DetailsLink href={getSalonShareUrl(salon)} target="_blank" rel="noopener noreferrer">
                              {truncateString(salon.title, 50)}
                            </DetailsLink>
                          </Typography>
                          <IconBox>
                            <IconComponent salon={salon} />
                            <Typography sx={{ fontSize: "14px" }}>{salon.locationType === "VIRTUAL" ? "Online" : "In person"}</Typography>
                          </IconBox>
                          <DateTimeText>
                            {getLocalDateFromUTC((salon.startTime).toString(), true)}
                            <span style={{ margin: "0.2em" }}>•</span>
                            {getLocalTimeFromUTC((salon.startTime).toString())}
                          </DateTimeText>
                        </TableCell>
                        {/* <TableCell>{getNumAttendees(salon)}</TableCell> */}
                        <TableCell>{sold}</TableCell>
                        <TableCell>{revenue}</TableCell>
                        <TableCell>{getStatusLabel(salon.state)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {series && series.state === "DRAFT" ? (
              <Button onClick={() => {
                dispatch(showToast({ message: "Creating an episode for this series is not allowed because the series is still in draft status." }));
              }} variant="outlined" sx={{ mt: "1em", padding: "18px 24px" }}>
                <AddIcon sx={{ mr: 1, color: "#8060FE", fontSize: "16px" }} />
                Add a Series Episode
              </Button>
            ) : (
              <Link href={`/dashboard/episode?seriesId=${seriesId}`}>
                <Button variant="outlined" sx={{ mt: "1em", padding: "18px 24px" }}>
                  <AddIcon sx={{ mr: 1, color: "#8060FE", fontSize: "16px" }} />
                Add a Series Episode
                </Button>
              </Link>
            )}
            <NavigationButtons>
              <StyledButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</StyledButton>
              <StyledButton disabled={paginatedSalons.length < salonsPerPage} onClick={() => setPage(page + 1)}>Next</StyledButton>
            </NavigationButtons>
          </SalonBox>
        </StyledGrid>
      </Container>}

      {device === DeviceTypes.MOBILE && (
        <EpisodeCardContainer>
          <SalonBoxHeading>Salon details</SalonBoxHeading>
          {paginatedSalons.map((salon) => {
            const { revenue, sold } = calculateRevenueAndSold(salon);
            return (
              <Box key={salon.title} sx={{ width: "100%", mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
                <EpisodeDetails>
                  <EpisodeDetailsTitle>Event details</EpisodeDetailsTitle>
                  <EpisodeCardTitle>{truncateString(salon.title, 50)}</EpisodeCardTitle>
                  <EpisodeIconTextContainer>
                    <IconComponent salon={salon} />
                    <InfoText>{salon.locationType === "VIRTUAL" ? "Online" : "In person"}</InfoText>
                  </EpisodeIconTextContainer>
                  <InfoText>
                    <span>
                      {getLocalDateFromUTC(salon.startTime.toString(), true)}
                      <span style={{ margin: "0.2em" }}>•</span>
                      {getLocalTimeFromUTC(salon.startTime.toString())}
                    </span>
                  </InfoText>
                  <InfoText><div>Sold:</div> <span>{sold}</span></InfoText>
                  <InfoText><div>Revenue:</div> <span>{revenue}</span></InfoText>
                  <InfoText><div>Status:</div> <span>{getStatusLabel(salon.state)}</span></InfoText>
                </EpisodeDetails>
              </Box>
            );
          })}
          {series && series.state === "DRAFT" ? (
            <Button onClick={() => {
              dispatch(showToast({ message: "Creating an episode for this series is not allowed because the series is still in draft status." }));
            }} variant="outlined" sx={{ mt: "10px", padding: "10px 18px" }}>
              <AddIcon sx={{ mr: 1, color: "#8060FE", fontSize: "16px" }} />
                Add a Series Episode
            </Button>
          ) : (
            <Link href={`/dashboard/episode?seriesId=${seriesId}`}>
              <Button variant="outlined" sx={{ mt: "10px", padding: "10px 18px" }}>
                <AddIcon sx={{ mr: 1, color: "#8060FE", fontSize: "16px" }} />
                  Add a Series Episode
              </Button>
            </Link>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button disabled={paginatedSalons.length < salonsPerPage} onClick={() => setPage(page + 1)}>Next</Button>
          </Box>
        </EpisodeCardContainer>
      )}
    </div>
  );
};

export default EpisodeTable;
