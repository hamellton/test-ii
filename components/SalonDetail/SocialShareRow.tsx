import { Box, Button, Divider, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import Image from "next/image";
import { copyTextToClipboard, createGoogleCalendarEventUrl, handleIcalDownload, getSalonShareUrl } from "@utils/frontend-helpers";
import { handleFacebookShareClick, handleLinkedInShareClick, handleTwitterShareClick } from "@utils/frontend-helpers";
import { ExtendedSalon } from "@utils/types";
import { useDispatch } from "react-redux";

export default function SocialShareRow({ salon, showSocials = true }: { salon: ExtendedSalon, showSocials?: boolean }) {
  const urlToShare = getSalonShareUrl(salon);
  const dispatch = useDispatch();

  return (
    <Box>
      <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" sx={{ flexGrow: 1, width: 0, padding: "10px 18px" }} onClick={() => handleIcalDownload(salon)}>
          iCal +
        </Button>
        <Button variant="outlined" sx={{ flexGrow: 1, width: 0, padding: "10px 18px" }} onClick={() => createGoogleCalendarEventUrl(salon)}>
          Google cal +
        </Button>
      </Box>
      {showSocials && (
        <>
          <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex" }}>
              <ShareIcon sx={{ mr: 1 }} />
              <Typography sx={{ fontWeight: "bold" }}> Share</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ cursor: "pointer" }} onClick={() => copyTextToClipboard(urlToShare, dispatch)}>
                <LinkIcon sx={{ mr: 1 }} />
              </Box>
              <Image src="/icons/x-icon.svg" alt="instagram" width={20} height={20} style={{ marginRight: "0.5em", color: "purple", cursor: "pointer" }}
                onClick={() => handleTwitterShareClick(urlToShare)}
              />
              <Image src="/icons/linkedin-icon.svg" alt="instagram" width={20} height={20} style={{ marginRight: "0.5em", color: "black", cursor: "pointer" }}
                onClick={() => handleLinkedInShareClick(urlToShare)}
              />
              <Image src="/icons/facebook-icon.svg" alt="Facebook" width={20} height={20} style={{ marginRight: "0.5em", cursor: "pointer" }}
                onClick={() => handleFacebookShareClick(urlToShare)}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}