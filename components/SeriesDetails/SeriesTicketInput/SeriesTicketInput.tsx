import {
  NumberOfAttendeesTitle,
  TicketInputCounterContainer,
  TicketInputIconButton,
  TicketInputTextField,
  AttendeeLabel,
  TicketInputAttendeeBox,
  TicketInputOrderSummaryContainer,
  SpotForMe,
  OrderSummaryTitle,
  AttendeeInfoText,
  NewsletterCheckbox,
  OrderSummaryContainer,
} from "./SeriesTicketInput.styles";
import { Box, Typography, Divider, TextField, Checkbox } from "@mui/material";
import { FormikErrors, FormikTouched, FormikProps } from "formik";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getBookingFee } from "@utils/frontend-helpers";
import { Attendee, AttendeeValues, frontEndAuthResponse } from "@utils/types";
import { Salon } from "@prisma/client";
import React, { useState, useEffect, useCallback } from "react";
import { NEWSLETTER_SUBSCRIBE } from "@config";
import PurchaseEpisodeTable from "@components/Common/PurchaseEpisodeTable/PurchaseEpisodeTable";
import { logSeriesTicketInputEpisodeSelect } from "@utils/analytics-helpers";

interface SeriesTicketInputProps {
  formik: FormikProps<AttendeeValues>;
  salons: Salon[];
  user?: frontEndAuthResponse;
  isSubscribedToNewsletter: boolean;
  setIsSubscribedToNewsletter: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEpisodes: (selected: string[]) => void;
  selectedEpisodes: string[];
  setTotalPrice: (selected: number) => void;
  totalPrice: number;
  setDiscountAmount: (selected: number) => void;
  discountAmount: number;
  minAvailableTickets: number;
}

export default function SeriesTicketInput({ 
  formik,
  salons,
  user,
  isSubscribedToNewsletter,
  setIsSubscribedToNewsletter,
  setSelectedEpisodes,
  selectedEpisodes,
  setTotalPrice,
  totalPrice,
  setDiscountAmount,
  discountAmount,
  minAvailableTickets,
}: SeriesTicketInputProps) {
  const [isSpotForMe, setIsSpotForMe] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<boolean | string>(false);

  useEffect(() => {
    setIsSpotForMe(true);
    if (isSpotForMe) {
      formik.setFieldValue("attendees[0].name", "");
      formik.setFieldValue("attendees[0].email", "");
    }
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

  const handleSelectEpisodes = (selectedIds: string[]) => {
    setSelectedEpisodes(selectedIds);
  };

  const calculateTotalPrice = useCallback((salons: Salon[]) => {
    const ticketCount = formik.values.attendees.length;
    const total = selectedEpisodes.reduce((total, id) => {
      const salon = salons.find(salon => salon.id === id);
      return salon ? total + salon.publicPrice : total;
    }, 0);
  
    return total * ticketCount;
  }, [formik.values.attendees.length, selectedEpisodes]);

  const calculateDiscount = useCallback((selectedIds: string[]) => {
    const discountThreshold = 3;
    const discountRate = 0.2;
    const uniqueSalonCount = new Set(selectedIds).size;
    const ticketCount = formik.values.attendees.length;

    if (uniqueSalonCount >= discountThreshold) {
      const totalDiscount = selectedIds.reduce((total, id) => {
        const foundSalon = salons.find(salon => salon.id === id);
        if (foundSalon) {
          return total + foundSalon.publicPrice * discountRate;
        }
        return total;
      }, 0);
      return totalDiscount * ticketCount;
    }
    return 0;
  }, [formik.values.attendees.length, salons]);

  useEffect(() => {
    const price = calculateTotalPrice(salons);
    setTotalPrice(price);
    const discount = calculateDiscount(selectedEpisodes);
    setDiscountAmount(discount);
  }, [calculateDiscount, calculateTotalPrice, salons, selectedEpisodes, setDiscountAmount, setTotalPrice]);

  const handleSpotForMeChange = () => {
    setIsSpotForMe((prev) => !prev);
    if (!isSpotForMe) {
      formik.setFieldValue("attendees[0].name", user?.name || "");
      formik.setFieldValue("attendees[0].email", user?.email || "");
    } else {
      formik.setFieldValue("attendees[0].name", "");
      formik.setFieldValue("attendees[0].email", "");
    }
  };


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
          onClick={() => {
            formik.setFieldValue("attendees", [...formik.values.attendees, { name: "", email: "" }]);
          }}
          disabled={formik.values.attendees.length === minAvailableTickets}
        >
          <AddIcon />
        </TicketInputIconButton>
      </TicketInputCounterContainer>

      {formik.values.attendees.map((attendee, index) => (
        <React.Fragment key={index}>
          <AttendeeLabel>Attendee {index + 1}</AttendeeLabel>
          {user && user.isLoggedIn && index === 0 && <SpotForMe onClick={handleSpotForMeChange}>
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

      <PurchaseEpisodeTable salons={salons} onSelectEpisodes={handleSelectEpisodes} />

      <OrderSummaryContainer>
        <OrderSummaryTitle>
          Order Summary
        </OrderSummaryTitle>

        <TicketInputOrderSummaryContainer>
          <Typography>{formik.values.attendees.length} tickets</Typography>
          <Typography>${totalPrice}</Typography>
        </TicketInputOrderSummaryContainer>

        {discountAmount ? (
          <TicketInputOrderSummaryContainer>
            <Typography>20% discount on 3 tickets</Typography>
            <Typography>-${discountAmount.toFixed(2)}</Typography>
          </TicketInputOrderSummaryContainer>
        ) : null}

        <TicketInputOrderSummaryContainer>
          <Typography>Booking Fee:</Typography>
          <Typography>${getBookingFee(formik.values.attendees.length)}</Typography>
        </TicketInputOrderSummaryContainer>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <TicketInputOrderSummaryContainer>
          <Typography sx={{ fontWeight: "bold" }}>Total price</Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            ${(totalPrice - discountAmount + getBookingFee(formik.values.attendees.length)).toFixed(2)}
          </Typography>
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
      </OrderSummaryContainer>
    </>
  );
}
