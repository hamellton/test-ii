import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { getBookingFee } from "@utils/frontend-helpers";
import { generateCartValidationSchema, submitData } from "@utils/form-creation-helpers";
import { AttendeeValues, HTTPMethod, StripeSession, frontEndAuthResponse, ExtendedSalon } from "@utils/types";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { 
  TicketCartDialog,
  TicketCartDialogContent,
  TicketCartSalonTitle,
  TicketCartForm,
  TicketCartSubmitButton,
  TicketCartButtonContainer,
  TicketCartAlertBox,
  TicketCartCloseSection
} from "./SeriesTicketCart.styles";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { STRIPE_ENDPOINT } from "@config";
import SeriesTicketInput from "../SeriesTicketInput/SeriesTicketInput";
import { Series } from "@prisma/client";
import { useDispatch } from "react-redux";
import { showToast } from "@/store";
import { logSeriesTicketCartClose, logSeriesTicketCartOpen, logSeriesTicketCartSubmit, logSeriesTicketInputNewsletterSubscribe, logSeriesTicketInputNewsletterUnsubscribe } from "@utils/analytics-helpers";

export default function SeriesTicketCart({ minAvailableTickets, series, salons, user, open, handleClose }: { minAvailableTickets: number, series: Series, salons: ExtendedSalon[], user: frontEndAuthResponse, open: boolean, handleClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const dispatch = useDispatch();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { device } = useDevice() ?? {};
  const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState(false);

  const formik = useFormik<AttendeeValues>({
    initialValues: {
      attendees: []
    },
    validationSchema: generateCartValidationSchema(),
    validateOnChange: false,
    onSubmit: async (values: AttendeeValues) => {
      if (selectedEpisodes.length > 0) {
        logSeriesTicketCartSubmit(
          series.id,
          values.attendees.length,
          totalPrice - discountAmount + getBookingFee(formik.values.attendees.length),
          totalPrice,
          discountAmount,
          selectedEpisodes.length,
          isSubscribedToNewsletter
        );

        if (isSubscribedToNewsletter) {
          logSeriesTicketInputNewsletterSubscribe();
        } else {
          logSeriesTicketInputNewsletterUnsubscribe();
        }
        
        const session = await submitData(`${STRIPE_ENDPOINT}/checkout?series=true`,
          HTTPMethod.Post,
          {
            ...values,
            bookingFee: getBookingFee(values.attendees.length),
            selectedEpisodes: selectedEpisodes,
            hostId: series?.hostId,
            isSubscribedToNewsletter: isSubscribedToNewsletter,
            newsletterEmail: user?.email || "",
            slug: series.slug || "",
            seriesTitle: series.title || "",
          }, 
          setIsLoading,
          setIsError,
          setErrorMessage) as StripeSession;
        if (session && session.url) {
          window.location.href = session.url;
        }
      } else {
        dispatch(showToast({ message: "Please select at least one episode before proceeding to checkout." }));
        return;
      }
    }
  });

  useEffect(() => {
    if (open) {
      logSeriesTicketCartOpen(series.id);
    }
  }, [open, series.id]);

  const handleCloseAndReset = () => {
    logSeriesTicketCartClose(series.id);
    formik.resetForm();
    handleClose();
  };

  return (
    <TicketCartDialog open={open} onClose={handleCloseAndReset} fullScreen={fullScreen}>
      <TicketCartDialogContent>
        <TicketCartCloseSection onClick={handleCloseAndReset}>
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.84297 1.175L5.66797 0L0.667969 5L5.66797 10L6.84297 8.825L3.0263 5L6.84297 1.175Z" fill="#FC714E"/>
          </svg>
          <span>Back to details</span>
        </TicketCartCloseSection>
        
        {series && series.title && <TicketCartSalonTitle>{series.title}</TicketCartSalonTitle>}
        <TicketCartForm onSubmit={formik.handleSubmit}>
          <SeriesTicketInput
            minAvailableTickets={minAvailableTickets}
            salons={salons}
            formik={formik}
            user={user}
            isSubscribedToNewsletter={isSubscribedToNewsletter}
            setIsSubscribedToNewsletter={setIsSubscribedToNewsletter}
            setSelectedEpisodes={setSelectedEpisodes}
            selectedEpisodes={selectedEpisodes}
            setTotalPrice={setTotalPrice}
            totalPrice={totalPrice}
            setDiscountAmount={setDiscountAmount}
            discountAmount={discountAmount}
          />
          {device !== DeviceTypes.MOBILE && (
            <TicketCartButtonContainer>
              <TicketCartSubmitButton
                type="submit"
                variant="contained"
                disabled={isLoading || !formik.values.attendees || formik.values.attendees.length === 0}
              >
                {isLoading ? "Checking out ..." : "Checkout now"}
              </TicketCartSubmitButton>
            </TicketCartButtonContainer>
          )}
          <TicketCartAlertBox>
            {isError && <Alert severity="error">{JSON.stringify(errorMessage)}</Alert>}
          </TicketCartAlertBox>
        </TicketCartForm>
      </TicketCartDialogContent>
      {device === DeviceTypes.MOBILE && <TicketCartButtonContainer>
        <TicketCartSubmitButton
          variant="contained"
          disabled={isLoading || !formik.values.attendees || formik.values.attendees.length === 0}
          onClick={() => formik.submitForm()}
        >
          {isLoading ? "Checking out ..." : "Checkout now"}
        </TicketCartSubmitButton>
      </TicketCartButtonContainer>}
    </TicketCartDialog>
  );
}
