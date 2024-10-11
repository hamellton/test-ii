import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import Link from "next/link";

export default function ActionCard({ title, description, buttonText, iconPath, path, onClick }: { title: string, description: string, buttonText: string, iconPath: string, path: string, onClick?: (() => void) | null }) {
  return (
    <Box sx={{
      maxWidth: "350px",
      padding: "1.5em",
      border: "1px solid #C4C4C4",
      borderRadius: "12px",
    }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: "1em", }}>
        <Image src={iconPath} alt={title} width={20} height={20} style={{ marginRight: "0.5em", marginTop: "-3px" }} />
        <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>{title}</Typography>
      </Box>
      <Typography>{description}</Typography>
      {onClick ? (
        <Button onClick={onClick} variant="outlined" sx={{ mt: "1em", width: "100%" }}>
          <AddIcon sx={{ mr: 1, color: "#8060FE", fontSize: "1.2em" }} />
          {buttonText}
        </Button>
      ) : (
        <Link href={path}>
          <Button variant="outlined" sx={{ mt: "1em", width: "100%" }}>
            <AddIcon sx={{ mr: 1, color: "#8060FE", fontSize: "1.2em" }} />
            {buttonText}
          </Button>
        </Link>
      )}
    </Box >
  );
}