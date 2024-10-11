import React, { useState, useEffect } from "react";
import EventsTable from "@components/Dashboard/MyEvents/EventsTable/EventsTable";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { USER_STATUS_ENDPOINT, SALONS_ALL_ENDPOINT } from "@config";
import { ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import styled from "styled-components";
import AdminHostRequests from "@components/Dashboard/Admin/AdminHostRequests/AdminHostRequests";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import { Button } from "@mui/material";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #f9f9f9;

  @media (max-width: 600px) {
    margin-top: 25px;
  }
`;

const AdminContainer = styled.div`
  margin: 64px;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

export default function Events() {
  // const [view, setView] = useState<"events" | "adminHostRequests">("events");
  const [isLoading, setIsLoading] = useState(true);

  const { device } = useDevice() ?? {};

  const { data: user, error: userError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: salons, error: salonError } = useSWR(`${SALONS_ALL_ENDPOINT}`, fetchGetJSON);

  // True when no users or there is an error
  useEffect(() => {
    setIsLoading(!user || !!userError);
  }, [user, userError]);

  if (userError) return <div>failed to load user</div>;
  if (salonError) return <div>failed to load salons</div>;
  if (!salons || !user) return <DashboardLayout isLoading={true} user={user}><></></DashboardLayout >;
  if (user.isLoggedIn && !user?.isAdmin) return <>You must be an admin to view this page</>;

  const filteredSalons = salons.filter((salon: ExtendedSalon) => salon.state !== "DRAFT");
  // const filteredSalons = salons.filter((salon: ExtendedSalon) => (salon.state !== "DRAFT") && salon.tags && salon.tags.length > 0);

  return (
    <DashboardLayout isLoading={isLoading} user={user}>
      <AdminContainer>
        {/* <SwitchContainer>
          <Button onClick={() => setView("events")} variant={view === "events" ? "contained" : "outlined"} sx={{ minWidth: "100px" }}>Manage Events</Button>
          <Button
            variant={view === "adminHostRequests" ? "contained" : "outlined"}
            onClick={() => setView("adminHostRequests")}
            disabled={isLoading}
          >
          Manage Host Requests
          </Button>
        </SwitchContainer> */}
        {/* {view === "events" ? (
          <EventsTable user={user} salons={filteredSalons} series={[]} title="Manage Events" actionCard={false} hideDashboardMenu={device !== DeviceTypes.MOBILE ? true : false} />
        ) : (
          <AdminHostRequests />
        )} */}
        <EventsTable user={user} salons={filteredSalons} series={[]} title="Manage Events" actionCard={false} hideDashboardMenu={device !== DeviceTypes.MOBILE ? true : false} />
      </AdminContainer>
    </DashboardLayout>
  );
}
