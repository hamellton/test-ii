import React, { useState } from "react";
import { Typography, Alert } from "@mui/material";
import { getLocalDateFromUTC, getLocalTimeFromUTC, canPublicCheckout, getBookingFee } from "@utils/frontend-helpers";
import { initializeCartFormik, generateCartValidationSchema, submitData } from "@utils/form-creation-helpers";
import { AttendeeValues, HTTPMethod, StripeSession, frontEndAuthResponse, ExtendedSalon } from "@utils/types";
import TicketInput from "@components/SalonDetail/TicketInput/TicketInput";
import { useFormik } from "formik";
import { STRIPE_ENDPOINT } from "@config";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { 
  TicketCartDialog,
  TicketCartDialogContent,
  TicketCartCloseIcon,
  TicketCartSalonTitle,
  TicketCartSalonTitleBox,
  TicketCartForm,
  TicketCartSubmitButton,
  TicketCartButtonContainer,
  TicketCartAlertBox
} from "./TicketCart.styles";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { logTicketCartCheckout, logTicketCartMemberPurchase, logTicketCartSubmit, logTicketInputNewsletterSubscribe, logTicketInputNewsletterUnsubscribe } from "@utils/analytics-helpers";

export default function TicketCart({ salon, user, open, handleClose }: { salon: ExtendedSalon, user: frontEndAuthResponse, open: boolean, handleClose: () => void }) {
  const [initialValues, setInitialValues] = useState<AttendeeValues>(initializeCartFormik(user, salon));
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { device } = useDevice() ?? {};
  const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState(false);

  const formik = useFormik<AttendeeValues>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: generateCartValidationSchema(),
    validateOnChange: false,
    onSubmit: async (values: AttendeeValues) => {
      if (canPublicCheckout(salon, values.attendees)) {

        logTicketCartSubmit(
          salon.id,
          values.attendees.length,
          values.attendees.length * salon.publicPrice,
          values.attendees.length * salon.publicPrice + getBookingFee(values.attendees.length),
          getBookingFee(values.attendees.length),
          isSubscribedToNewsletter
        );
      
        if (isSubscribedToNewsletter) {
          logTicketInputNewsletterSubscribe();
        } else {
          logTicketInputNewsletterUnsubscribe();
        }

        const session = await submitData(`${STRIPE_ENDPOINT}/checkout`, HTTPMethod.Post, { ...values, salon: salon, user: user, isSubscribedToNewsletter: isSubscribedToNewsletter, newsletterEmail: user?.email || "" }, setIsLoading, setIsError, setErrorMessage) as StripeSession;
        if (session.url) {
          logTicketCartCheckout(session.url);
          window.location.href = session.url;
        }
      } else {
        logTicketCartMemberPurchase(salon?.slug || "");
        window.location.href = `/payment/success?memberPurchase=true&salonSlug=${salon.slug}`;
      }
    }
  });

  const handleCloseAndReset = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <TicketCartDialog open={open} onClose={handleCloseAndReset} fullScreen={fullScreen}>
      <TicketCartDialogContent>
        <TicketCartCloseIcon onClick={handleCloseAndReset} />
        <TicketCartSalonTitle>{salon.title}</TicketCartSalonTitle>
        <TicketCartSalonTitleBox>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 8.33366H1.5M12.3333 1.66699V5.00033M5.66667 1.66699V5.00033M5.5 18.3337H12.5C13.9001 18.3337 14.6002 18.3337 15.135 18.0612C15.6054 17.8215 15.9878 17.439 16.2275 16.9686C16.5 16.4339 16.5 15.7338 16.5 14.3337V7.33366C16.5 5.93353 16.5 5.23346 16.2275 4.69868C15.9878 4.22828 15.6054 3.84583 15.135 3.60614C14.6002 3.33366 13.9001 3.33366 12.5 3.33366H5.5C4.09987 3.33366 3.3998 3.33366 2.86502 3.60614C2.39462 3.84583 2.01217 4.22828 1.77248 4.69868C1.5 5.23346 1.5 5.93353 1.5 7.33366V14.3337C1.5 15.7338 1.5 16.4339 1.77248 16.9686C2.01217 17.439 2.39462 17.8215 2.86502 18.0612C3.3998 18.3337 4.09987 18.3337 5.5 18.3337Z" stroke="#605054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {salon.startTime && (
            <Typography sx={{ textTransform: "uppercase" }}>
              {getLocalDateFromUTC(salon.startTime.toString())} @ {getLocalTimeFromUTC(salon.startTime.toString())}
            </Typography>
          )}
        </TicketCartSalonTitleBox>

        <TicketCartForm onSubmit={formik.handleSubmit}>
          <TicketInput formik={formik} salon={salon} user={user} isSubscribedToNewsletter={isSubscribedToNewsletter} setIsSubscribedToNewsletter={setIsSubscribedToNewsletter} />
          {device !== DeviceTypes.MOBILE && <TicketCartButtonContainer>
            <TicketCartSubmitButton
              type="submit"
              variant="contained"
              disabled={isLoading || !canPublicCheckout(salon, formik.values.attendees)}
            >
              {isLoading ? "Checking out ..." : "Checkout now"}
            </TicketCartSubmitButton>
          </TicketCartButtonContainer>}
          <TicketCartAlertBox>
            {isError && <Alert severity="error">{JSON.stringify(errorMessage)}</Alert>}
          </TicketCartAlertBox>
        </TicketCartForm>
      </TicketCartDialogContent>
      {device === DeviceTypes.MOBILE && <TicketCartButtonContainer>
        <TicketCartSubmitButton
          type="submit"
          variant="contained"
          disabled={isLoading || !canPublicCheckout(salon, formik.values.attendees)}
        >
          {isLoading ? "Checking out ..." : "Checkout now"}
        </TicketCartSubmitButton>
      </TicketCartButtonContainer>}
    </TicketCartDialog>
  );
}
