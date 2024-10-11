import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useFormik } from "formik";
import { Series, Tag } from "@prisma/client";
import { initializeSeriesFormik, generateSeriesValidationSchema, validateProfileForm, submitData, convertPostObjectToFormData, handleFileSelect, handleFileReset } from "@utils/form-creation-helpers";
import { getSubmitButtonText } from "@utils/frontend-helpers";
import { SeriesFormValues, SetIsLoadingFunction, HTTPMethod, ExtendedSalon } from "@utils/types";
import { fetchGetJSON } from "@utils/api-helpers";
import { SERIES_ENDPOINT, TAGS_ALL_PUBLIC_ENDPOINT } from "@config";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import FileUpload from "../CustomInputs/FileUpload";
import MyAutocomplete from "../CustomInputs/Autocomplete/Autocomplete";
import {
  DescriptionContainer,
  FormContainer,
  GridContainer,
  SalonBox,
  SalonBoxHeading,
  TitleContainer
} from "./SeriesForm.styles";
import { TextField, Button, Grid } from "@mui/material";
import { ActionButtonsContainer, ButtonWrapper, ErrorAndButtonContainer, ErrorMessage, PreviewButton, SaveDraftButton } from "../SalonForm/SalonForm.styles";
import EpisodeTable from "@components/Tables/EpisodeTable/EpisodeTable";
import { showToast } from "@/store";
import { useDispatch } from "react-redux";

export default function SeriesForm({ isLoading, setIsLoading, salons }: { isLoading: boolean, setIsLoading: SetIsLoadingFunction, salons: ExtendedSalon[] | undefined }) {
  const [initialValues, setInitialValues] = useState<SeriesFormValues>(initializeSeriesFormik());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDraft, setIsDraft] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  const { data: series } = useSWR<Series>(id ? `${SERIES_ENDPOINT}/${id}` : null, fetchGetJSON);
  const { data: tags } = useSWR<Tag[]>(`${TAGS_ALL_PUBLIC_ENDPOINT}`, fetchGetJSON);

  useEffect(() => {
    if (series) {
      setInitialValues(initializeSeriesFormik(series));
      if (series.imageUrl) setPreviewUrl(series.imageUrl);
    }
  }, [series]);

  const handlePreview = () => {
    const formattedValues = formik.values;

    const previewData: any = {
      ...formattedValues,
      slug: series ? series.slug : null,
      file: selectedFile ? {
        name: selectedFile.name,
        lastModified: selectedFile.lastModified,
        size: selectedFile.size,
        type: selectedFile.type,
        data: null
      } : series?.imageUrl ? series?.imageUrl : null
    };
  
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        previewData.file!.data = base64String;
        localStorage.setItem("seriesPreviewData", JSON.stringify(previewData));
        window.open("/series/preview", "_blank");
      };
      reader.readAsDataURL(selectedFile);
    } else {
      localStorage.setItem("seriesPreviewData", JSON.stringify(previewData));
      if (id) {
        window.open(`/series/preview?id=${series?.slug}`, "_blank");
      } else {
        window.open("/series/preview", "_blank");
      }
    }
  };

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    formik.handleSubmit();
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: generateSeriesValidationSchema(),
    onSubmit: async (values: SeriesFormValues) => {
      console.log("Values: ", values);
      const formattedValues = { ...values, isDraft: isDraft, file: selectedFile! };
      console.log("Submit Object:", formattedValues);

      const isValid = validateProfileForm(selectedFile, series?.imageUrl);
      if (isValid) {
        const series = id ?
          await submitData(`${SERIES_ENDPOINT}/formdata/${id}`, HTTPMethod.Patch, convertPostObjectToFormData(formattedValues), setIsLoading, setIsError, setErrorMessage) as Series :
          await submitData(`${SERIES_ENDPOINT}/formdata/new`, HTTPMethod.Post, convertPostObjectToFormData(formattedValues), setIsLoading, setIsError, setErrorMessage) as Series;
        if (series) {
          // router.push(`/series/${series.slug}`);
          if (id) {
            router.push(`/series/${series.slug}`);
          }
          router.push(`/dashboard/series?id=${series.id}`);
        }
      }
    }
  });

  return (
    <FormContainer onSubmit={formik.handleSubmit}>
      <GridContainer container>
        <SalonBox isFirstBox={true}>
          <SalonBoxHeading item xs={12}>Your Series</SalonBoxHeading>

          <TitleContainer item xs={12}>
            <TextField
              fullWidth
              id="title"
              label="Title"
              variant="outlined"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              error={formik.touched.title && Boolean(formik.errors.title)}
            />
          </TitleContainer>

          <FileUpload
            handleFileSelect={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, setSelectedFile, setPreviewUrl)}
            handleFileReset={() => handleFileReset(setSelectedFile, setPreviewUrl)}
            previewUrl={previewUrl}
          />

          <DescriptionContainer item xs={12}>
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
          </DescriptionContainer>

          {tags && <Grid item xs={12} style={{ margin: "25px 0 " }}>
            <MyAutocomplete
              fieldName="tags"
              formik={formik}
              label="Series Tags"
              placeholder="Select tags"
              options={tags} />
          </Grid>}
        </SalonBox >
        {salons && <EpisodeTable salons={salons} setIsLoading={setIsLoading} series={series} />}
        <ErrorAndButtonContainer>
          {isError && <ErrorMessage severity="error">{JSON.stringify(errorMessage)}</ErrorMessage>}
          
          <ActionButtonsContainer container>
            <ButtonWrapper item>
              <SaveDraftButton
                type="button"
                variant="outlined"
                color="secondary"
                onClick={salons && salons.length > 0 ? () => {
                  dispatch(showToast({ message: "You cannot move the series to draft status because there are already created episodes in this series.", autoHide: false, }));
                } : handleSaveAsDraft}
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
                {getSubmitButtonText("Series", id ? true : false, isLoading, false, Boolean(initialValues.state === "DRAFT"), "create")}
              </Button>
            </ButtonWrapper>
          </ActionButtonsContainer>
        </ErrorAndButtonContainer>
      </GridContainer>
    </FormContainer>
  );
}
