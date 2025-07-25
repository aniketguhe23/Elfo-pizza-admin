'use client';

import React, { useState } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarToday } from '@mui/icons-material';

export default function CustomDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', maxWidth: 300 }}>
        <DatePicker
          open={open}
          onClose={() => setOpen(false)}
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          slots={{
            textField: (props) => (
              <TextField
                {...props}
                fullWidth
                label="Select date"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9',
                  },
                }}
                InputProps={{
                  ...props.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setOpen(true)}>
                        <CalendarToday />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
