'use client';

import React, { useEffect } from 'react';
import type { JSX } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export interface QuickLinksFormValues {
  quick_link_text: string;
  home_text: string;
  home_url: string;
  current_page_text: string;
  current_page_url: string;
  menu_text: string;
  menu_url: string;
  aboutus_text: string;
  aboutus_url: string;
  careers_text: string;
  careers_url: string;
  meet_out_team_text: string;
  meet_out_team_url: string;
  gift_card_text: string;
  gift_card_url: string;
  press_text: string;
  press_url: string;
}

interface EditQuickLinksModalProps {
  open: boolean;
  onClose: () => void;
  data: QuickLinksFormValues;
  onSave: (formData: QuickLinksFormValues) => void;
}

function EditQuickLinksModal({
  open,
  onClose,
  data,
  onSave,
}: EditQuickLinksModalProps): JSX.Element {
  const { control, handleSubmit, reset } = useForm<QuickLinksFormValues>({
    defaultValues: data,
  });

  useEffect(() => {
    if (open) reset(data);
  }, [open, data, reset]);

  const renderTextField = (
    name: keyof QuickLinksFormValues,
    label: string
  ): JSX.Element => (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
      <Box sx={{ width: { sm: 160 }, fontWeight: 500 }}>{label}</Box>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          fontWeight: 600,
          borderBottom: '1px solid #eee',
        }}
      >
        Edit Quick Links
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Section Title
        </Typography>
        {renderTextField('quick_link_text', 'Quick Links Heading')}

        <Divider flexItem />

        <Typography variant="subtitle2" fontWeight={600}>
          Link Fields
        </Typography>
        {renderTextField('home_text', 'Home Text')}
        {renderTextField('home_url', 'Home URL')}
        {renderTextField('current_page_text', 'Current Page Text')}
        {renderTextField('current_page_url', 'Current Page URL')}
        {renderTextField('menu_text', 'Menu Text')}
        {renderTextField('menu_url', 'Menu URL')}
        {renderTextField('aboutus_text', 'About Us Text')}
        {renderTextField('aboutus_url', 'About Us URL')}
        {renderTextField('careers_text', 'Careers Text')}
        {renderTextField('careers_url', 'Careers URL')}
        {renderTextField('meet_out_team_text', 'Meet Our Team Text')}
        {renderTextField('meet_out_team_url', 'Meet Our Team URL')}
        {renderTextField('gift_card_text', 'Gift Card Text')}
        {renderTextField('gift_card_url', 'Gift Card URL')}
        {renderTextField('press_text', 'Press Text')}
        {renderTextField('press_url', 'Press URL')}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#f2f2f2',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSave)}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            backgroundColor: '#000',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditQuickLinksModal;
