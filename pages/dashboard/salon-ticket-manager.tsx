import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import styled from "styled-components";
import { 
  Box, 
  Typography, 
  Button, 
  Pagination, 
  Card, 
  CardContent, 
  CardActions 
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LanguageIcon from "@mui/icons-material/Language";
import PlaceIcon from "@mui/icons-material/Place";

import { USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import { fetchGetJSON } from "@utils/api-helpers";
import { getLocalDateFromUTC, getLocalTimeFromUTC } from "@utils/frontend-helpers";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const SalonContainer = styled(Card)`
  margin-bottom: 20px;
  border-radius: 12px;
`;

const SalonTitle = styled(Typography)`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 15px;
`;

const TicketCard = styled(Card)`
  margin-bottom: 15px;
  border-radius: 12px;
`;

const TicketCardContent = styled(CardContent)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function SalonTicketManager() {
  const { data: user, error: userError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  
  const [isLoading, setIsLoading] = useState(true);
  const [salons, setSalons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setIsLoading(!user || !!userError);
  }, [user, userError]);

  const fetchSalonsWithTickets = async (currentPage = 1) => {
    if (!user?.userId) return;
    try {
      const response = await fetch("/api/tickets/getSalonsWithTickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hostId: user.userId,
          page: currentPage,
          pageSize: 10
        })
      });
  
      const data = await response.json();
      setSalons(data.salons);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching salons:", error);
    }
  };

  useEffect(() => {
    fetchSalonsWithTickets(page);
  }, [user, page]);

  const handleApproveTicket = async (ticketId: string, paymentIntentId: string) => {
    try {
      await axios.post("/api/tickets/approve", {
        ticketId,
        paymentIntentId
      });
      fetchSalonsWithTickets(page);
    } catch (error) {
      console.error("Error approving ticket:", error);
    }
  };

  const handleDeclineTicket = async (ticketId: string, paymentIntentId: string) => {
    try {
      await axios.post("/api/tickets/decline", {
        ticketId,
        paymentIntentId
      });
      fetchSalonsWithTickets(page);
    } catch (error) {
      console.error("Error declining ticket:", error);
    }
  };

  return (
    <DashboardLayout isLoading={isLoading} user={user}>
      <PageContainer>
        <Typography variant="h4" gutterBottom>
        Ticket Approval Dashboard
        </Typography>

        {salons.map((salon: any) => (
          <SalonContainer key={salon.id}>
            <CardContent>
              <SalonTitle>
                {salon.title}
              </SalonTitle>
            
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1, fontSize: "14px" }} />
                <Typography variant="body2" color="text.secondary">
                  {getLocalDateFromUTC(salon.startTime.toString())} @ 
                  {getLocalTimeFromUTC(salon.startTime.toString())}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {salon.locationType === "VIRTUAL" ? (
                  <LanguageIcon sx={{ mr: 1, fontSize: "16px" }} />
                ) : (
                  <PlaceIcon sx={{ mr: 1, fontSize: "16px" }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  {salon.locationType === "VIRTUAL" 
                    ? salon.zoomJoinUrl 
                    : salon.location}
                </Typography>
              </Box>

              {salon.publicTickets.map((ticket: any) => {
                const isPendingTicket = ticket.status === "PENDING";
  
                return (
                  <TicketCard key={ticket.id}>
                    <TicketCardContent>
                      <Box>
                        <Typography variant="h6">{ticket.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
            Status: {ticket.status}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleApproveTicket(ticket.id, ticket.stripePaymentId)}
                          disabled={!isPendingTicket}
                        >
            Approve
                        </Button>
          
                        {isPendingTicket && (
                          <Button 
                            variant="contained" 
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleDeclineTicket(ticket.id, ticket.stripePaymentId)}
                          >
              Decline
                          </Button>
                        )}
                      </Box>
                    </TicketCardContent>
                  </TicketCard>
                );
              })}
            </CardContent>
          </SalonContainer>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </PageContainer>
    </DashboardLayout>
  );
}
