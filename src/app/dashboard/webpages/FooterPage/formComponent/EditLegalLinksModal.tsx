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

export interface LegalLinksFormValues {
  legal_title_text: string;
  terms_text: string;
  terms_url: string;
  cookie_text: string;
  cookie_url: string;
  privacy_text: string;
  privacy_url: string;
  accessibility_text: string;
  accessibility_url: string;
  applicant_text: string;
  applicant_url: string;
  mp_text: string;
  mp_url: string;
  supply_text: string;
  supply_url: string;
  fssai_text: string;
  fssai_url: string;
}

interface EditLegalLinksModalProps {
  open: boolean;
  onClose: () => void;
  data: LegalLinksFormValues;
  onSave: (formData: LegalLinksFormValues) => void;
}

function EditLegalLinksModal({
  open,
  onClose,
  data,
  onSave,
}: EditLegalLinksModalProps): JSX.Element {
  const { control, handleSubmit, reset } = useForm<LegalLinksFormValues>({
    defaultValues: data,
  });

  useEffect(() => {
    if (open) reset(data);
  }, [open, data, reset]);

  const renderTextField = (
    name: keyof LegalLinksFormValues,
    label: string,
    disabled: boolean = false
  ): JSX.Element => (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
      <Box sx={{ width: { sm: 160 }, fontWeight: 500 }}>{label}</Box>
      <Controller
        name={name}
        control={control}
        rules={!disabled ? { required: `${label} is required` } : undefined}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            disabled={disabled}
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
        Edit Legal Links
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Section Heading
        </Typography>
        {renderTextField('legal_title_text', 'Legal Section Title')}

        <Divider flexItem />

        <Typography variant="subtitle2" fontWeight={600}>
          Legal Links
        </Typography>
        {renderTextField('terms_text', 'Terms & Conditions Text')}
        {renderTextField('terms_url', 'Terms URL', true)}

        {renderTextField('cookie_text', 'Cookie Policy Text')}
        {renderTextField('cookie_url', 'Cookie URL', true)}

        {renderTextField('privacy_text', 'Privacy Policy Text')}
        {renderTextField('privacy_url', 'Privacy URL', true)}

        {renderTextField('accessibility_text', 'Accessibility Info Text')}
        {renderTextField('accessibility_url', 'Accessibility URL', true)}

        {renderTextField('applicant_text', 'Job Applicant Text')}
        {renderTextField('applicant_url', 'Job Applicant URL')}

        {renderTextField('mp_text', 'MP Info Text')}
        {renderTextField('mp_url', 'MP Info URL')}

        {renderTextField('supply_text', 'Supply Chain Policy Text')}
        {renderTextField('supply_url', 'Supply Chain URL', true)}

        {renderTextField('fssai_text', 'FSSAI Details Text')}
        {renderTextField('fssai_url', 'FSSAI URL', true)}
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

export default EditLegalLinksModal;
