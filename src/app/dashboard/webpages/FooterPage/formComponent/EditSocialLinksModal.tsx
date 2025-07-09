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
  Typography,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export interface SocialLinksFormValues {
  social_title_text: string;
  facebook_url: string;
  facebook_image: File | string;
  insta_url: string;
  insta_image: File | string;
  google_url: string;
  google_image: File | string;
  youtub_url: string;
  youtub_image: File | string;
  x_url: string;
  x_image: File | string;
}

interface EditSocialLinksModalProps {
  open: boolean;
  onClose: () => void;
  data: Omit<SocialLinksFormValues, 'facebook_image' | 'insta_image' | 'google_image' | 'youtub_image' | 'x_image'> & {
    facebook_image: string;
    insta_image: string;
    google_image: string;
    youtub_image: string;
    x_image: string;
  };
  onSave: (formData: SocialLinksFormValues) => void;
}

function EditSocialLinksModal({
  open,
  onClose,
  data,
  onSave,
}: EditSocialLinksModalProps): JSX.Element {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<SocialLinksFormValues>({
    defaultValues: {
      ...data,
      facebook_image: data.facebook_image,
      insta_image: data.insta_image,
      google_image: data.google_image,
      youtub_image: data.youtub_image,
      x_image: data.x_image,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        ...data,
        facebook_image: data.facebook_image,
        insta_image: data.insta_image,
        google_image: data.google_image,
        youtub_image: data.youtub_image,
        x_image: data.x_image,
      });
    }
  }, [open, data, reset]);

  useEffect(() => {
    return () => {
      const values = watch();
      Object.values(values).forEach((val) => {
        if (val instanceof File) {
          const url = URL.createObjectURL(val);
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [watch]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof SocialLinksFormValues
  ): void => {
    const file = e.target?.files?.[0];
    if (file?.type?.startsWith('image/')) {
      setValue(fieldName, file, { shouldValidate: true });
    }
  };

  const renderImageUpload = (
    name: keyof SocialLinksFormValues,
    label: string,
    defaultUrl: string
  ): JSX.Element => {
    const value = watch(name);
    const previewUrl = value instanceof File ? URL.createObjectURL(value) : defaultUrl;

    return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography fontWeight={600}>{label} Image</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <img
            src={previewUrl}
            alt={`${label} Preview`}
            style={{
              width: 60,
              height: 60,
              objectFit: 'contain',
              borderRadius: 8,
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
            }}
          />
          <Button component="label" variant="outlined" size="small">
            Upload
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                handleImageUpload(e, name);
              }}
            />
          </Button>
        </Box>
      </Box>
    );
  };

  const renderField = (
    name: keyof SocialLinksFormValues,
    label: string
  ): JSX.Element => (
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required` }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          size="small"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ px: 3, py: 2, fontWeight: 600 }}>Edit Social Links</DialogTitle>
      <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="subtitle2" fontWeight={600}>Section Title</Typography>
        {renderField('social_title_text', 'Social Section Title')}

        <Divider />
        <Typography variant="subtitle2" fontWeight={600}>Facebook</Typography>
        {renderField('facebook_url', 'Facebook URL')}
        {renderImageUpload('facebook_image', 'Facebook', data.facebook_image)}

        <Divider />
        <Typography variant="subtitle2" fontWeight={600}>Instagram</Typography>
        {renderField('insta_url', 'Instagram URL')}
        {renderImageUpload('insta_image', 'Instagram', data.insta_image)}

        <Divider />
        <Typography variant="subtitle2" fontWeight={600}>Google</Typography>
        {renderField('google_url', 'Google URL')}
        {renderImageUpload('google_image', 'Google', data.google_image)}

        <Divider />
        <Typography variant="subtitle2" fontWeight={600}>YouTube</Typography>
        {renderField('youtub_url', 'YouTube URL')}
        {renderImageUpload('youtub_image', 'YouTube', data.youtub_image)}

        <Divider />
        <Typography variant="subtitle2" fontWeight={600}>X (Twitter)</Typography>
        {renderField('x_url', 'X URL')}
        {renderImageUpload('x_image', 'X', data.x_image)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            fontSize: '0.75rem',
            border: '1px solid #ccc',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSave)}
          variant="contained"
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none',
            backgroundColor: '#000',
            '&:hover': { backgroundColor: '#222' },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditSocialLinksModal;
