import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { SalonFormValues, SeriesFormValues } from "@utils/types";
import { FormikProps } from "formik";
import { Tag, User } from "@prisma/client";
import { StyledChip, StyledChipLabel } from "./Autocomplete.styles";

type OptionType = Tag | User;

export default function MyAutocomplete({ fieldName, formik, label, placeholder, options }: {
  fieldName: "tags" | "coHosts"
  label: string
  placeholder: string,
  options: Array<OptionType>
  formik: FormikProps<SalonFormValues> | FormikProps<SeriesFormValues>
}) {

  //@ts-ignore
  const selectedItems = (formik.values[fieldName] as Array<OptionType>).map(item => ({
    id: item.id,
    label: "label" in item ? item.label : item.fullname || item.name || "",
    isActive: "isActive" in item ? item.isActive : true
  }));

  const handleChange = (event: React.SyntheticEvent, newValue: Array<OptionType>) => {
    formik.setFieldValue(fieldName, newValue);
  };

  const handleDelete = (itemToDelete: OptionType) => () => {
    const newValue = selectedItems?.filter((item) => item.id !== itemToDelete.id) || [];
    formik.setFieldValue(fieldName, newValue);
  };

  const getOptionLabel = (option: OptionType): string => {
    return "label" in option ? option.label : option.fullname || option.name || "";
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      id={`${fieldName}-autocomplete`}
      options={options}
      getOptionLabel={getOptionLabel}
      value={selectedItems || []} // Ensure we're handling the case where selectedItems is undefined
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderTags={(value: Array<OptionType>, getTagProps) =>
        value.map((option, index) => ( // eslint-disable-next-line
          <StyledChip
            label={<StyledChipLabel>{getOptionLabel(option)}</StyledChipLabel>}
            {...getTagProps({ index })}
            onDelete={handleDelete(option)}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={label} placeholder={placeholder} />
      )}
    />
  );
}
