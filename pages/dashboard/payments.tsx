import { Box, Button, Divider, Typography } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import PayoutTable from "@components/Tables/PayoutTable";
import { USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { calculateTotals, formatUnixTimestamp } from "@utils/frontend-helpers";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import styled from "styled-components";
import { useState } from "react";

const PayoutsContainer = styled(Box)`
  max-width: 848px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    margin-top: 20px;
  }
`;

const PayoutsHeader = styled(Typography)`
  font-weight: bold;
  font-size: 32px;
  line-height: 150%;
`;

// const PayoutInstructions = styled(Typography)`
//   margin-top: 32px;
//   font-family: "Abhaya Libre";
//   font-size: 16px;
//   font-weight: 700;
//   line-height: 26px;
//   letter-spacing: 0.01em;
//   text-align: left;
//   color: #231F20;

//   a {
//     cursor: pointer;
//     text-decoration: underline;
//     text-decoration-thickness: 2px !important;
//     text-decoration-color: #FC714E !important;
//     color: inherit;
//   }
// `;

export default function Payouts() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startingAfter, setStartingAfter] = useState<string>("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (newPage > page) {
      // Calculate the startingAfter value for the next page
      const lastItem = responseData?.transactions[rowsPerPage - 1];
      if (lastItem) {
        setStartingAfter(lastItem.id);
      }
    } else {
      // Reset startingAfter when going back to the first page
      setStartingAfter("");
    }
  };

  const { device } = useDevice() ?? {};

  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const { data: responseData } = useSWR(
    user?.stripeInfo?.account?.id
      ? `/api/transactions/transactions?accountId=${user.stripeInfo.account.id}&starting_after=${startingAfter || ""}&limit=${rowsPerPage}`
      : null,
    fetchGetJSON,
    {
      revalidateOnFocus: false,
    }
  );

  const isConnectedStripeAcc = user?.stripeInfo?.status?.payouts_enabled;
  const dashboardUrl = user?.stripeInfo?.loginLink;

  const payoutData = responseData?.transactions?.map((transaction: any) => {
    const description = transaction.description || "Tip";
    const amount = transaction.amount / 100; // Convert from cents to dollars
    const time = formatUnixTimestamp(transaction.created);
    return {
      type: description,
      amount,
      time
    };
  }) || [];

  const handleDownload = () => {
    if (payoutData && payoutData.length > 0) {
      // Helper function to format the date
      const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short"
        };
        return new Intl.DateTimeFormat("en-GB", options).format(date);
      };
      
      // CSV header with semicolon
      const header = "\"Salon Title\";\"Amount\";\"Date\"";
      
      // CSV rows with semicolon
      const rows = payoutData.map((payout: any) => {
        const date = new Date(payout.time);
        // Escape quotes in values
        const escapeQuotes = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;
        return `${escapeQuotes(payout.type)};${escapeQuotes(payout.amount.toString())};${escapeQuotes(formatDate(date))}`;
      }).join("\n");
      
      // Combine header and rows
      const csvContent = `data:text/csv;charset=utf-8,${header}\n${rows}`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "payments_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };  

  const hasMore = responseData?.hasMore ?? false;

  const handlePreviousClick = () => {
    handleChangePage(null, page - 1);
  };

  const handleNextClick = () => {
    handleChangePage(null, page + 1);
  };

  const paginationProps = {
    page,
    handlePreviousClick,
    hasMore,
    handleNextClick,
  };

  return (
    <DashboardLayout isLoading={false}>
      <PayoutsContainer>
        <PayoutsHeader variant="h2">Payments</PayoutsHeader>
        {dashboardUrl && isConnectedStripeAcc ? (
          <Button variant="outlined" onClick={() => window.open(dashboardUrl, "_blank")}>
            Stripe Dashboard
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => window.open(user?.stripeInfo?.connectLink, "_blank")}>
            Connect Stripe Account
          </Button>
        )}
      </PayoutsContainer>
      {payoutData && (
        <Box sx={{
          backgroundColor: "white",
          borderRadius: 2,
          border: "1px solid #E5E5E5",
          padding: device !== DeviceTypes.MOBILE ? "32px" : "20px",
          maxWidth: 848,
        }}>
          <Typography><span style={{ fontWeight: "bold", fontSize: "1.1em" }}>${responseData?.totalTicketSales || 0}</span> from ticket sales</Typography>
          <Typography><span style={{ fontWeight: "bold", fontSize: "1.1em" }}>${responseData?.totalTips || 0}</span> from tips</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography><span style={{ fontWeight: "bold", fontSize: "1.1em" }}>${responseData?.totalPayout || 0}</span> total payment</Typography>
        </Box>
      )}
      {/* {isConnectedStripeAcc ? (
        <div>
          {payoutData && payoutData.length > 0 && <Box sx={{ mt: 4 }}><PayoutTable payouts={payoutData} handleDownload={handleDownload} /></Box>}
        </div>
      ) : user?.stripeInfo?.connectLink ? (
        <PayoutInstructions>
          <span>To receive a payment, you must first fill out a </span>
          <a href={user?.stripeInfo?.connectLink} style={{ cursor: "pointer", textDecoration: "underline" }}>
             W form
          </a>{" "}
           and email it to{" "}
          <a href={"mailto:support@interintellect.com?subject=W Form"} style={{ cursor: "pointer", textDecoration: "underline" }}>
             support@interintellect.com
          </a>.
        </PayoutInstructions>
      ) : null} */}
      {isConnectedStripeAcc && (
        <div>
          {payoutData.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <PayoutTable payouts={payoutData} handleDownload={handleDownload} pagination={paginationProps} />
            </Box>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}