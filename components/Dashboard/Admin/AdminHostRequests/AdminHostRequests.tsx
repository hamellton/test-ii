import React, { useEffect, useState } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Button, Menu, MenuItem,
  Box
} from "@mui/material";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { UserPublic } from "@utils/types";
import styled from "styled-components";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";

const ResponsiveTypography = styled(Typography)`
  font-size: 32px;
  line-height: 150%;
  font-weight: bold;
  margin-bottom: 0.5em;
  margin-top: 64px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 1em;
    margin-top: 25px;
  }
`;

const ResponsiveTable = styled(Table)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const CardContainer = styled(Box)`
  display: none;
  
  @media (max-width: 600px) {
    display: block;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
`;

interface HostRequest {
  name: string;
  email: string;
  status: string;
  id: string;
}

interface UserWithMemberfulInfo extends UserPublic {
  memberInfo: {
    id: string;
    fullName: string;
    email: string;
    metadata: any;
    subscriptions: {
      id: string;
      plan: {
        id: string;
        name: string;
      };
    }[];
  } | null;
}

const AdminHostRequests: React.FC = () => {
  const [hostRequests, setHostRequests] = useState<HostRequest[]>([]);
  const [filteredHostRequests, setFilteredHostRequests] = useState<HostRequest[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Добавлено состояние загрузки
  const open = Boolean(anchorEl);

  const { data: users, error } = useSWR<UserWithMemberfulInfo[]>("/api/common/getUsersWithMemberfulInfo", fetchGetJSON);

  const fetchHostRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hostRequest");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setHostRequests(data);
    } catch (error) {
      console.error("Error fetching host requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHostRequests();
  }, []);

  useEffect(() => {
    if (users && hostRequests.length > 0) {
      const filteredRequests = hostRequests.filter(request => {
        const user = users.find(user => {
          return user.memberInfo && user.memberInfo.email === request.email;
        });
        if (user && user.memberInfo && user.memberInfo.subscriptions) {
          const hostSubscription = user.memberInfo.subscriptions.find(sub => sub.plan.name === "Host");
          return !Boolean(hostSubscription);
        }
        return false;
      });
      setFilteredHostRequests(filteredRequests);
    }
  }, [users, hostRequests]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, hostId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedHost(hostId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedHost(null);
  };

  const handleDeleteHostRequest = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hostRequest?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const deletedHostRequest = await response.json();
      fetchHostRequests();
      console.log("Deleted HostRequest:", deletedHostRequest);
    } catch (error) {
      console.error("Error deleting HostRequest:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubscription = async (email: string, id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/member/add-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          hostRequestId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding subscription");
      }

      const result = await response.json();
      console.log("Subscription added:", result);
      fetchHostRequests();
    } catch (error) {
      console.error("Error adding subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubscriptionClick = (email: string, id: string) => {
    handleAddSubscription(email, id);
    handleClose();
  };

  return (
    <div>
      <LoadingModal isLoading={isLoading} />
      <ResponsiveTypography variant="h2">
        Host Requests
      </ResponsiveTypography>
      <TableContainer component={Paper} sx={{ maxWidth: "1100px" }}>
        <ResponsiveTable sx={{ minWidth: 650 }} aria-label="host requests table">
          <TableHead>
            <TableRow sx={{ width: "100%" }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHostRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={(event) => handleClick(event, request.email)}
                  >
                    <Typography sx={{ textDecoration: "underline", textTransform: "none" }}>
                      Manage
                    </Typography>
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open && selectedHost === request.email}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handleDeleteHostRequest(request.id)}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ResponsiveTable>
      </TableContainer>

      <CardContainer>
        {filteredHostRequests.map((request) => (
          <Box key={request.id} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
            <Typography sx={{ mb: 1 }}>{request.name}</Typography>
            <Typography sx={{ mb: 1 }}>{request.email}</Typography>
            <Button
              onClick={(event) => handleClick(event, request.email)}
              sx={{ marginTop: "8px" }}
            >
              <Typography sx={{ textDecoration: "underline", textTransform: "none" }}>
                Manage
              </Typography>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open && selectedHost === request.email}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={() => handleAddSubscriptionClick(request.email, request.id)}>
                Submit Host
              </MenuItem>
              <MenuItem onClick={() => handleDeleteHostRequest(request.id)}>Delete</MenuItem>
            </Menu>
          </Box>
        ))}
      </CardContainer>
    </div>
  );
};

export default AdminHostRequests;
