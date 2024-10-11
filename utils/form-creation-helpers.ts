import { LOCATION_TYPE } from "@prisma/client";
import { SalonFormValues, FormattedSalonFormValues, SetIsLoadingFunction, ProfileFormValues, HTTPMethod, FormattedProfileFormValues, SeriesFormValues, FormattedSeriesFormValues, AttendeeValues, StripeSession, PublicTicketCheckoutJSONObject, MemberCheckoutJSONObject, TipCheckoutJSONObject, frontEndAuthResponse, ExtendedSalon, PublicTicketSeriesCheckoutJSONObject } from "./types";
import { SALON_TYPE, CATEGORY, Salon, Series, User } from "@prisma/client";
import * as Yup from "yup";
import { getRemainingMemberSpaces, canMemberCheckout } from "@utils/frontend-helpers";
import { showToast } from "@/store";

export const formatSalonDBToFrontEnd = (salon: Salon): SalonFormValues => ({
  // Only needed for Salon because of the different format between ui and what gets saved to db
  ...salon,
  date: (new Date(salon.startTime)).toISOString().split("T")[0],
  startTime: convertUTCToLocal(salon.startTime),
  endTime: convertUTCToLocal(salon.endTime),
  totalSpaces: salon.publicSpaces + salon.memberSpaces,
  superSalon: salon.type === SALON_TYPE.SUPER_SALON
});

const convertUTCToLocal = (utcDate: Date) => {
  const date = new Date(utcDate);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getInitialFormValues = (key: string) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : undefined;
};


export const initializeFormik = (initialValues?: SalonFormValues): SalonFormValues => ({
  title: initialValues?.title || "",
  description: initialValues?.description || "",
  date: initialValues?.date || "",
  startTime: initialValues?.startTime || "",
  endTime: initialValues?.endTime || "",
  totalSpaces: initialValues?.totalSpaces || 0,
  publicSpaces: initialValues?.publicSpaces || 0,
  publicPrice: initialValues?.publicPrice || 0,
  locationType: initialValues?.locationType || LOCATION_TYPE.VIRTUAL,
  location: initialValues?.location || "",
  locationUrl: initialValues?.locationUrl || "",
  seriesId: initialValues?.seriesId || "",
  coHosts: initialValues?.coHosts || [],
  superSalon: initialValues?.superSalon || false,
  tags: initialValues?.tags || [],
  additionalInfo: initialValues?.additionalInfo || "",
  recordEvent: initialValues?.recordEvent || false,
  specialGuests: initialValues?.specialGuests || []
});


export const generateValidationSchema = (isEpisode: boolean) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const specialGuestsSchema = Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Special Guest Name is required"),
        email: Yup.string().email("Invalid email format").required("Special Guest Email is required"),
      })
    )
    .nullable();
  
  return Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date()
      .min(today, "Date cannot be in the past")
      .required("Date is required"),
    startTime: Yup.string()
      .required("Start time is required")
      .test(
        "is-not-in-past",
        "Start time cannot be in the past",
        function (value) {
          const { date } = this.parent;
          if (!date || !value) return true;

          const selectedDate = new Date(date);
          const currentDate = new Date();

          if (selectedDate.toDateString() === currentDate.toDateString()) {
            const [hours, minutes] = value.split(":").map(Number);
            const selectedTime = new Date(selectedDate.setHours(hours, minutes));
          
            return selectedTime >= currentDate;
          }

          return true;
        }
      ),
    endTime: Yup.string()
      .required("End time is required")
      .test("is-after-start", "End time cannot be before start time", function (value) {
        const { startTime } = this.parent;
        if (!value || !startTime) return true;

        return value > startTime;
      }),
    // date: Yup.date()
    //   .min(new Date(), "Date cannot be in the past")
    //   .required("Date is required"),
    // startTime: Yup.string().required("Start time is required"),
    // endTime: Yup.string().required("End time is required"),
    totalSpaces: Yup.number().required("Total Spaces is required").min(1, "There must be at least one space"),
    publicSpaces: Yup.number().nullable(),
    publicPrice: Yup.number().required("Public price is required").min(0, "Public price cannot be negative"),
    locationType: Yup.mixed().required("Location type is required"),
    location: Yup.string().when("locationType", {
      is: (val: LOCATION_TYPE) => val === LOCATION_TYPE.IRL,
      then: (schema) => schema.required("Location is required for in-person events"),
      otherwise: (schema) => schema.nullable(),
    }),
    seriesId: isEpisode ? Yup.string().required("Series ID is required for a series") : Yup.string().nullable(),
    specialGuests: Yup.lazy((value, options) => {
      const { superSalon } = options.context;
      if (superSalon) {
        return specialGuestsSchema.test(
          "required-if-superSalon",
          "At least one special guest is required",
          (value) => !!value && value.length > 0
        );
      }
      return Yup.mixed().nullable();
    }),
  });
};



