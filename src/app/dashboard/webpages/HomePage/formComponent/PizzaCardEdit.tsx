import React from 'react';
import type { JSX ,ChangeEvent} from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface FormDataProps {
  title: string;
  subtitle: string;
  description: string;
  image?: File | null ;
  imageUrl?: string;
  // file upload or existing image URL or null
}

interface PizzaCardEditProps {
  open: boolean;
  defaultValues: FormDataProps;
  onSubmit: (data: FormDataProps) => void;
  onCancel: () => void;
}

function PizzaCardEdit({ open, defaultValues, onSubmit, onCancel }: PizzaCardEditProps): JSX.Element {
  const { handleSubmit, control, setValue, watch } = useForm<FormDataProps>({
    defaultValues,
  });

  const image = watch('image');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image', file, { shouldValidate: true });
  };

  // Create preview URL only if image is a File
  const previewUrl: string | null =
    image instanceof File ? URL.createObjectURL(image) : typeof image === 'string' ? image : null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle textAlign="center" fontWeight={600}>
        Edit Pizza Card
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title Field */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component="label" htmlFor="title" sx={{ width: 120, fontWeight: 600 }}>
              Title
            </Typography>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  id="title"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...field}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Subtitle Field */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component="label" htmlFor="subtitle" sx={{ width: 120, fontWeight: 600 }}>
              Subtitle
            </Typography>
            <Controller
              name="subtitle"
              control={control}
              render={({ field }) => <TextField id="subtitle" variant="outlined" size="small" fullWidth {...field} />}
            />
          </Box>

          {/* Description Field */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography component="label" htmlFor="description" sx={{ width: 120, fontWeight: 600, pt: '10px' }}>
              Description
            </Typography>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField id="description" variant="outlined" size="small" multiline rows={4} fullWidth {...field} />
              )}
            />
          </Box>

          {/* Image Upload Section at bottom */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component="label" htmlFor="image-upload" sx={{ width: 120, fontWeight: 600 }}>
              Image
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {/* Preview */}
              {previewUrl ? (
                <Box>
                  <img
                    src={previewUrl}
                    alt="Pizza Preview"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      objectFit: 'cover',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                </Box>
              ) : null}

              {/* Upload Button */}
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{
                  width: 90,
                  fontSize: '0.75rem',
                  padding: '5px 10px',
                  backgroundColor: '#fff',
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#222',
                    color: '#fff',
                  },
                }}
              >
                Choose File
                <input id="image-upload" type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onCancel}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 70,
              fontSize: '0.75rem',
              px: 2,
              backgroundColor: '#fff',
              color: '#000',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              border: '1px solid #cccccc',
              '&:hover': {
                backgroundColor: '#f2f2f2',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              minWidth: 70,
              fontSize: '0.75rem',
              px: 2,
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#222',
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default PizzaCardEdit;
