import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import "./style.scss";

const SelectWithPlaceholder = ({
  value,
  onChange,
  placeholder,
  options,
  questionNumber,
  questionTitle,
  error,
}) => {
  const maxHeight = options.length > 5 ? "400px" : "unset";

  return (
    <Box sx={{ maxWidth: 170, marginTop: '5px'  }}>
      <FormControl fullWidth className={`form-control${error ? " error" : ""}`}>
        <InputLabel
          id={`select-placeholder-label-${questionNumber}`}
          sx={{
            fontSize: "12px",
            "@media (max-width: 764px)": {
              fontSize: "13px",
            },
          }}
        >
          {placeholder}
        </InputLabel>
        <Select
          labelId={`select-placeholder-label-${questionNumber}`}
          id={`select-placeholder-${questionNumber}`}
          name={questionTitle}
          value={value}
          label={placeholder}
          onChange={(event) => onChange(event, questionNumber, questionTitle)}
          error={error}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
            PaperProps: {
              sx: {
                maxHeight: maxHeight,
                width: "200px",
                overflowY: "auto",
              },
            },
          }}
          sx={{
            "@media (max-width: 764px)": {
              width: "200px",
            },
          }}
        >
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>Error</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default SelectWithPlaceholder;