export const formatFormValues = (values: SalonFormValues, file: File | null, isDraft: boolean = false, isEpisode: boolean): FormattedSalonFormValues => ({
  title: values.title,
  description: values.description,
  type: isEpisode ? SALON_TYPE.SERIES_EPISODE : values.superSalon ? SALON_TYPE.SUPER_SALON : SALON_TYPE.SALON,
  file: file || null,
  isDraft,
  startTime: convertToUTC(values.date, values.startTime),
  endTime: convertToUTC(values.date, values.endTime),
  publicSpaces: values.publicSpaces,
  memberSpaces: values.totalSpaces - values.publicSpaces,
  publicPrice: values.publicPrice,
  category: CATEGORY.SCIENCE,
  locationType: values.locationType,
  location: values.location,
  locationUrl: values.locationUrl,
  seriesId: values.seriesId,
  coHosts: values.coHosts,
  tags: values.tags,
  additionalInfo: values.additionalInfo,
  recordEvent: values.recordEvent,
  specialGuests: values.specialGuests ?? []
});

const convertToUTC = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

export const validateForm = (dispatch: any, formattedValues: FormattedSalonFormValues, selectedFile: File | null, imageUrl: string | undefined | null): boolean => {
  if (formattedValues.locationType === LOCATION_TYPE.IRL && formattedValues.location === "") {
    dispatch(showToast({ message: "Please enter an address", success: false, }));
    return false;
  }

  if (formattedValues.startTime > formattedValues.endTime) {
    dispatch(showToast({ message: "Start time must be before end time", success: false, }));
    return false;
  }

  if (!selectedFile && !imageUrl) {
    dispatch(showToast({ message: "Please add a cover photo", success: false, }));
    return false;
  }

  return true;
};

export const submitData = async (
  url: string,
  method: HTTPMethod,
  body: FormData | PublicTicketCheckoutJSONObject | MemberCheckoutJSONObject | TipCheckoutJSONObject | PublicTicketSeriesCheckoutJSONObject,
  setIsLoading: SetIsLoadingFunction,
  setIsError: (hasError: boolean) => void,
  setErrorMessage: (message: string) => void,
): Promise<Salon | Series | User | StripeSession | undefined> => {
  setIsLoading(true);
  try {
    const response = await fetch(url, {
      method: method,
      headers: isJSONRequest(body) ? { "Content-Type": "application/json" } : {},
      body: isJSONRequest(body) ? JSON.stringify(body) : (body as BodyInit | null),
    });
    const result = await response.json();
    if (!response.ok) {
      const error = result;
      setIsError(true);
      setErrorMessage(`${response.status} - ${error}`);
    } else {
      return result;
    }
  } finally {
    setIsLoading(false);
  }
};

const isJSONRequest = (body: FormData | PublicTicketCheckoutJSONObject | MemberCheckoutJSONObject | TipCheckoutJSONObject | PublicTicketSeriesCheckoutJSONObject): boolean => {
  return !(body instanceof FormData);
};

