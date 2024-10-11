import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@mui/material";
import FirstBox from "../FirstBox/FirstBox";
import SecondBox from "../SecondBox/SecondBox";
import ThirdBox from "../ThirdBox/ThirdBox";
import SubmitModal from "@components/Dashboard/Modals/SubmitModal";
import SignUpModal from "@components/Dashboard/Modals/SignUpModal";
import { formatSalonDBToFrontEnd, getInitialFormValues, initializeFormik, generateValidationSchema, formatFormValues, validateForm, handleFileSelect, handleFileReset, submitData, convertPostObjectToFormData } from "@utils/form-creation-helpers";
import { getStep, getCurrentTimeAndTimezone, getSubmitButtonText } from "@utils/frontend-helpers";
import { fetchGetJSON } from "@utils/api-helpers";
import { useRouter } from "next/router";
import { SalonFormValues, HTTPMethod, frontEndAuthResponse, SetIsLoadingFunction } from "@utils/types";
import { useFormik } from "formik";
import { Salon, Tag, User } from "@prisma/client";
import { USER_STATUS_ENDPOINT, SALON_ENDPOINT, USERS_ALL_PUBLIC_ENDPOINT, TAGS_ALL_PUBLIC_ENDPOINT, NUM_STAGES, KEY_NAME } from "@config";
import { ErrorAndButtonContainer, ErrorMessage, ActionButtonsContainer, FormContainer, MainGridContainer, ButtonWrapper, SaveDraftButton, PreviewButton } from "./SalonForm.styles";
// import HostRequest from "@components/Dashboard/Modals/HostRequest/HostRequest";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { useDispatch } from "react-redux";
import { FormikErrors } from "formik";

