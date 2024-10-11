import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Payout } from "@utils/types";
import { getLocalDateFromUTC, getLocalTimeFromUTC } from "@utils/frontend-helpers";
import styled from "styled-components";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { NavigationButtons, StyledButton } from "./EpisodeTable/EpisodeTable.styles";

const HistoryBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  border: 1px solid #231F20;
  box-shadow: 0px 1px 2px 0px #0000000F;
  box-shadow: 0px 1px 3px 0px #0000001A;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

const HistorySection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 32px 0 28px;
`;

const StyledTable = styled(Table)`
  width: 100%;
  margin-bottom: 20px;
`;

function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "…";
}

export default function PayoutTable({ payouts, handleDownload, pagination }: { payouts: Payout[], handleDownload: any, pagination: any }) {
  const {
    page,
    handlePreviousClick,
    hasMore,
    handleNextClick,
  } = pagination;

  const { device } = useDevice() ?? {};

  return (
    <TableContainer sx={{ width: "100%", maxWidth: "848px", padding: device !== DeviceTypes.MOBILE ? "32px" : "20px" }} component={Paper}>
      <StyledTable aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Salon Title</TableCell>
            <TableCell align="right">Amount</TableCell>
            {/* <TableCell align="right">Status</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {payouts.map((payout, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell>{getLocalDateFromUTC(payout.time.toString())} @ {getLocalTimeFromUTC(payout.time.toString())}</TableCell>
              <TableCell>{truncateString(payout.type, 40)}</TableCell>
              <TableCell align="right">${payout.amount}</TableCell>
              {/* <TableCell align="right">
                <Chip label={"Pending"} sx={{ background: "#F9DDAF" }} /> : <></>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
      <NavigationButtons>
        <StyledButton
          disabled={page === 0}
          onClick={handlePreviousClick}
        >
          Previous
        </StyledButton>
  
        <StyledButton
          disabled={!hasMore}
          onClick={handleNextClick}
        >
          Next
        </StyledButton>
      </NavigationButtons>
      {payouts && payouts.length > 0 && (
        <HistorySection>
          <HistoryBtn onClick={handleDownload}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_9230_168)">
                <path d="M15.8327 7.5H12.4993V2.5H7.49935V7.5H4.16602L9.99935 13.3333L15.8327 7.5ZM4.16602 15V16.6667H15.8327V15H4.16602Z" fill="#FC714E"/>
              </g>
              <defs>
                <clipPath id="clip0_9230_168">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>

            <span>Download history</span>
          </HistoryBtn>
        </HistorySection>
      )}
    </TableContainer >
  );
}