import { TextField, Grid, FormControl, Select, MenuItem } from "@mui/material";
import React, { useEffect } from "react";
import { FormControlLabel, RadioGroup } from "@mui/material";
import { OnlineIcon, InPersonIcon } from "@/icons/svgIcons";
import { StyledRadio, getFormControlLabelStyles } from "@utils/style-helpers";
import FileUpload from "../CustomInputs/FileUpload";
import PlaceComponent from "../CustomInputs/PlaceComponent";
import useSWR from "swr";
import { LOCATION_TYPE, Series } from "@prisma/client";
import { fetchGetJSON } from "@utils/api-helpers";
import { FirstBoxProps } from "@utils/types";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { salonFormHeadingStyle, salonFormTextStyle } from "@utils/style-helpers";
import { SERIES_ENDPOINT } from "@config";
import { BoxHeading, FirstBoxContainer, StyledSeriesSelectLabel, OnlineFormControlLabel } from "./FirstBox.styles";

export default function FirstBox({ formik, setFieldValue, handleFileSelect, handleFileReset, previewUrl, isEpisode, currentTime }: FirstBoxProps) {

  const { data: series, error: seriesError } = useSWR<Series[]>(`${SERIES_ENDPOINT}/all`, fetchGetJSON);

  useEffect(() => {
    if (isEpisode && series && series.filter((s: any) => s.state === "SUBMITTED").length === 0) {
      window.location.href = "/dashboard/my-events";
    }
  }, [isEpisode, series]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const seriesId = urlParams.get("seriesId");

    if (seriesId && series) {
      setFieldValue("seriesId", seriesId);
    }
  }, [series, setFieldValue]);

  return (
    <FirstBoxContainer>
      <BoxHeading xs={12}>Your {isEpisode ? "Episode" : "Salon"}</BoxHeading>

      {isEpisode && <Grid item xs={12} style={{ marginBottom: "25px" }}>
        {series && series.length > 0 ? (
          <FormControl fullWidth>
            <StyledSeriesSelectLabel>Parent Series</StyledSeriesSelectLabel>
            <Select
              id="series-id"
              name="seriesId"
              onChange={formik.handleChange}
              value={formik.values.seriesId}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#AEA5A5"
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8060FE"
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8060FE"
                },
                "&:not(.Mui-focused):not(:hover) .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#AEA5A5"
                }
              }}
            >
              {series
                .filter((s: any) => s.state !== "DRAFT")
                .map((s: any) => (
                  <MenuItem value={s.id} key={s.id}>{s.title}</MenuItem>
                ))}
            </Select>
          </FormControl>
        ) : seriesError ? (
          <div>{seriesError.message}</div>
        ) : null}
      </Grid>}

      <Grid item xs={12} style={{ marginBottom: "15px" }}>
        <div style={{
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: "30px",
        }}> Location
        </div>
      </Grid>

      <RadioGroup
        row
        name="locationType"
        value={formik.values.locationType === LOCATION_TYPE.IRL ? "inPerson" : "online"}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFieldValue("locationType", event.target.value === "online" ? LOCATION_TYPE.VIRTUAL : LOCATION_TYPE.IRL);
          setFieldValue("location", event.target.value === "online" ? "" : formik.values.location);
        }}
        style={{ marginBottom: "30px" }}
      >
        <OnlineFormControlLabel
          value="online"
          control={<StyledRadio icon={<OnlineIcon />} checkedIcon={<OnlineIcon />} />}
          label="Online"
          labelPlacement="end"
          sx={getFormControlLabelStyles(formik.values.locationType === LOCATION_TYPE.VIRTUAL)}
        />
        <FormControlLabel
          value="inPerson"
          control={<StyledRadio icon={<InPersonIcon />} checkedIcon={<InPersonIcon />} />}
          label="In Person"
          labelPlacement="end"
          sx={getFormControlLabelStyles(formik.values.locationType === LOCATION_TYPE.IRL)}
        />
      </RadioGroup>

      {formik.values.locationType === LOCATION_TYPE.IRL && (
        <Grid item xs={12} style={{ marginBottom: "30px" }}>
          <PlaceComponent formik={formik} />
        </Grid >
      )}

      {/* FIXME: return if need to copy zoom link  */}
      {/* <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <TextField
            fullWidth
            id="zoomLink"
            label="Zoom Link"
            variant="outlined"
            name="zoomLink"
            value=""
            InputProps={{
              endAdornment: (
                <div style={{ display: "flex", alignItems: "center", paddingRight: "10px" }}>
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.9 5C1.9 3.29 3.29 1.9 5 1.9H9V0H5C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10H9V8.1H5C3.29 8.1 1.9 6.71 1.9 5ZM6 6H14V4H6V6ZM15 0H11V1.9H15C16.71 1.9 18.1 3.29 18.1 5C18.1 6.71 16.71 8.1 15 8.1H11V10H15C17.76 10 20 7.76 20 5C20 2.24 17.76 0 15 0Z" fill="#827A7A"/>
                  </svg>
                </div>
              )
            }}
          />
        </Grid>
      </Grid> */}

      <Grid item xs={12} style={salonFormHeadingStyle()}>Time</Grid>

      <Grid item xs={12} style={salonFormTextStyle()}> Your current time is {currentTime}</Grid>

      <Grid container spacing={2}>
        <Grid item xs={5}>
          <TextField
            fullWidth
            id="date"
            label="Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="normal"
            name="date"
            onChange={formik.handleChange}
            value={formik.values.date}
            error={Boolean(formik.errors.date)}
            helperText={formik.errors.date ? String(formik.errors.date) : ""}
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            fullWidth
            id="start-time"
            label="Start time"
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="normal"
            name="startTime"
            onChange={formik.handleChange}
            value={formik.values.startTime}
            error={formik.touched.startTime && Boolean(formik.errors.startTime)}
            helperText={formik.errors.startTime ? String(formik.errors.startTime) : ""}
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            fullWidth
            id="end-time"
            label="End time"
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="normal"
            name="endTime"
            onChange={formik.handleChange}
            value={formik.values.endTime}
            error={formik.touched.endTime && Boolean(formik.errors.endTime)}
            helperText={formik.errors.endTime ? String(formik.errors.endTime) : ""}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} style={{ ...salonFormHeadingStyle(), marginTop: "20px" }}>Cover Image</Grid>

      <FileUpload
        handleFileSelect={handleFileSelect}
        handleFileReset={handleFileReset}
        previewUrl={previewUrl}
      />

      <Grid item xs={12} style={{ margin: "25px 0 " }}>
        <TextField
          fullWidth
          id="title"
          label="Title"
          variant="outlined"
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title ? String(formik.touched.title && formik.errors.title) : ""}
        />
      </Grid>

      <Grid item xs={12} style={{ margin: "30px 0 50px" }}>
        {/* <ReactQuill
          theme="snow"
          id="description"
          value={formik.values.description}
          onChange={(content, delta, source, editor) => {
            formik.setFieldValue("description", editor.getHTML());
          }}
          style={{ height: "250px" }}
        /> */}
        <TextField
          fullWidth
          id="description"
          label="Event description"
          variant="outlined"
          multiline
          rows={5}
          value={formik.values.description}
          onChange={(e) => formik.setFieldValue("description", e.target.value)}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description ? String(formik.errors.description) : ""}
        />
      </Grid>
    </FirstBoxContainer >
  );
}
