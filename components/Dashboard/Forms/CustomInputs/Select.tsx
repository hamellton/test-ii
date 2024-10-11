import { FormControl, InputLabel, MenuItem, Select, InputAdornment, FormHelperText } from "@mui/material";
import { FormikProps } from "formik";
import { SalonFormValues } from "@utils/types";

export default function MySelect({ max, offset, id, label, labelId, name, formik, extraSymbol }: {
  max: number;
  offset: number;
  id: string;
  label: string;
  labelId: string;
  name: keyof SalonFormValues;
  formik: FormikProps<SalonFormValues>;
  extraSymbol?: any;
}) {
  const hasError = formik.touched[name] && Boolean(formik.errors[name]);

  const values = Array.from({ length: Math.ceil(max / offset) }, (_, i) => i * offset);

  return (
    <FormControl fullWidth>
      <InputLabel
        sx={{
          color: hasError ? "#ff1744" : undefined,
          "&.Mui-focused": {
            color: hasError ? "#ff1744" : undefined
          }
        }}
        id={labelId}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={formik.values[name]}
        inputProps={{
          endAdornment: extraSymbol ? <InputAdornment position="end">{extraSymbol}</InputAdornment> : null,
        }}
        label={label}
        onChange={formik.handleChange}
        name={name}
        error={hasError}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: hasError ? "#ff1744" : "#AEA5A5"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: hasError ? "#ff1744" : "#8060FE"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8060FE"
          },
          "&:not(.Mui-focused):not(:hover) .MuiOutlinedInput-notchedOutline": {
            borderColor: "#AEA5A5"
          }
        }}
      >
        {values.map((value) => (
          <MenuItem key={value} value={value}>
            {extraSymbol ? `${extraSymbol}${value}` : value}
          </MenuItem>
        ))}
      </Select>
      {formik.touched[name] && formik.errors[name] && (
        <FormHelperText sx={{ color: "#ff1744" }}>
          {typeof formik.errors[name] === "string" ? formik.errors[name] : 
            Array.isArray(formik.errors[name]) ? formik.errors[name].join(", ") :
              JSON.stringify(formik.errors[name])}
        </FormHelperText>
      )}

    </FormControl>
  );
}
