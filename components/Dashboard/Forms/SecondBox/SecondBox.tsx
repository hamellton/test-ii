import { Grid } from "@mui/material";
import Select from "@components/Dashboard/Forms/CustomInputs/Select";
import Slider from "@mui/material/Slider";
import { FormikProps } from "formik";
import { SalonFormValues } from "@utils/types";
import { salonFormHeadingStyle, salonFormTextStyle } from "@utils/style-helpers";
import { useEffect } from "react";
import { BoxHeading, EarningsText, HighlightedText, InfoText, InfoWrapper, PublicTicketsDescription, SecondBoxContainer, SliderWrapper, StyledSlider } from "./SecondBox.styles";

export default function SecondBox({ formik }: { formik: FormikProps<SalonFormValues> }) {

  const handleSliderChange = (event: Event, value: number | number[]) => {
    formik.setFieldValue("publicSpaces", value);
  };

  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    formik.setFieldValue(name as string, value);

    if (name === "totalSpaces") {
      if (formik.values.publicSpaces > (value as number)) {
        formik.setFieldValue("publicSpaces", value as number);
      }
    }
  };

  useEffect(() => {
    const newMaxPublicSpaces = Math.floor(formik.values.totalSpaces / 2);

    // Ensure the slider max value and publicSpaces are adjusted if needed
    if (formik.values.publicSpaces > newMaxPublicSpaces) {
      formik.setFieldValue("publicSpaces", newMaxPublicSpaces);
    }
  }, [formik]);

  return (
    <SecondBoxContainer>
      <BoxHeading xs={12}>Create Your Audience</BoxHeading>

      <Grid container spacing={2} style={{ marginTop: "15px", marginBottom: "30px" }}>
        <Grid item xs={6}>
          <Select
            max={51} //Has to be one higher than the number you want
            offset={5}
            id="publicPrice"
            labelId="publicPrice"
            label="Ticket Price USD"
            name="publicPrice"
            extraSymbol={"$"}
            formik={{ ...formik, handleChange: handleSelectChange }}
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            max={51} //Has to be one higher than the number you want
            offset={5}
            id="totalSpaces"
            labelId="totalSpaces"
            label="Available Spaces"
            name="totalSpaces"
            formik={{ ...formik, handleChange: handleSelectChange }}
          />
        </Grid>
      </Grid>

      {formik.values.totalSpaces > 0 && formik.values.publicPrice > 0 && (
        <>

          <Grid item xs={12} style={salonFormHeadingStyle()}>Public tickets</Grid>

          <PublicTicketsDescription item xs={12}>
            As you progress as a host you will be able to unlock badges that will allow you to increase the percentage of tickets that are open to the public. Interintellect Members enter for free.
          </PublicTicketsDescription>

          <SliderWrapper item xs={12}>
            {/* <Slider
              name="publicSpaces"
              id="publicSpaces"
              value={formik.values.publicSpaces}
              onChange={handleSliderChange}
              valueLabelDisplay="on" // This prop enables the value label
              aria-labelledby="continuous-slider"
              min={0}
              max={formik.values.totalSpaces}
              marks={Array.from({ length: Math.floor(formik.values.totalSpaces / 2) + 2 }, (_, index) => ({ value: index - 1 }))}
              step={null}
              sx={{
                width: "400px",
                "& .MuiSlider-thumb": {
                  bgcolor: "#8060FE", // Thumb color
                },
                "& .MuiSlider-track": {
                  bgcolor: "#8060FE", // Track color
                  borderColor: "#8060FE",
                }
              }}
            /> */}
            <StyledSlider
              name="publicSpaces"
              id="publicSpaces"
              value={formik.values.publicSpaces}
              onChange={handleSliderChange}
              valueLabelDisplay="on" // This prop enables the value label
              aria-labelledby="continuous-slider"
              min={0}
              max={formik.values.totalSpaces}
              marks={Array.from({ length: Math.floor(formik.values.totalSpaces / 2) + 2 }, (_, index) => ({ value: index - 1 }))}
              step={null}
            />
          </SliderWrapper>
          <InfoWrapper item xs={12}>
            <InfoText>Member spaces: {formik.values.totalSpaces - formik.values.publicSpaces}</InfoText>
            <InfoText>Public tickets: {formik.values.publicSpaces}</InfoText>
            <EarningsText>
              Maximum Earning: <HighlightedText>${formik.values.publicSpaces * formik.values.publicPrice}</HighlightedText>
            </EarningsText>
          </InfoWrapper>
        </>
      )}
    </SecondBoxContainer>
  );
}
