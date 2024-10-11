import React, { useRef, useState, useEffect } from "react";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { TextField } from "@mui/material";
import { FormikProps } from "formik";
import { SalonFormValues, CustomStandaloneSearchBox } from "@utils/types";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";

const libraries: ("places")[] = ["places"];

export default function PlaceComponent({ formik }: { formik: FormikProps<SalonFormValues> }) {
  const inputRef = useRef<CustomStandaloneSearchBox>(null);
  const [inputValue, setInputValue] = useState("");

  // Use the useEffect hook to set the inputValue state after the component mounts
  useEffect(() => {
    if (formik.values.location) {
      setInputValue(formik.values.location);
    }
  }, [formik.values.location]); // This ensures the effect runs once, after the component mounts

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,
    libraries,
  });

  const handlePlaceChanged = () => {
    const places = inputRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      formik.setFieldValue("location", place.formatted_address);
      formik.setFieldValue("locationUrl", place.url);
      setInputValue(place.formatted_address || "");
      // Defer validation until after the state update
      setTimeout(() => {
        formik.validateField("location");
      }, 0); // using 0ms timeout to push execution to the end of the call stack
    }
  };

  return (
    isLoaded ? (
      <StandaloneSearchBox
        //@ts-ignore
        onLoad={(ref) => inputRef.current = ref}
        onPlacesChanged={handlePlaceChanged}
      >
        <TextField
          fullWidth
          id="location"
          label="Address"
          variant="outlined"
          name="location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          // In case the user doesn't pick a value from the dropdown, could pick empty string or random input in the textbox
          onBlur={(e) => setInputValue(formik.values.location || "")}
          error={Boolean(formik.errors.location)}
        />
      </StandaloneSearchBox>
    ) : <LoadingModal isLoading={!isLoaded} />
  );
}