export const saveFileToLocalStorage = (file: File) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    localStorage.setItem("fileDataUrl", reader.result as string);
    localStorage.setItem("fileMeta", JSON.stringify({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
  };
  reader.readAsDataURL(file);
};


export default function SalonForm({ isLoading, setIsLoading, isEpisode }: { isLoading: boolean, setIsLoading: SetIsLoadingFunction, isEpisode: boolean }) {
  const [initialValues, setInitialValues] = useState<SalonFormValues>(initializeFormik(getInitialFormValues(KEY_NAME)));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [fileChanged, setFileChanged] = useState(false);
  const [isFileReset, setIsFileReset] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;

  /* Modal Props */
  let { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: salon } = useSWR<Salon>(id ? `${SALON_ENDPOINT}/${id}` : null, fetchGetJSON);
  const { data: hosts } = useSWR<User[]>(`${USERS_ALL_PUBLIC_ENDPOINT}`, fetchGetJSON);
  const { data: tags } = useSWR<Tag[]>(`${TAGS_ALL_PUBLIC_ENDPOINT}`, fetchGetJSON);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [step, setStep] = useState(0);

  const dispatch = useDispatch();

  const onCloseHandler = () => {
    setModalOpen(false);
    setStep(0);
  };

  useEffect(() => {
    const fileMeta = JSON.parse(localStorage.getItem("fileMeta") || "null");
    const fileDataUrl = localStorage.getItem("fileDataUrl");

    if (fileMeta && fileDataUrl) {
      fetch(fileDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], fileMeta.name, {
            type: fileMeta.type,
            lastModified: fileMeta.lastModified || Date.now(),
          });

          const validTypes = ["image/jpeg", "image/png"];
          if (validTypes.includes(file.type)) {
            if (file.size <= 3 * 1024 * 1024) { // 3MB
              setSelectedFile(file);
              const fileUrl = URL.createObjectURL(file);
              setPreviewUrl(fileUrl);
            } else {
              alert("File is too large. Please select a file smaller than 3MB.");
              setSelectedFile(null);
              setPreviewUrl("");
            }
          } else {
            alert("Please select a valid image file (JPEG or PNG).");
            setSelectedFile(null);
            setPreviewUrl("");
          }
        })
        .catch(error => {
          console.error("Error fetching file:", error);
          setSelectedFile(null);
          setPreviewUrl("");
        });
    }
  }, []);

  useEffect(() => {
    if (user && !user?.isLoggedIn) {
      router.push("/dashboard/salon");
      return;
    }

    if (user && !user?.isAdmin && user?.userId !== salon?.hostId) {
      router.push("/dashboard/my-events");
      return;
    }
  
    if (salon) {
      setInitialValues(formatSalonDBToFrontEnd(salon));
      if (salon.imageUrl && !isFileReset) setPreviewUrl(salon.imageUrl);
    }
  }, [salon, user, router, isFileReset]); 

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeAndTimezone());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    formik.handleSubmit();
  };

  const handlePreview = () => {
    const formattedValues = formatFormValues(formik.values, selectedFile || null, false, isEpisode);
  
    const previewData: any = {
      ...formattedValues,
      file: selectedFile ? {
        name: selectedFile.name,
        lastModified: selectedFile.lastModified,
        size: selectedFile.size,
        type: selectedFile.type,
        data: null
      } : null
    };
  
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        previewData.file!.data = base64String;
        localStorage.setItem("salonPreviewData", JSON.stringify(previewData));
        window.open("/salons/preview", "_blank");
      };
      reader.readAsDataURL(selectedFile);
    } else {
      localStorage.setItem("salonPreviewData", JSON.stringify(previewData));
      window.open("/salons/preview", "_blank");
    }
  };

  const formik = useFormik<SalonFormValues>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: generateValidationSchema(isEpisode),
    validateOnChange: false,
    onSubmit: async (values: SalonFormValues) => {
      setIsLoading(true);
      
      try {

        const formattedValues = formatFormValues(values, selectedFile!, isDraft, isEpisode);

        const isValid = validateForm(dispatch, formattedValues, selectedFile, salon?.imageUrl);
        const file = selectedFile ? selectedFile : null;

        if (file) {
          saveFileToLocalStorage(file);
        }

        if (fileChanged) {
          formattedValues.fileChanged = true;
        }

        localStorage.setItem(KEY_NAME, JSON.stringify({...values, file: selectedFile ? selectedFile : null}));

        user = await mutate(USER_STATUS_ENDPOINT);
        console.log("Submit Object:", formattedValues);
        if (!user) return;
        if (isValid) {
          if (!user.isLoggedIn)
            setSignUpModalOpen(true);
          else {
            if (user?.hostStatus) setStep(getStep(user?.hostStatus));
            setModalOpen(step < NUM_STAGES);
          }
        }

        if (isValid && user.hostStatus == "prof_completed") {
          const salon = id ?
          await submitData(`${SALON_ENDPOINT}/formdata/${id}`, HTTPMethod.Patch, convertPostObjectToFormData(formattedValues), setIsLoading, setIsError, setErrorMessage) as Salon :
          await submitData(`${SALON_ENDPOINT}/formdata/new`, HTTPMethod.Post, convertPostObjectToFormData(formattedValues), setIsLoading, setIsError, setErrorMessage) as Salon;
          if (salon) {
            setIsLoading(true);
            // router.push(`/dashboard/success?id=${salon.id}`);
            window.location.href = `/dashboard/success?id=${salon.id}`;
            localStorage.removeItem("salonData");
            localStorage.removeItem("fileMeta");
            localStorage.removeItem("fileDataUrl");
          }
        }
      } catch (error) {
        console.error("Submission error:", error);
        setIsError(true);
        setErrorMessage("An error occurred while submitting the form. Please try again.");
        setIsLoading(false);
      } finally {
        setIsLoading(false); 
      }
    },
  });

  const scrollToFirstError = (errors: FormikErrors<SalonFormValues>) => {
    const errorField = Object.keys(errors)[0];
    if (errorField) {
      const errorElement = document.getElementById(errorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  };

  useEffect(() => {
    if (formik.isSubmitting && Object.keys(formik.errors).length > 0) {
      scrollToFirstError(formik.errors);
    }
  }, [formik.isSubmitting, formik.errors]);

  return (
    <>
      <LoadingModal isLoading={isLoading} />
      <SignUpModal open={isSignUpModalOpen} />
      <SubmitModal
        open={isModalOpen}
        numSteps={NUM_STAGES}
        onClose={() => onCloseHandler()}
        onNextClick={() => setStep(prevStep => prevStep + 1)}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        step={step}
        userId={user?.userId}
      />
      {/* <HostRequest user={user} /> */}

      <FormContainer onSubmit={formik.handleSubmit}>
        <MainGridContainer container>
          <FirstBox
            formik={formik}
            setFieldValue={formik.setFieldValue}
            handleFileSelect={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFileChanged(true);
              handleFileSelect(e, setSelectedFile, setPreviewUrl);
            }}
            handleFileReset={() => handleFileReset(setSelectedFile, setPreviewUrl, setIsFileReset)}
            previewUrl={previewUrl}
            isEpisode={isEpisode}
            currentTime={currentTime}
          />
          <SecondBox formik={formik} />
          {hosts && tags && <ThirdBox
            hosts={hosts}
            tags={tags}
            formik={formik}
            isEpisode={isEpisode}
          />}
          <ErrorAndButtonContainer>
            {isError && <ErrorMessage severity="error">{JSON.stringify(errorMessage)}</ErrorMessage>}
          
            <ActionButtonsContainer container>
              <ButtonWrapper item>
                <SaveDraftButton
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading}
                >
                Save as Draft
                </SaveDraftButton>
                <PreviewButton
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handlePreview}
                  disabled={isLoading}
                >
                  Preview page
                </PreviewButton>
              </ButtonWrapper>
              <ButtonWrapper item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {getSubmitButtonText("Salon", id ? true : false, isLoading, isEpisode, Boolean(initialValues.state === "DRAFT"), "create")}
                </Button>
              </ButtonWrapper>
            </ActionButtonsContainer>
          </ErrorAndButtonContainer>
        </MainGridContainer>
      </FormContainer>
    </>
  );
}
