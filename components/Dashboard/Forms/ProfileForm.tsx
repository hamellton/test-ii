import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useState } from "react";
import LinkBlock from "@components/Dashboard/HostProfile/LinkBlock";
import { User } from "@prisma/client";
import { USER_ENDPOINT } from "@config";
import { useFormik } from "formik";
import { convertPostObjectToFormData, generateProfileValidationSchemaFullForm, handleFileReset, handleFileSelect, initializeProfileFormik, submitData, validateProfileForm } from "@utils/form-creation-helpers";
import { HTTPMethod, ProfileFormValues, SetIsLoadingFunction } from "@utils/types";
import HostProfileImageUpload from "../Modals/HostProfileImageUpload";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfileForm({ isLoading, setIsLoading, user }: { isLoading: boolean, setIsLoading: SetIsLoadingFunction, user: User }) {
  const [selectedFile, setSelectedFile] = useState<File | string | null>(user.profileImageUrl ? user.profileImageUrl : null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.profileImageUrl ? user.profileImageUrl : "");
  const [isError, setIsError] = useState(false); // State to manage error
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error
  const router = useRouter();

  const formik = useFormik({
    initialValues: initializeProfileFormik(user),
    validationSchema: generateProfileValidationSchemaFullForm(),
    onSubmit: async (values: ProfileFormValues) => {
      const formattedValues = { ...values, file: selectedFile! };
      const isValid = validateProfileForm(selectedFile, user.profileImageUrl);
      if (isValid) {
        const modifiedUser = await submitData(`${USER_ENDPOINT}/formdata/${user.id}`, HTTPMethod.Patch, convertPostObjectToFormData(formattedValues), setIsLoading, setIsError, setErrorMessage) as User;
        if (modifiedUser) {
          router.push(`/hosts/${modifiedUser.slug}`); // Redirect on success
          localStorage.removeItem("salonData"); //Remove the data from localStorage
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ maxWidth: 730 }}>
        <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: "32px", lineHeight: "150%", mb: 2 }}>
          Customise your host profile
        </Typography>
        <Box sx={{ backgroundColor: "white", borderRadius: 2, border: "1px solid #E5E5E5", padding: 4, maxWidth: 730 }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: "20px", lineHeight: "150%", mb: 2 }}>
            Profile details
          </Typography>

          <HostProfileImageUpload
            handleProfileSelect={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, setSelectedFile, setPreviewUrl)}
            handleFileReset={() => handleFileReset(setSelectedFile, setPreviewUrl)}
            previewUrl={previewUrl}
            setSelectedFile={setSelectedFile}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, paddingTop: 4, mb: 2 }}>
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
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
              disabled
              value={formik.values.email}
            />
          </Box>
          <Box>
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
          </Box>

          <Box sx={{ paddingTop: 4, mb: 2 }}>
            <TextField
              fullWidth
              id="quote"
              label="Quote"
              variant="outlined"
              name="quote"
              placeholder="Tell us about yourself and your interests. This can be changed later."
              multiline
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.quote}
            />
          </Box>
        </Box>
        <Box sx={{ backgroundColor: "white", borderRadius: 2, border: "1px solid #E5E5E5", padding: 4, maxWidth: 730, mt: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: "20px", lineHeight: "150%", mb: 2 }}>
            Links
          </Typography>
          <Box>
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Social Links
            </Typography>
            <Box>
              <LinkBlock icon={"Website"} id={"webLink"} formik={formik} />
              <LinkBlock icon={"X"} id={"xLink"} formik={formik} />
              <LinkBlock icon={"Instagram"} id={"instaLink"} formik={formik} />
              <LinkBlock icon={"Substack"} id={"substackLink"} formik={formik} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: "1em", justifyContent: "flex-end", mt: "1em" }}>
          {user.slug && <Link href={`/hosts/${user.slug}`}>
            <Button variant="outlined" sx={{ minWidth: "100px" }}>View Profile</Button>
          </Link>}
          <a href={"mailto:support@interintellect.com"} style={{ textDecoration: "none" }}>
            <Button disabled={isLoading} variant="outlined" sx={{ minWidth: "100px" }}>Delete</Button>
          </a>
          <Button type="submit" disabled={isLoading} variant="contained" sx={{ minWidth: "100px" }}>Save</Button>
        </Box>
        <Box sx={{ mb: 2, width: "760px" }}>
          {isError && <Alert severity="error">{JSON.stringify(errorMessage)}</Alert>}
        </Box>
      </Box>
    </form >
  );
}