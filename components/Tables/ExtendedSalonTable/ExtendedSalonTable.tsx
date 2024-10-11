import React, { useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";
import TableMenu from "../../Dashboard/MyEvents/TableMenu";
import { getLocalDateFromUTC, getLocalTimeFromUTC, truncateString, calculateRevenueAndSold, getStatusLabel } from "@utils/frontend-helpers";
import Link from "next/link";
import { Series } from "@prisma/client";
import { ExtendedSalon, SetIsLoadingFunction, frontEndAuthResponse } from "@utils/types";
import { paginate } from "@utils/frontend-helpers";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { CardContainer, CardTitle, EventDetails, EventDetailsTitle, IconTextContainer, InfoText, TableCellStyled, TableContainerStyled } from "./ExtendedSalonTable.styles";
import { useRouter } from "next/router";

const IconComponent = ({ salon }: { salon: ExtendedSalon }) => {
  const Icon = salon?.locationType === "VIRTUAL" ? LanguageIcon : PlaceIcon;
  return <Icon sx={{ fontSize: "1em", mr: "0.5em", mt: "-0.15em" }} />;
};

const ExtendedSalonTable = ({ showPagination, user, showActions = true, salons, series, handleDelete, handleApprove, handleBroadcastModalOpen, handleSalonHistory }: {
  salons: ExtendedSalon[],
  series: Series[],
  user: frontEndAuthResponse,
  handleBroadcastModalOpen: (id: string) => void;
  handleApprove: (id: string) => void,
  handleDelete: (id: string) => void,
  setIsLoading: SetIsLoadingFunction,
  handleSalonHistory: any,
  showActions?: boolean,
  showPagination: boolean
}) => {
  const [page, setPage] = useState(1);
  const salonsPerPage = 12;
  const paginatedSalons = paginate(salons, salonsPerPage, page) as ExtendedSalon[];
  const { device } = useDevice() ?? {};

  const router = useRouter();

  const isAdminPage = router.pathname === "/dashboard/admin";

  return (
    <div>
      {device !== DeviceTypes.MOBILE && (
        <TableContainerStyled>
          <>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCellStyled isHeading={true}>Salon details</TableCellStyled>
                  <TableCellStyled isHeading={true} alignText={true}>Tickets sold</TableCellStyled>
                  <TableCellStyled isHeading={true} alignText={true}>Revenue</TableCellStyled>
                  <TableCellStyled isHeading={true} alignText={true}>Status</TableCellStyled>
                  <TableCellStyled isHeading={true} alignText={true}>Role</TableCellStyled>
                  <TableCellStyled isHeading={true} alignText={true}></TableCellStyled>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSalons.map((salon) => {
                  const { revenue, sold } = calculateRevenueAndSold(salon);
                  return (
                    <TableRow key={salon?.title} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {series && salon && salon?.seriesId && (
                          <Box sx={{ display: "flex", alignItems: "center", mb: "1em" }}>
                            <Link href={`/dashboard/series?id=${salon?.seriesId}`} style={{ display: "flex", textDecoration: "none" }}>
                              <Image src={"/icons/series.svg"} alt={"series icon"} width={20} height={20} style={{ marginRight: "0.5em" }} />
                              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                {truncateString(series.find(item => item.id === salon?.seriesId)?.title ?? "", 50)}
                              </Typography>
                            </Link>
                          </Box>
                        )}
                        {salon?.title && <Typography sx={{ fontWeight: "bold", fontSize: "14px", lineHeight: "150%", mb: "0.5em" }}>
                          {truncateString(salon?.title, 50)}
                        </Typography>}
                        {salon?.locationType && <Box sx={{ display: "flex", alignItems: "center", mb: "0.5em" }}>
                          <IconComponent salon={salon} />
                          <Typography sx={{ fontSize: "14px" }}>{salon?.locationType === "VIRTUAL" ? "Online" : "In person"}</Typography>
                        </Box>}
                        {salon?.startTime && <Typography sx={{ fontSize: "14px" }}>
                          {getLocalDateFromUTC((salon?.startTime).toString(), true)}
                          <span style={{ margin: "0.2em" }}>•</span>
                          {getLocalTimeFromUTC((salon?.startTime).toString())}
                        </Typography>}
                      </TableCell>
                      <TableCellStyled alignText={true}>{sold}</TableCellStyled>
                      <TableCellStyled alignText={true}>{revenue}</TableCellStyled>
                      <TableCellStyled alignText={true}>{getStatusLabel(salon?.state)}</TableCellStyled>
                      {isAdminPage ? (
                        <TableCellStyled alignText={true}>{"Host"}</TableCellStyled>
                      ) : (
                        <TableCellStyled alignText={true}>{salon?.hostId === user.userId ? "Host" : "Co-host"}</TableCellStyled>
                      )}
                      {handleBroadcastModalOpen && handleDelete && handleApprove && (
                        <TableCellStyled alignText={true}>
                          {showActions && <TableMenu
                            id={salon?.id}
                            slug={salon?.slug}
                            salonZoomStartUrl={salon?.locationType !== "IRL" ? salon?.zoomStartUrl : null}
                            salonLocation={salon?.locationType === "IRL" ? salon?.location : null}
                            salonLocationUrl={salon?.locationType === "IRL" ? salon?.locationUrl : null}
                            isAdmin={user.isAdmin ? true : false}
                            isEpisode={salon?.type === "SERIES_EPISODE" ? true : false}
                            handleApprove={handleApprove}
                            handleDelete={handleDelete}
                            handleBroadcastModalOpen={handleBroadcastModalOpen}
                            publicTickets={salon?.publicTickets}
                            memberTickets={salon?.memberTickets}
                            isDraft={salon?.state === "DRAFT"}
                            userId={user.userId}
                            salon={salon}
                            handleSalonHistory={handleSalonHistory}
                          />}
                        </TableCellStyled>
                      )}
                    </TableRow>
                  );})}
              </TableBody>
            </Table>
            {showPagination && <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button disabled={paginatedSalons.length < salonsPerPage} onClick={() => setPage(page + 1)}>Next</Button>
            </Box>}
          </>
        </TableContainerStyled>
      )}

      {device === DeviceTypes.MOBILE && (
        <CardContainer>
          {paginatedSalons.map((salon) => {
            const { revenue, sold } = calculateRevenueAndSold(salon);
            return (
              <Box key={salon?.title} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
                {series && salon?.seriesId && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: "1em" }}>
                    <Link href={`/dashboard/series?id=${salon?.seriesId}`} style={{ display: "flex", textDecoration: "none" }}>
                      <Image src={"/icons/series.svg"} alt={"series icon"} width={20} height={20} style={{ marginRight: "0.5em" }} />
                      <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                        {truncateString(series.find(item => item.id === salon?.seriesId)?.title ?? "", 50)}
                      </Typography>
                    </Link>
                  </Box>
                )}
                <EventDetails>
                  <EventDetailsTitle>Event details</EventDetailsTitle>
                  <CardTitle>{truncateString(salon?.title, 50)}</CardTitle>
                  <IconTextContainer>
                    <IconComponent salon={salon} />
                    <InfoText>{salon?.locationType === "VIRTUAL" ? "Online" : "In person"}</InfoText>
                  </IconTextContainer>
                  <InfoText>
                    <span>
                      {getLocalDateFromUTC(salon?.startTime.toString(), true)}
                      <span style={{ margin: "0.2em" }}>•</span>
                      {getLocalTimeFromUTC(salon?.startTime.toString())}
                    </span>
                  </InfoText>
                  <InfoText><div>Tickets sold:</div> <span>{sold}</span></InfoText>
                  <InfoText><div>Revenue:</div> <span>{revenue}</span></InfoText>
                  <InfoText><div>Status:</div> <span>{getStatusLabel(salon?.state)}</span></InfoText>
                  <InfoText><div>Role:</div> <span>{salon?.hostId === user.userId ? "Host" : "Co Host"}</span></InfoText>
                </EventDetails>
                {showActions && <TableMenu
                  id={salon?.id}
                  slug={salon?.slug}
                  salonZoomStartUrl={salon?.zoomStartUrl}
                  salonLocation={salon?.location}
                  salonLocationUrl={salon?.locationUrl}
                  isAdmin={user.isAdmin ? true : false}
                  isEpisode={salon?.type === "SERIES_EPISODE" ? true : false}
                  handleApprove={handleApprove}
                  handleDelete={handleDelete}
                  handleBroadcastModalOpen={handleBroadcastModalOpen}
                  publicTickets={salon?.publicTickets}
                  memberTickets={salon?.memberTickets}
                  isDraft={salon?.state === "DRAFT"}
                  userId={user.userId}
                  salon={salon}
                  handleSalonHistory={handleSalonHistory}
                />}
              </Box>
            );
          })}
          {showPagination && <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button disabled={paginatedSalons.length < salonsPerPage} onClick={() => setPage(page + 1)}>Next</Button>
          </Box>}
        </CardContainer>
      )}
    </div>
  );
};

export default ExtendedSalonTable;
