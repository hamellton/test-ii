import { Box, Snackbar, InputAdornment, TextField, CircularProgress } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import ActionCard from "@components/Dashboard/MyEvents/ActionCard";
// import SalonTable from "@components/Tables/SalonTable/SalonTable";
import BroadcastModal from "@components/Dashboard/MyEvents/BroadcastModal/BroadcastModal";
import SeriesTable from "@components/Tables/SeriesTable";
import { SyntheticEvent, useEffect, useState } from "react";
import { EventCategories, EventNames, SALON_ENDPOINT, SERIES_ENDPOINT } from "@config";
import { ExtendedSalon, frontEndAuthResponse, HTTPMethod } from "@utils/types";
import { Series } from "@prisma/client";
import { useRouter } from "next/router";
import { ResponsiveBox, ResponsiveTypography, ResponsiveActionBox, CustomTabs, CustomTab, CustomTabsHeading, SalonTableContainer, CustomFormControl, CustomInputLabel } from "./EventTable.styles";
import { useDispatch } from "react-redux";
import { showToast } from "@/store";
import ExtendedSalonTable from "@components/Tables/ExtendedSalonTable/ExtendedSalonTable";
import SearchIcon from "@mui/icons-material/Search";
import {styled } from "@mui/system";
import useDebounce from "@/hooks/useDebounce";
import SalonHistory from "@components/Dashboard/Modals/SalonHistory/SalonHistory";
import { getSalonPreviousChanges } from "./EventsTable.helper";
import axios from "axios";
import { logEvent } from "@utils/analytics";

const SearchField = styled(TextField)({
  backgroundColor: "#F8F8F8",
  borderRadius: 4,

  "& .MuiInputAdornment-root": {
    marginRight: "0",
  },
  "& .MuiOutlinedInput-root": {
    padding: "16px 12px",
    fontSize: "16px",
    fontWeight: "700",
    gap: "8px",

    "svg": {
      width: "24px",
      geight: "24px"
    },

    "& fieldset": {
      borderColor: "#E0E0E0",
    },

    "& .MuiOutlinedInput-input": {
      color: "#000",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "26px",
    }
  },
});

