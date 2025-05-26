import React from 'react';
import type { JSX } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface BannerFormData {
  hero2_title_1: string;
  hero2_title_2: string;
  image1: File | null | string;
  image2: File | null | string;
  image3: File | null | string;
}

interface BannerEditFormProps {
  open: boolean;
  defaultValues: BannerFormData;
  onSubmit: (data: BannerFormData) => void;
  onCancel: () => void;
}

function BannerEditForm({ open, defaultValues, onSubmit, onCancel }: BannerEditFormProps): JSX.Element {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<BannerFormData>({
    defaultValues,
  });

  const image1 = watch('image1');
  const image2 = watch('image2');
  const image3 = watch('image3');

  const handleImageUpload = (field: keyof BannerFormData): (e: React.ChangeEvent<HTMLInputElement>) => void => (e) => {
    const file = e.target.files?.[0] || null;
    setValue(field, file, { shouldValidate: true });
  };

  const getImageSrc = (img: File | string | null): string | null => {
    if (!img) return null;
    return typeof img === 'string' ? img : URL.createObjectURL(img);
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md" BackdropProps={{
      sx: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(3px)',
      },
    }}>
      <DialogTitle textAlign="center" fontWeight={600}>
        Edit Banner Section
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              gap: 2,
            }}
          >
            {[
              { field: 'image1', value: image1 },
              { field: 'image2', value: image2 },
              { field: 'image3', value: image3 },
            ].map(({ field, value }) => (
              <Box
                key={field}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  gap: 1,
                }}
              >
                {getImageSrc(value) && (
                  <img
                    src={getImageSrc(value)!}
                    alt={field}
                    width={100}
                    height={100}
                    style={{
                      borderRadius: 8,
                      objectFit: 'cover',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload(field as keyof BannerFormData)}
                  />
                </Button>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 120, fontWeight: 600 }}>Title 1</Box>
            <Controller
              name="hero2_title_1"
              control={control}
              rules={{ required: 'Title 1 is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  {...field}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 120, fontWeight: 600 }}>Title 2</Box>
            <Controller
              name="hero2_title_2"
              control={control}
              rules={{ required: 'Title 2 is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  {...field}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onCancel}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', minWidth: 80 }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={isSubmitting}
            sx={{
              textTransform: 'none',
              backgroundColor: '#000',
              minWidth: 80,
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default BannerEditForm;
