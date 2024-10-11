import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Alert, LinearProgress, TextField } from "@mui/material";
import { useState } from "react";
import { BasicModalProps, SetIsLoadingFunction, ProfileFormValues, HTTPMethod } from "@utils/types";
import { useFormik } from "formik";
import HostProfileImageUpload from "./HostProfileImageUpload";
import { initializeProfileFormik, generateProfileValidationSchema, validateProfileForm, submitData, convertPostObjectToFormData, handleFileSelect, handleFileReset } from "@utils/form-creation-helpers";
import { USER_ENDPOINT } from "@config";
import { User } from "@prisma/client";

interface HostModalProps extends BasicModalProps {
  isLoading: boolean
  setIsLoading: SetIsLoadingFunction
  user: User
}

export default function HostModal({ nextClicked, userId, isLoading, setIsLoading, user }: HostModalProps) {
  const [selectedFile, setSelectedFile] = useState(user.profileImageUrl ? user.profileImageUrl : null);
  const [profilePreview, setProfilePreview] = useState(user.profileImageUrl ? user.profileImageUrl : "");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const formik = useFormik({
    initialValues: initializeProfileFormik(user),
    validationSchema: generateProfileValidationSchema(),
    onSubmit: async (values: ProfileFormValues) => {
      console.log("Values: ", values);
      const formattedValues = { ...values, file: selectedFile! };
      console.log("Submit Object:", formattedValues);

      const isValid = validateProfileForm(selectedFile, user.profileImageUrl);
      if (isValid) {
        const user = await submitData(`${USER_ENDPOINT}/formdata/${userId}`, HTTPMethod.Patch, convertPostObjectToFormData(formattedValues), setIsLoading, setIsError, setErrorMessage) as User;
        if (user) nextClicked!();
      }
    },
  });

  return user ? (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.8em",
      }}>
        <Box sx={{ width: "100%", color: "#8060FE" }}>
          <LinearProgress variant="determinate" color="inherit" value={90} />
        </Box>
        <Typography sx={{
          fontWeight: "bold",
          fontSize: "28px"
        }}>
          Create Your Host Profile!
        </Typography>

        <HostProfileImageUpload
          handleProfileSelect={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, setSelectedFile, setProfilePreview)}
          handleFileReset={() => handleFileReset(setSelectedFile, setProfilePreview)}
          previewUrl={profilePreview}
          setSelectedFile={setSelectedFile}
        />
        <Typography>
          You can edit your host profile anytime after the setup by going to <span style={{ fontWeight: "bold" }}>Host Hub &gt; Profile</span>.
        </Typography>

        <TextField
          fullWidth
          id="name"
          label="Full Name"
          variant="outlined"
          margin="normal"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.touched.name && Boolean(formik.errors.name)}
        />

        <TextField
          fullWidth
          id="bio"
          label="Bio"
          variant="outlined"
          name="bio"
          placeholder="Tell us about yourself and your interests. This can be changed later."
          multiline
          rows={4}
          onChange={formik.handleChange}
          value={formik.values.bio}
          error={formik.touched.bio && Boolean(formik.errors.bio)}
        />
        {isError &&
          <Alert severity="error" sx={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
            <Typography sx={{ fontWeight: "bold" }}>Important!</Typography>
            <Typography>
              {errorMessage}
            </Typography>
          </Alert>
        }
        <Box sx={{
          display: "flex",
          gap: "1em",
          justifyContent: "flex-end",
          mt: "1em"
        }}>
          <Button type="submit" disabled={isLoading} variant="contained" sx={{ minWidth: "100px" }}>Finish</Button>
        </Box>
      </Box>
    </form >
  ) : null;
};
