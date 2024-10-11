import {
  NumberOfAttendeesTitle,
  TicketInputCounterContainer,
  TicketInputAttendeeBox,
  TicketInputIconButton,
  TicketInputTextField,
  TicketInputOrderSummaryContainer,
  AttendeeLabel,
  SpotForMe,
  OrderSummaryTitle,
  AttendeeInfoText,
  NewsletterCheckbox,
  OrderSummaryContainer,
} from "./TicketInput.styles";
import { Box, Typography, Divider, TextField, Checkbox } from "@mui/material";
import { FormikErrors, FormikTouched, FormikProps } from "formik";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getBookingFee } from "@utils/frontend-helpers";
import { Attendee, AttendeeValues, frontEndAuthResponse } from "@utils/types";
import { Salon } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { NEWSLETTER_SUBSCRIBE } from "@config";

export default function TicketInput({ formik, salon, user, isSubscribedToNewsletter, setIsSubscribedToNewsletter }: { formik: FormikProps<AttendeeValues>, salon: Salon, user?: frontEndAuthResponse, isSubscribedToNewsletter: boolean, setIsSubscribedToNewsletter: any }) {
  const [isSpotForMe, setIsSpotForMe] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<boolean | string>(false);

  useEffect(() => {
    formik.setFieldValue("attendees[0].name", "");
    formik.setFieldValue("attendees[0].email", "");

  }, []);

  useEffect(() => {
    if (isSpotForMe && user && user.isLoggedIn) {
      formik.setFieldValue("attendees[0].name", user.name);
      formik.setFieldValue("attendees[0].email", user.email);
  
      if (Array.isArray(formik.errors.attendees)) {
        formik.setErrors({
          ...formik.errors,
          attendees: formik.errors.attendees.map((err: FormikErrors<Attendee>, index: number) => {
            if (index === 0) {
              return { ...err, name: undefined, email: undefined };
            }
            return err;
          }),
        });
      }
    }
  }, [formik, isSpotForMe, user]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      
      if (!user || !user.email) return;

      try {
        const response = await fetch(`${NEWSLETTER_SUBSCRIBE}?email=${user.email}`);
        const data = await response.json();
        setSubscribeStatus(data.status === "subscribed" ? true : data.status === "not_found" ? true : false);
      } catch (error) {
        console.error("Error checking subscription status", error);
      }
    };

    if (user && user.email) {
      checkSubscriptionStatus();
    }
  }, [user]);

  useEffect(() => {
    if (subscribeStatus !== false) {
      setIsSubscribedToNewsletter(subscribeStatus as boolean);
    }
  }, [subscribeStatus, setIsSubscribedToNewsletter]);

  return (
    <>
      <NumberOfAttendeesTitle>Number of attendees</NumberOfAttendeesTitle>
      <TicketInputCounterContainer>
        <TicketInputIconButton
          onClick={() => {
            if (isSpotForMe && formik.values.attendees.length === 1) {
              setIsSpotForMe(false);
              formik.setFieldValue("attendees[0].name", "");
              formik.setFieldValue("attendees[0].email", "");
              formik.setFieldValue("attendees", formik.values.attendees.slice(0, -1));
            }

            formik.setFieldValue("attendees", formik.values.attendees.slice(0, -1));
          }}
          disabled={formik.values.attendees.length <= 0}
        >
          <RemoveIcon />
        </TicketInputIconButton>

        <TicketInputTextField
          id="attendee-count"
          value={formik.values.attendees.length}
          margin="normal"
          inputProps={{ readOnly: true }}
        />

        <TicketInputIconButton
          onClick={() => formik.setFieldValue("attendees", [...formik.values.attendees, { name: "", email: "" }])}
          disabled={formik.values.attendees.length >= salon.publicSpaces}
        >
          <AddIcon />
        </TicketInputIconButton>
      </TicketInputCounterContainer>

      {formik.values.attendees.map((attendee, index) => (
        <React.Fragment key={index}>
          <AttendeeLabel>Attendee {index + 1}</AttendeeLabel>
          {user && user.isLoggedIn && index === 0 && <SpotForMe onClick={() => {
            setIsSpotForMe(!isSpotForMe);
            if (isSpotForMe) {
              formik.setFieldValue("attendees[0].name", "");
              formik.setFieldValue("attendees[0].email", "");
            }
          }}>
            <Checkbox
              checked={isSpotForMe}
              color="primary"
              size="medium"
            />
            <div>This spot is for me</div>
          </SpotForMe>}
          <TicketInputAttendeeBox>
            <TextField
              name={`attendees[${index}].name`}
              value={attendee.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Full name"
              error={Boolean(
                formik.touched.attendees && (formik.touched.attendees[index] as FormikTouched<Attendee>)?.name &&
              formik.errors.attendees && (formik.errors.attendees[index] as FormikErrors<Attendee>)?.name
              )}
              helperText={
                formik.touched.attendees && (formik.touched.attendees[index] as FormikTouched<Attendee>)?.name &&
              formik.errors.attendees && (formik.errors.attendees[index] as FormikErrors<Attendee>)?.name
              }
              fullWidth
              disabled={index === 0 && isSpotForMe}
              InputProps={index === 0 && isSpotForMe ? {
                style: {
                  pointerEvents: "none"
                },
              } : {}}
            />
            <TextField
              name={`attendees[${index}].email`}
              value={attendee.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Email"
              error={Boolean(
                formik.touched.attendees && (formik.touched.attendees[index] as FormikTouched<Attendee>)?.email &&
              formik.errors.attendees && (formik.errors.attendees[index] as FormikErrors<Attendee>)?.email
              )}
              fullWidth
              disabled={index === 0 && isSpotForMe}
              InputProps={index === 0 && isSpotForMe ? {
                style: {
                  pointerEvents: "none"
                },
              } : {}}
            />
          </TicketInputAttendeeBox>
        </React.Fragment>
      ))}

      <OrderSummaryContainer>
        <OrderSummaryTitle>
        Order Summary
        </OrderSummaryTitle>

        <TicketInputOrderSummaryContainer>
          <Typography>{formik.values.attendees.length} tickets x ${salon.publicPrice}</Typography>
          <Typography>${formik.values.attendees.length * salon.publicPrice}</Typography>
        </TicketInputOrderSummaryContainer>

        <TicketInputOrderSummaryContainer>
          <Typography>Booking Fee:</Typography>
          <Typography>${getBookingFee(formik.values.attendees.length)}</Typography>
        </TicketInputOrderSummaryContainer>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <TicketInputOrderSummaryContainer>
          <Typography sx={{ fontWeight: "bold" }}>Total price</Typography>
          <Typography sx={{ fontWeight: "bold" }}>${formik.values.attendees.length * salon.publicPrice + getBookingFee(formik.values.attendees.length)}</Typography>
        </TicketInputOrderSummaryContainer>

        <NewsletterCheckbox onClick={() => setIsSubscribedToNewsletter(!isSubscribedToNewsletter)}>
          <Checkbox
            checked={isSubscribedToNewsletter}
            color="primary"
            size="medium"
          />
          <div>Subscribe to our weekly newsletter</div>
        </NewsletterCheckbox>

        <AttendeeInfoText>
        Each attendee specified will receive an email with their individual ticket included.
        </AttendeeInfoText>

        {user && user.planName && process.env.NEXT_PUBLIC_DISCOUNT_PLAN_NAME!.split(",").map(name => name.trim()).includes(user.planName) && (
          <Typography sx={{ mt: 4 }}>
          Your final checkout will include a 30% discount, making your total: ${formik.values.attendees.length * salon.publicPrice * 0.7 + getBookingFee(formik.values.attendees.length)}
          </Typography>
        )}
      </OrderSummaryContainer>
    </>
  );
}