export const convertPostObjectToFormData = (formatedValues: FormattedSalonFormValues | FormattedProfileFormValues | FormattedSeriesFormValues | AttendeeValues): FormData => {
  const formData = new FormData();

  Object.entries(formatedValues).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value instanceof File) {
      formData.append(key, value, value.name);
    } else if (Array.isArray(value) && value.every(item => item && typeof item === "object")) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined) {
      formData.append(key, value?.toString());
    }
  });

  return formData;
};

// export const convertPostObjectToFormData = (
//   formatedValues: FormattedSalonFormValues | FormattedProfileFormValues | FormattedSeriesFormValues | AttendeeValues,
//   previousImageUrl: string | null
// ): FormData => {
//   const formData = new FormData();

//   Object.entries(formatedValues).forEach(([key, value]) => {
//     if (value instanceof Date) {
//       formData.append(key, value.toISOString());
//     } else if (value instanceof File) {
//       formData.append(key, value, value.name);
//     } else if (Array.isArray(value) && value.every(item => item && typeof item === "object")) {
//       formData.append(key, JSON.stringify(value));
//     } else {
//       formData.append(key, value);
//     }
//   });

//   if ("imageUrl" in formatedValues && formatedValues.imageUrl !== previousImageUrl) {
//     formData.append("imageChanged", "true");
//   }

//   return formData;
// };

export const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, setSelectedFile: Function, setPreviewUrl: Function): void => {
  const file = event.target.files![0];
  const validTypes = ["image/jpeg", "image/png"];
  if (file && validTypes.includes(file.type)) {
    if (file.size > 3 * 1024 * 1024) {
      alert("File is too large. Please select a file smaller than 3MB.");
      return;
    }
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  } else {
    alert("Please select a valid image file (JPEG or PNG).");
    setSelectedFile(null);
    setPreviewUrl("");
  }
};

export const handleFileReset = (setSelectedFile: Function, setPreviewUrl: Function, setIsFileReset?: Function): void => {
  setIsFileReset && setIsFileReset(true);
  setSelectedFile(null);
  setPreviewUrl("");
};

/* Host Profile Creation Methods */
export const initializeProfileFormik = (initialValues?: ProfileFormValues): ProfileFormValues => ({
  name: initialValues?.name || "",
  bio: initialValues?.bio || "",
  email: initialValues?.email || "",
  quote: initialValues?.quote || "",
  webLink: initialValues?.webLink || "",
  xLink: initialValues?.xLink || "",
  instaLink: initialValues?.instaLink || "",
  substackLink: initialValues?.substackLink || ""
});

export const generateProfileValidationSchema = () => (
  Yup.object().shape({
    name: Yup.string().required("Required"),
    bio: Yup.string().required("Required"),
  })
);

export const generateProfileValidationSchemaFullForm = () => (
  Yup.object().shape({
    name: Yup.string().required("Required"),
    bio: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  })
);

export const validateProfileForm = (selectedFile: File | string | null, imageUrl: string | undefined | null): boolean => {
  if (!selectedFile && !imageUrl) {
    alert("Please add a cover photo");
    return false;
  }
  return true;
};

/* Series Creation Methods */
export const initializeSeriesFormik = (initialValues?: SeriesFormValues): SeriesFormValues => ({
  title: initialValues?.title || "",
  description: initialValues?.description || "",
  tags: initialValues?.tags || [],
  state: initialValues?.state || "",
});

export const generateSeriesValidationSchema = () => (
  Yup.object().shape({
    title: Yup.string().required("Required"),
    description: Yup.string(),
  })
);

/* Salon Cart Creation Methods */
export const initializeCartFormik = (user?: frontEndAuthResponse, salon?: ExtendedSalon): AttendeeValues => {
  if (!salon || !user || canMemberCheckout(salon, user))
    return { attendees: [] };
  if ((user.isLoggedIn === true && user.isMember === false) || (user.isMember === true && getRemainingMemberSpaces(salon) === 0))
    return { attendees: [{ name: user.name!, email: user.email! }] };
  return { attendees: [{ name: "", email: "" }] };

};

export const generateCartValidationSchema = () => (
  Yup.object().shape({
    attendees: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required")
      })
    )
  })
);
