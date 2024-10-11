import React, { useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Box } from "@mui/material";
import TableMenu from "../Dashboard/MyEvents/TableMenu";
import { Series } from "@prisma/client";
import { truncateString } from "@utils/frontend-helpers";
import { paginate } from "@utils/frontend-helpers";
import { frontEndAuthResponse } from "@utils/types";
import styled from "styled-components";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

const CardContainer = styled(Box)`
  display: none;
  
  @media (max-width: 600px) {
    display: block;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
`;

const CardTitle = styled(Typography)`
  font-weight: bold;
  font-size: 16px;
`;

const SeriesTable = ({ series, user, handleDelete, handleApprove, handleBroadcastModalOpen }: { series: Series[], user: frontEndAuthResponse, handleApprove: Function, handleDelete: Function, handleBroadcastModalOpen: (id: string) => void }) => {
  const [page, setPage] = useState(1);
  const seriesPerPage = 12;
  const paginatedSeries = paginate(series, seriesPerPage, page);

  const { device } = useDevice() ?? {};

  return (
    <TableContainer component={Paper}>
      {device !== DeviceTypes.MOBILE && (
        <>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Series details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSeries.map((series: Series) => (
                <TableRow key={series.title} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ width: "100%" }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px", lineHeight: "150%" }}>
                      {truncateString(series.title, 100)}
                    </Typography>
                  </TableCell>
                  <TableCell>{series.state}</TableCell>
                  <TableCell sx={{ minWidth: "200px", textAlign: "center" }}>
                    <TableMenu
                      id={series.id}
                      slug={series.slug}
                      handleDelete={handleDelete}
                      handleApprove={handleApprove}
                      isSeries={true}
                      handleBroadcastModalOpen={handleBroadcastModalOpen}
                      isDraft={series.state === "DRAFT"}
                      userId={user}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button disabled={paginatedSeries.length < seriesPerPage} onClick={() => setPage(page + 1)}>Next</Button>
          </Box>
        </>
      )}
      {device === DeviceTypes.MOBILE && (
        <CardContainer>
          {paginatedSeries.map((series: Series) => (
            <Box key={series.title} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
              <CardTitle>
                {truncateString(series.title, 100)}
              </CardTitle>
              <Typography sx={{ mb: 1 }}>Status: {series.state}</Typography>
              <TableMenu
                id={series.id}
                slug={series.slug}
                handleDelete={handleDelete}
                isSeries={true}
                handleBroadcastModalOpen={handleBroadcastModalOpen}
                isDraft={series.state === "DRAFT"}
                userId={user}
              />
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button disabled={paginatedSeries.length < seriesPerPage} onClick={() => setPage(page + 1)}>Next</Button>
          </Box>
        </CardContainer>
      )}
    </TableContainer>
  );
};

export default SeriesTable;
