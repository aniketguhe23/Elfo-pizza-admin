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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export interface FooterFormValues {
  footer_logo: File | null;
  footer_title_1: string;
  address_title: string;
  address: string;
  contact_title: string;
  contact_no: string;
  email: string;
  company_name: string;
  company_title: string;
}

interface EditFooterCardModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    footer_logo: string;
    footer_title_1: string;
    address_title: string;
    address: string;
    contact_title: string;
    contact_no: string;
    email: string;
    company_name: string;
    company_title: string;
  };
  onSave: (formData: FooterFormValues) => void;
}

function EditFooterCardModal({
  open,
  onClose,
  data,
  onSave,
}: EditFooterCardModalProps): JSX.Element {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<FooterFormValues>({
    defaultValues: {
      footer_logo: null,
      footer_title_1: '',
      address_title: '',
      address: '',
      contact_title: '',
      contact_no: '',
      email: '',
      company_name: '',
      company_title: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        ...data,
        footer_logo: null,
      });
    }
  }, [open, data, reset]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('footer_logo', file, { shouldValidate: true });
  };

  const logoFile = watch('footer_logo');
  const logoPreview = logoFile instanceof File
    ? URL.createObjectURL(logoFile)
    : data.footer_logo;

  const renderTextField = (
    name: keyof FooterFormValues,
    label: string,
    multiline = false
  ): JSX.Element => (
    <Box display="flex" alignItems={multiline ? 'flex-start' : 'center'} gap={2}>
      <Box sx={{ width: 140, fontWeight: 500 }}>{label}</Box>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            multiline={multiline}
            rows={multiline ? 3 : 1}
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
        Edit Footer Info
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {renderTextField('footer_title_1', 'Footer Title')}
          {renderTextField('address_title', 'Address Title')}
          {renderTextField('address', 'Address', true)}
          {renderTextField('contact_title', 'Contact Title')}
          {renderTextField('contact_no', 'Contact Number')}
          {renderTextField('email', 'Email')}
          {renderTextField('company_name', 'Company Name')}
          {renderTextField('company_title', 'Company Title')}

          {/* Logo Preview */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Logo Preview</Box>
            <Box>
              <img
                src={logoPreview}
                alt="Footer Logo"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
            </Box>
          </Box>

          {/* Upload Logo */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Upload Logo</Box>
            <Button
              component="label"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoUpload}
              />
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 2, justifyContent: 'flex-end', gap: 1 }}
      >
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

export default EditFooterCardModal;
