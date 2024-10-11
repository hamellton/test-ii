import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { broadcastModalStyle } from "@utils/style-helpers";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { ExtendedSalon } from "@utils/types";
import DiscardButton from "@components/Common/DiscardButton/DiscardButton";
import { MessageAttendeesActionContainer, SendButton } from "./BroadcastModal.styles";
import React, { useEffect } from "react";

export default function BroadcastModal({ open, handleClose, handleBroadcast, selectedId, salon }: { open: boolean, salon: ExtendedSalon | null, handleClose: () => void, handleBroadcast: (id: string, message: string) => void, selectedId: string }) {
  const [message, setMessage] = React.useState("");

  const { device } = useDevice() ?? {};

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const handleSendClick = () => {
    handleBroadcast(selectedId, message);
    setMessage(""); // Clear the message after sending
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={device === DeviceTypes.MOBILE ? { ...broadcastModalStyle(), width: "90%" } : broadcastModalStyle()}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.8em" }}>
          <Typography sx={{ fontWeight: "700", fontSize: "28px", lineHeight: "42px" }}>
            Message your attendees
          </Typography>
          {salon && <Typography sx={{ fontWeight: "700", fontSize: "20px", lineHeight: "30px" }}>
            {salon.title}
          </Typography>}
          <Typography>
            Communicate with your event attendees before, during, or after your event.
          </Typography>
          <Typography>
            You will receive a copy of this message into your email inbox.
          </Typography>
          <TextField
            fullWidth
            id="description"
            label="Message to your attendees"
            placeholder="Inform your attendees of any important changes, send links to the event recordings and thank them for coming"
            variant="outlined"
            name="description"
            multiline
            rows={4}
            value={message}
            onChange={handleInputChange}
            sx={{ mt: 2, mb: 2 }}
          />
          <MessageAttendeesActionContainer>
            <DiscardButton onClick={handleClose} />
            <SendButton variant="outlined" onClick={handleSendClick}>
              Send Message
              <SendIcon />
            </SendButton>
          </MessageAttendeesActionContainer>
        </Box>
      </Box>
    </Modal >
  );
};

