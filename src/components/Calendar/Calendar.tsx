import React, { useState } from "react";
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from "@mui/lab";
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';

export const Calendar: React.FunctionComponent<{
  onChange: (val: string) => void,
  formatDate: string
}> = ({ onChange, formatDate }) => {
  const [value, setValue] = useState(new Date());

  const handleChange = (newValue: Date | null) => {
     newValue && setValue(newValue);
     onChange && onChange(format(newValue as Date, formatDate));
  };

  return <LocalizationProvider dateAdapter={DateAdapter}>
  <DesktopDatePicker
    label="Date desktop"
    inputFormat="dd.MM.yyyy"
    mask="__.__.____"
    value={value}
    onChange={handleChange}
    renderInput={(params) => <TextField {...params} />}
  /></LocalizationProvider>
}