function CustomTabPanel(props: { children?: React.ReactNode, index: number, value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EventTable(props: { user: frontEndAuthResponse, salons: ExtendedSalon[], series: Series[], title: string, actionCard: boolean, hideDashboardMenu?: boolean }) {
  const { user, series, title, actionCard, hideDashboardMenu } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salonHistoryModal, setSalonHistoryModal] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ExtendedSalon[]>([]);
  const [salons, setSalons] = useState<ExtendedSalon[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setSalons(searchResults);
    } else if (debouncedSearchTerm.trim() === "" && props.salons && props.salons.length > 0) {
      setSalons(props.salons);
    } else {
      setSalons([]);
    }
  }, [debouncedSearchTerm, props.salons, searchResults]);

  const router = useRouter();
  const dispatch = useDispatch();

  const getPreviousSalons = (salons: ExtendedSalon[]) => salons.filter((salon: ExtendedSalon) => new Date(salon.startTime) < new Date());
  const getUpcomingSalons = (salons: ExtendedSalon[]) => salons.filter((salon: ExtendedSalon) => new Date(salon.startTime) > new Date());

  const [filteredUpcomingSalons, setFilteredUpcomingSalons] = useState(getUpcomingSalons(salons));
  const [filteredPastSalons, setFilteredPastSalons] = useState(getPreviousSalons(salons));

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get("/api/common/search", {
          params: {
            searchTerm: debouncedSearchTerm.trim(),
            ...(router.pathname !== "/dashboard/admin" && { hostId: user.userId }),
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm, router.pathname, user.userId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setFilteredUpcomingSalons(getUpcomingSalons(salons));
    setFilteredPastSalons(getPreviousSalons(salons));
  }, [debouncedSearchTerm, salons]);

  const handleBroadcast = async (id: string, message: string) => {
    try {
      const response = await fetch("/api/common/email", {
        method: HTTPMethod.Post,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, message, user }),
      });

      if (response.ok) {
        dispatch(showToast({ message: "Email sent successfully!", success: true }));
        console.log("Email sent successfully");
        setIsSnackbarOpen(true);
        setIsModalOpen(false);
      } else {
        dispatch(showToast({ message: "Failed to send email!", success: false }));
        console.error("Failed to send email");
      }
    } catch (error) {
      dispatch(showToast({ message: `Error sending email: ${error}`, success: false }));
      console.error("Error sending email:", error);
    }
    setIsSnackbarOpen(true);
    setIsModalOpen(false);
  };

  const handleBroadcastModalOpen = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_EMAIL_ATTENDEES_CLICKED);
  };

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    const response = await fetch(`${SALON_ENDPOINT}/${id}`, { method: HTTPMethod.Patch });
    setIsLoading(false);
    logEvent(EventCategories.USER_ACTION, EventNames.ADMIN_SALON_APPROVE_CLICKED);
    router.reload();
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const response = await fetch(`${SALON_ENDPOINT}/${id}`, { method: HTTPMethod.Delete });
    setIsLoading(false);
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_SALON_DELETE_CLICKED);
    router.reload();
  };

  const handleSeriesDelete = async (id: string) => {
    setIsLoading(true);
    const response = await fetch(`${SERIES_ENDPOINT}/${id}`, { method: "DELETE" });
    setIsLoading(false);
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_SERIES_DELETE_CLICKED);
    router.reload();
  };

  const handleSeriesApprove = async (id: string) => {
    setIsLoading(true);
    const response = await fetch(`${SERIES_ENDPOINT}/${id}`, { method: HTTPMethod.Patch });
    setIsLoading(false);
    logEvent(EventCategories.USER_ACTION, EventNames.ADMIN_SERIES_APPROVE_CLICKED);
    router.reload();
  };

  const handleSalonHistory = (value: boolean, id: string) => {
    if (id) setSelectedId(id);
    setSalonHistoryModal(value);
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SALON_HISTORY_CLICKED);
  };

  // Determine if the current path is `/dashboard/admin`
  const isAdminPage = router.pathname === "/dashboard/admin";

  return (
    <DashboardLayout isLoading={isLoading} user={user} hideMenu={hideDashboardMenu}>
      <BroadcastModal salon={salons.find((salon: ExtendedSalon) => salon.id === selectedId) || null} open={isModalOpen} handleClose={() => setIsModalOpen(false)} handleBroadcast={handleBroadcast} selectedId={selectedId || ""} />
      {salonHistoryModal && <SalonHistory 
        user={user} 
        salons={getSalonPreviousChanges(salons, selectedId)}
        handleDelete={handleDelete}
        handleApprove={handleApprove}
        setIsLoading={setIsLoading}
        handleBroadcastModalOpen={handleBroadcastModalOpen}
        handleSalonHistory={handleSalonHistory}
      />}
      <Snackbar open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        message="Message sent to attendees"
      />
      <ResponsiveBox isAdminPage={isAdminPage}>
        {actionCard && <>
          <ResponsiveTypography variant="h2">
            Create a New Event
          </ResponsiveTypography>
          <ResponsiveActionBox>
            <ActionCard
              title="Single Salon"
              description="A one-time event that focuses on a specific topic or theme."
              buttonText="Create a Single Salon"
              iconPath="/icons/single-salon.svg"
              path="/dashboard/salon"
            />
            <ActionCard
              title="Salon Series"
              description="A collection of related events that share a common theme or goal."
              buttonText="Create a Series"
              iconPath="/icons/series.svg"
              path="/dashboard/series"
            />
            {series.length > 0 &&
              <ActionCard
                title="Series Episode"
                description="A single event that belongs to an existing salon series."
                buttonText="Create a Series Episode"
                iconPath="/icons/series-episode.svg"
                path="/dashboard/episode"
                onClick={series.some((s: any) => s.state !== "DRAFT") ? null : () => {
                  dispatch(showToast({ message: "Please ensure there is at least one series that is not a draft.", autoHide: false, }));
                }}
              />
            }
          </ResponsiveActionBox>
        </>}

        {series.length > 0 && <SalonTableContainer>
          <ResponsiveTypography variant="h2">
            Your Series
          </ResponsiveTypography>
          <SeriesTable
            series={series}
            handleDelete={handleSeriesDelete}
            handleBroadcastModalOpen={handleBroadcastModalOpen}
            user={user}
            handleApprove={handleSeriesApprove}
          />
        </SalonTableContainer>}

        <SalonTableContainer>
          <CustomTabsHeading>
            <ResponsiveTypography variant="h2">
              {title}
            </ResponsiveTypography>
            <CustomFormControl>
              <CustomInputLabel shrink htmlFor="search-input">Search</CustomInputLabel>
              <SearchField
                placeholder="Event title"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </CustomFormControl>
          </CustomTabsHeading>
          <Box sx={{ mb: "1em" }}>
            <CustomTabs
              value={value}
              onChange={(event: SyntheticEvent, newValue: number) => setValue(newValue)}
              aria-label="basic tabs example"
            >
              <CustomTab label="Upcoming" {...a11yProps(0)} />
              <CustomTab label="Past Events" {...a11yProps(1)} />
            </CustomTabs>
          </Box>
          {!isSearching && !salons.length && debouncedSearchTerm.trim() !== "" && (
            <div style={{ paddingBottom: "20px" }}>Unfortunately, we couldn&apos;t find any matches for your search. Please try a different search term or ensure the spelling is correct.</div>
          )}
          {!isSearching && salons.length > 0 && (
            <>
              <CustomTabPanel value={value} index={0}>
                {isSearching ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : (
                  <ExtendedSalonTable
                    user={user}
                    salons={filteredUpcomingSalons}
                    series={series ? series : []}
                    handleDelete={handleDelete}
                    handleApprove={handleApprove}
                    setIsLoading={setIsLoading}
                    handleBroadcastModalOpen={handleBroadcastModalOpen}
                    handleSalonHistory={handleSalonHistory}
                    showPagination={!(searchResults && searchResults.length > 0)}
                  />
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {isSearching ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : (
                  <ExtendedSalonTable
                    user={user}
                    salons={filteredPastSalons}
                    series={series ? series : []}
                    handleDelete={handleDelete}
                    handleApprove={handleApprove}
                    setIsLoading={setIsLoading}
                    handleBroadcastModalOpen={handleBroadcastModalOpen}
                    handleSalonHistory={handleSalonHistory}
                    showPagination={!(searchResults && searchResults.length > 0)}
                  />
                )}
              </CustomTabPanel>
            </>
          )}
          {isSearching && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          )}
        </SalonTableContainer>
      </ResponsiveBox>
    </DashboardLayout>
  );
}
