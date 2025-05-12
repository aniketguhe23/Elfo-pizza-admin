import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, Button, Box,
  Typography, Grid, TextField, Paper
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    image1: string;
    image2: string;
  };
  onSave: (updatedData: {
    title: string;
    description: string;
    image1: File | null;
    image2: File | null;
  }) => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ open, onClose, data, onSave }) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      image1: null,
      image2: null,
    },
  });

  useEffect(() => {
    if (data) {
      setValue('title', data.title);
      setValue('description', data.description);
    }
  }, [data, setValue]);

  const image1 = watch('image1');
  const image2 = watch('image2');

  const handleImageUpload = (field: 'image1' | 'image2') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: any = e.target.files?.[0] || null;
    setValue(field, file, { shouldValidate: true });
  };

  const handleSave = (formData: any) => {
    onSave({
      title: formData.title,
      description: formData.description,
      image1: formData.image1 instanceof File ? formData.image1 : null,
      image2: formData.image2 instanceof File ? formData.image2 : null,
    });
  };

  const getPreview = (field: 'image1' | 'image2') => {
    const file: any = watch(field);
    if (file instanceof File) return URL.createObjectURL(file);
    return data[field] || '/default-image.png'; // fallback to previous image
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="outlined" size="small" sx={{ color: 'text.primary' }}>
            X
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Edit Card Data
        </Typography>

        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState }) => (
            <TextField
              label="Title"
              fullWidth
              size="small"
              variant="outlined"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field, fieldState }) => (
            <TextField
              label="Description"
              fullWidth
              size="small"
              variant="outlined"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Grid container spacing={3}>
          {['image1', 'image2'].map((field, index) => (
            <Grid item xs={12} sm={6} key={field}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={getPreview(field as 'image1' | 'image2')}
                    alt={`Image ${index + 1}`}
                    width={120}
                    height={120}
                    style={{
                      borderRadius: '8px',
                      objectFit: 'cover',
                      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    textTransform: 'none',
                  }}
                >
                  Upload Image {index + 1}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload(field as 'image1' | 'image2')}
                  />
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            onClick={handleSubmit(handleSave)}
            variant="contained"
            size="large"
            sx={{ fontWeight: 'bold', paddingX: 3 }}
          >
            Update
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            sx={{ fontWeight: 'bold', paddingX: 3 }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardModal;
