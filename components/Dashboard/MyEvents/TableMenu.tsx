import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { MemberTicket, PublicTicket } from "@prisma/client";
import { EventCategories, EventNames, SALON_ENDPOINT, SERIES_ENDPOINT } from "@config";
import { HTTPMethod } from "@utils/types";
import { showToast } from "@/store";
import { useDispatch } from "react-redux";
import { logEvent } from "@utils/analytics";

const submitSalon = async (isSeries: any, userId: string, id: string, dispatch: Function) => {
  try {
    const response = await fetch(`${isSeries ? SERIES_ENDPOINT : SALON_ENDPOINT}/${id}`, {
      method: HTTPMethod.Put,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: "SUBMITTED", userId: userId || null }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    if (isSeries) {
      dispatch(showToast({ message: "Series successfully submitted!", success: true }));
      window.location.href = "/dashboard/my-events";
    } else {
      dispatch(showToast({ message: "Salon successfully submitted!", success: true }));
      window.location.href = `/dashboard/success?id=${id}`;
    }
  } catch (error) {
    dispatch(showToast({ message: "Error submitting salon!", success: false }));
  }
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AttendeesModal = ({ open, handleClose, publicTickets, memberTickets }: { open: boolean, handleClose: () => void, publicTickets: PublicTicket[], memberTickets: MemberTicket[] }) => {
  const attendees = [...publicTickets.map(ticket => ticket.email)];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="attendees-modal-title"
      aria-describedby="attendees-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="attendees-modal-title" variant="h6" component="h2">
          Attendees
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendees.map((email, index) => (
                <TableRow key={index}>
                  <TableCell>{email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default function TableMenu({
  id,
  slug,
  salonZoomStartUrl,
  salonLocation,
  salonLocationUrl,
  isAdmin,
  handleApprove,
  handleDelete,
  handleBroadcastModalOpen,
  publicTickets,
  memberTickets,
  isSeries,
  isEpisode,
  isDraft,
  userId,
  salon,
  handleSalonHistory,
}: {
  id: string,
  slug: string | null,
  salonZoomStartUrl?: string | null,
  salonLocationUrl?: string | null,
  salonLocation?: string | null,
  isAdmin?: boolean,
  handleApprove?: Function,
  handleDelete: Function,
  handleBroadcastModalOpen: Function,
  publicTickets?: PublicTicket[],
  memberTickets?: MemberTicket[],
  isSeries?: boolean,
  isEpisode?: boolean,
  isDraft: boolean,
  userId: any,
  salon?: any,
  handleSalonHistory?: any,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const hasTickets = (publicTickets && publicTickets?.length > 0) || (memberTickets && memberTickets?.length > 0);
  const disableActions = hasTickets && !isAdmin;

  const hasHistory = salon && salon.history && salon.history.length > 0;

  const router = useRouter();
  const dispatch = useDispatch();

  const handleEditClick = async () => {
    if (isSeries) {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SERIES_EDIT_CLICKED);
    } else if (isEpisode) {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_EPISODE_EDIT_CLICKED);
    } else {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SALON_EDIT_CLICKED);
    }

    window.open(`/dashboard/${isSeries ? "series" : isEpisode ? "episode" : "salon"}?id=${id}`, "_blank");
  };

  const handlePreviewClick = () => {
    if (isSeries) {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SERIES_MENU_PREVIEW_CLICKED);
    } else if (isEpisode) {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_EPISODE_MENU_PREVIEW_CLICKED);
    } else {
      logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SALON_MENU_PREVIEW_CLICKED);
    }

    window.open(`/${isSeries ? "series" : "salons"}/${slug}`, "_blank");
  };

  const handleCopyZoomLink = () => {
    if (!salonZoomStartUrl) return;
    navigator.clipboard.writeText(salonZoomStartUrl);
    setAnchorEl(null);
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_COPY_ZOOM_LINK_CLICKED);
    dispatch(showToast({ message: "Zoom Link copied!", success: true }));
  };

  const handleCopyLocation = () => {
    if (!salonLocation || !salonLocationUrl) return;
    navigator.clipboard.writeText(salonLocationUrl);
    setAnchorEl(null);
    logEvent(EventCategories.USER_ACTION, EventNames.DASHBOARD_COPY_LOCATION_CLICKED);
    dispatch(showToast({ message: "Location URL copied!", success: true }));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const openViewModal = () => {
  //   setModalOpen(true);
  //   setAnchorEl(null);
  //   logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_VIEW_ATTENDEES_CLICKED);
  // };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Typography sx={{ textDecoration: "underline", textTransform: "none" }}>
          Manage
        </Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {isDraft && <MenuItem onClick={() => submitSalon(isSeries, userId, id, dispatch)}>Submit</MenuItem>}
        {!disableActions && <MenuItem onClick={handleEditClick}>Edit</MenuItem>}
        <MenuItem onClick={handlePreviewClick}>Preview</MenuItem>
        {salonLocation && <MenuItem onClick={handleCopyLocation}>Copy Location</MenuItem>}
        {salonZoomStartUrl && <MenuItem onClick={handleCopyZoomLink}>Copy Zoom link</MenuItem>}
        {router.route.includes("admin") && isAdmin && handleApprove && <MenuItem onClick={() => handleApprove(id)}>Publish</MenuItem>}
        {/* {router.route.includes('admin') && isAdmin && <MenuItem onClick={openViewModal}>View Attendees</MenuItem>} */}
        {hasTickets && <MenuItem onClick={() => handleBroadcastModalOpen(id)}>Email attendees</MenuItem>}
        {handleSalonHistory && hasHistory && <MenuItem onClick={() => handleSalonHistory(true, id)}>Salon history</MenuItem>}
        {!disableActions && <MenuItem onClick={() => handleDelete(id)}>Delete</MenuItem>}
      </Menu>
      {publicTickets && memberTickets && <AttendeesModal open={modalOpen} handleClose={closeModal} publicTickets={publicTickets} memberTickets={memberTickets} />}
    </div>
  );
}