import { Box, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { FormikProps } from "formik";
import { ProfileFormValues } from "@utils/types";

export default function LinkBlock({ icon, id, formik }: {
  icon: string;
  id: keyof ProfileFormValues;
  formik: FormikProps<ProfileFormValues>
}) {
  return (
    <Box sx={{ display: "flex", mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", minWidth: "140px", gap: 2 }}>
        {icon === "X" && <Image src={"/icons/x-icon.svg"} width={24} height={24} alt={"x icon"} />}
        {icon === "Website" && <Image src={"/icons/world-icon.svg"} width={24} height={24} alt={"world icon"} />}
        {icon === "Facebook" && <Image src={"/icons/facebook-icon.svg"} width={24} height={24} alt={"Facebook icon"} />}
        {icon === "Instagram" && <Image src={"/icons/instagram-icon.svg"} width={24} height={24} alt={"instagram icon"} />}
        {icon === "LinkedIn" && <Image src={"/icons/linkedin-icon.svg"} width={24} height={24} alt={"linkedin icon"} />}
        {icon === "Substack" && <Image src={"/icons/substack-icon.svg"} width={24} height={24} alt={"substack icon"} />}
        <Typography>{icon} </Typography>
      </Box>

      <TextField
        id={id}
        fullWidth
        variant="outlined"
        margin="normal"
        onChange={formik.handleChange}
        value={formik.values[id]}
      />
    </Box>
  );
} 