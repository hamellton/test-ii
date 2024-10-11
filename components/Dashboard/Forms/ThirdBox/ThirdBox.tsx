import { Grid, TextField, Checkbox, FormControlLabel, Button, Divider } from "@mui/material";
import Autocomplete from "../CustomInputs/Autocomplete/Autocomplete";
import { ThirdBoxProps } from "@utils/types";
import { salonFormHeadingStyle, salonFormTextStyle } from "@utils/style-helpers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BoxHeading, StyledFormControlLabel, ThirdBoxContainer } from "./ThirdBox.styles";
import { LOCATION_TYPE } from "@prisma/client";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import React from "react";

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: #8060FE;
  }
`;

const SpecialGuestsError = styled.div`
  color: #ff1744;
`;

const RemoveIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
`;

const SpecialGuestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  gap: 15px;

  @media (min-width: 600px) {
    margin-top: 12px;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
`;

const SpecialGuestTextFieldWrapper = styled.div`
  flex: 1;
`;

const SpecialGuestRemoveIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    justify-content: flex-start;
  }
`;

export default function ThirdBox({ formik, hosts, tags, isEpisode }: ThirdBoxProps) {
  const [showSpecialGuestInputs, setShowSpecialGuestInputs] = useState(formik.values.superSalon);
  const [specialGuests, setSpecialGuests] = useState(formik.values.specialGuests || [{ name: "", email: "" }]);

  const { device } = useDevice() ?? {};

  useEffect(() => {
    if (formik.values.locationType !== LOCATION_TYPE.VIRTUAL) {
      formik.setFieldValue("recordEvent", false);
    }
  }, [formik.values.locationType, formik.setFieldValue, formik]);

  useEffect(() => {
    if (formik.values.specialGuests) {
      const filteredGuests = formik.values.specialGuests.filter(
        guest => guest.name.trim() !== "" || guest.email.trim() !== ""
      );
  
      if (filteredGuests.length > 0) {
        setShowSpecialGuestInputs(true);
        setSpecialGuests(filteredGuests);
      } else {
        // setShowSpecialGuestInputs(false);
        // setSpecialGuests([]);
      }
    }
  }, [formik.values.specialGuests]);

  const handleSuperSalonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setShowSpecialGuestInputs(isChecked);
  
    formik.handleChange(event);
  
    if (!isChecked) {
      const emptyGuests: any = [];
      setSpecialGuests(emptyGuests);
      formik.setFieldValue("specialGuests", emptyGuests);
      formik.setFieldError("specialGuests", undefined);
    } else {
      setSpecialGuests([{ name: "", email: "" }]);
    }
  };

  const handleAddSpecialGuest = () => {
    setSpecialGuests(prevGuests => [...prevGuests, { name: "", email: "" }]);
  };

  const handleRemoveSpecialGuest = (index: number) => {
    const updatedGuests = specialGuests.filter((_, i) => i !== index);
    setSpecialGuests(updatedGuests);
    formik.setFieldValue("specialGuests", updatedGuests);
  
    if (updatedGuests.length === 0) {
      setShowSpecialGuestInputs(false);
      formik.setFieldValue("superSalon", false);
    }
  };
  

  const handleSpecialGuestChange = (index: number, field: "name" | "email", value: string) => {
    const updatedGuests = [...specialGuests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setSpecialGuests(updatedGuests);
    formik.setFieldValue("specialGuests", updatedGuests);
  };

  const specialGuestError = formik.errors.specialGuests && formik.touched.specialGuests;
  const getGuestError = (index: number, field: "name" | "email") => {
    if (specialGuestError) {
      return (formik.errors.specialGuests as any)[index]?.[field];
    }
    return undefined;
  };

  const isGuestTouched = (index: number, field: "name" | "email") => {
    if (specialGuestError) {
      return (formik.touched.specialGuests as any)[index]?.[field];
    }
    return false;
  };


  return (
    <ThirdBoxContainer>
      <BoxHeading xs={12}>{isEpisode ? "Episode Details" : "Salon Details"}</BoxHeading>

      <Grid item xs={12} style={{ margin: "25px 0" }}>
        <Autocomplete
          fieldName="coHosts"
          formik={formik}
          label="Co-hosts"
          placeholder="Select hosts"
          options={hosts}
        />
      </Grid>

      {!isEpisode && <Grid item xs={12}>
        <Grid item xs={12} style={salonFormHeadingStyle()}>Super Salon</Grid>

        <Grid item xs={12} style={salonFormTextStyle()}>
          A Super Salon is a salon that features one or more special guests who are experts or influencers in the topic of your salon.
        </Grid>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formik.values.superSalon}
              onChange={handleSuperSalonChange}
              name="superSalon"
              color="primary"
            />
          }
          label="I want to host a Super Salon"
        />
        <SpecialGuestsError>{formik.errors.specialGuests && typeof formik.errors.specialGuests === "string" && formik.errors.specialGuests}</SpecialGuestsError>
      </Grid>}

      {!isEpisode && showSpecialGuestInputs && (
        <>
          {specialGuests && specialGuests.length > 0 && specialGuests.map((guest, index) => (
            <React.Fragment  key={index}>
              <SpecialGuestsContainer>
                <SpecialGuestTextFieldWrapper style={{ flexBasis: "calc(50% - 8px)" }}>
                  <TextField
                    fullWidth
                    id={`specialGuestName-${index}`}
                    label="Name"
                    variant="outlined"
                    value={guest.name}
                    onChange={(e) => handleSpecialGuestChange(index, "name", e.target.value)}
                    error={isGuestTouched(index, "name") && !!getGuestError(index, "name")}
                    helperText={isGuestTouched(index, "name") && getGuestError(index, "name") ? getGuestError(index, "name") : ""}
                  />
                </SpecialGuestTextFieldWrapper>
                <SpecialGuestTextFieldWrapper style={{ flexBasis: "calc(50% - 8px)" }}>
                  <TextField
                    fullWidth
                    id={`specialGuestEmail-${index}`}
                    label="Email"
                    variant="outlined"
                    value={guest.email}
                    onChange={(e) => handleSpecialGuestChange(index, "email", e.target.value)}
                    error={isGuestTouched(index, "email") && !!getGuestError(index, "email")}
                    helperText={isGuestTouched(index, "email") && getGuestError(index, "email") ? getGuestError(index, "email") : ""}
                  />
                </SpecialGuestTextFieldWrapper>
                <SpecialGuestRemoveIconContainer>
                  {device !== DeviceTypes.MOBILE ? (
                    <RemoveIcon onClick={() => handleRemoveSpecialGuest(index)}>
                  &times;
                    </RemoveIcon>
                  ) : (
                    <RemoveIcon onClick={() => handleRemoveSpecialGuest(index)}>Remove guest</RemoveIcon>
                  )}
                </SpecialGuestRemoveIconContainer>
              </SpecialGuestsContainer>
              {device === DeviceTypes.MOBILE && specialGuests.length > 1 && <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} />}
            </React.Fragment>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddSpecialGuest}
            style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "18px 20px" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_7422_5659)">
                <path d="M15.8332 10.8337H10.8332V15.8337H9.1665V10.8337H4.1665V9.16699H9.1665V4.16699H10.8332V9.16699H15.8332V10.8337Z" fill="#8060FE"/>
              </g>
              <defs>
                <clipPath id="clip0_7422_5659">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>

            <span>Add another special guest</span>
          </Button>
        </>
      )}

      {isEpisode ? (
        <>
          <Grid item xs={12} style={{ margin: "25px 0 " }}>
            <Autocomplete
              fieldName="tags"
              formik={formik}
              label="Salon Tags"
              placeholder="Select tags"
              options={tags}
            />
          </Grid>
          <Grid item xs={12} style={{ margin: "25px 0 " }}>
            <TextField
              fullWidth
              id="additionalInfo"
              label="Additional Information"
              variant="outlined"
              multiline
              rows={5}
              name="additionalInfo"
              onChange={formik.handleChange}
              value={formik.values.additionalInfo}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} style={{ margin: "25px 0 " }}>
            <TextField
              fullWidth
              id="additionalInfo"
              label="Additional Information"
              multiline
              rows={5}
              variant="outlined"
              name="additionalInfo"
              onChange={formik.handleChange}
              value={formik.values.additionalInfo}
            />
          </Grid>

          <Grid item xs={12} style={{ margin: "25px 0 " }}>
            <Autocomplete
              fieldName="tags"
              formik={formik}
              label="Salon Tags"
              placeholder="Select tags"
              options={tags}
            />
          </Grid>
        </>
      )}

      {formik.values.locationType === LOCATION_TYPE.VIRTUAL && <Grid item xs={12}>
        <StyledFormControlLabel
          control={
            <CustomCheckbox
              checked={formik.values.recordEvent}
              onChange={formik.handleChange}
              name="recordEvent"
            />
          }
          label="Record event"
        />
      </Grid>}
    </ThirdBoxContainer>
  );
}
