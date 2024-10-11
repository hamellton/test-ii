import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import { SyntheticEvent, useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LanguageIcon from "@mui/icons-material/Language";
import SalonTag from "@components/SalonDetail/SalonTag";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";
import { USER_STATUS_ENDPOINT, TICKET_ENDPOINT, EventCategories, EventNames } from "@config";
import { frontEndAuthResponse, ExtendedSalon } from "@utils/types";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { ticketCardStyle } from "@utils/style-helpers";
import { Salon } from "@prisma/client";
import { getLocalDateFromUTC, getLocalTimeFromUTC } from "@utils/frontend-helpers";
import { logEvent } from "@utils/analytics";

const TicketCard = ({ salon }: { salon: Salon }) => {

  const handleJoinWithZoomClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_TICKETS_JOIN_WITH_ZOOM_CLICKED);
  };
  
  const handleOpenInMapsClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_TICKETS_OPEN_IN_MAPS_CLICKED);
  };

  return (
    <Box sx={ticketCardStyle()}>
      <Box>
        <SalonTag type={salon.type} />
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "text.secondary",
          mb: 1,
          mt: 2
        }}>
          <CalendarTodayIcon sx={{ mr: 1, fontSize: "14px" }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {getLocalDateFromUTC(salon.startTime.toString())} @ {getLocalTimeFromUTC(salon.startTime.toString())}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{
          fontWeight: "bold", mb: 2, fontSize: "24px",
        }}>
          <a style={{
            cursor: "pointer",
          }}>
            {salon.title}
          </a>
        </Typography>

        <Button 
          variant="contained" 
          sx={{ mb: 2 }} 
          onClick={salon.locationType === "VIRTUAL" ? handleJoinWithZoomClick : handleOpenInMapsClick}
        >
          {salon.locationType === "VIRTUAL" ? "Join with Zoom" : "Open in Maps"}
        </Button>

        <Box sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "text.secondary",
        }}>
          {salon.locationType === "VIRTUAL" ? (
            <LanguageIcon sx={{ mr: 1, fontSize: "16px" }} />
          ) : (
            <PlaceIcon sx={{ mr: 1, fontSize: "16px" }} />
          )}
          <Typography variant="body2" color="text.secondary">
            <a
              href={(salon.locationType === "VIRTUAL" ? salon.zoomJoinUrl : salon.location)!}
              style={{
                cursor: "pointer",
              }}>
              {(salon.locationType === "VIRTUAL" ? salon.zoomJoinUrl : salon.location)}
            </a>
          </Typography>
        </Box>
      </Box>
      <Image src={salon.imageUrl!} width={240} height={144} alt={""} style={{ borderRadius: "12px" }} />
    </Box >
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Tickets() {
  const [value, setValue] = useState(0);
  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: salons } = useSWR<ExtendedSalon[]>(user?.userId ? `${TICKET_ENDPOINT}/${user.email}` : null, fetchGetJSON);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_TICKETS_UPCOMING_CLICKED);
    } else if (newValue === 1) {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_TICKETS_PAST_EVENTS_CLICKED);
    }
  };

  return (
    <DashboardLayout isLoading={false}>
      <Box sx={{
        maxWidth: 730,
      }}>
        <Typography variant="h2" sx={{
          fontWeight: "bold",
          fontSize: "32px",
          lineHeight: "150%",
          mb: 2,
        }}>
          Your Tickets
        </Typography>
      </Box>
      <Box sx={{ mb: "1em" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Upcoming"  {...a11yProps(0)} />
          <Tab label="Past Events"  {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {salons && salons.map((salon) => (
          <TicketCard key={salon.id} salon={salon} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      </CustomTabPanel>
    </DashboardLayout>
  );
}