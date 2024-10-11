import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export default function SalonTag({ type }: { type: string }) {
  // Define a function or an object to map types to background colors
  const backgroundColorMap: { [key: string]: string } = {
    "SUPER_SALON": "#D0C4FF",
    "SERIES_EPISODE": "#EDEA9B",
    "SALON": "#C4EAFF",
    "SERIES_BADGE": "#E3EBAC",
    "SERIES": "#E3EBAC",
  };

  const backgroundColor = backgroundColorMap[type] || "#FFFFFF";

  const captionMap: { [key: string]: string } = {
    "SUPER_SALON": "Super Salon",
    "SERIES_EPISODE": "Episode",
    "SALON": "Salon",
    "SERIES_BADGE": "Salon Series",
    "SERIES": "Series"
  };

  const caption = captionMap[type] || "Salon";

  const iconMap: { [key: string]: string } = {
    "SUPER_SALON": "/icons/star.svg",
    "SERIES_EPISODE": "/icons/square.svg",
    "SALON": "/icons/circle.svg",
    "SERIES": "/icons/series_black.svg",
  };

  const icon = iconMap[type] || "/icons/star.svg";

  return (
    <Box sx={{
      backgroundColor: backgroundColor,
      padding: "4px 8px",
      borderRadius: "16px 16px 16px 0px",
      display: "inline-flex",
    }}>
      <Image src={icon} width={16} height={16} alt={""} style={{ marginTop: "2px" }} />
      <Typography sx={{
        fontSize: "14px",
        fontWeight: "600",
        ml: "3px",
        mt: "1px",
        mr: "1px"
      }}>
        {caption}
      </Typography>
    </Box>
  );
}