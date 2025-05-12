import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface EditNavModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    image1: string;
  };
  onSave: (updatedData: {
    title: string;
    description: string;
    image1: File | null;
  }) => void;
}

const EditNavCardModal: React.FC<EditNavModalProps> = ({ open, onClose, data, onSave }) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      image1: null,
    },
  });

  useEffect(() => {
    if (data) {
      setValue('title', data.title);
      setValue('description', data.description);
    }
  }, [data, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0] || null;
    setValue('image1', file, { shouldValidate: true });
  };

  const handleSave = (formData: any) => {
    onSave({
      title: formData.title,
      description: formData.description,
      image1: formData.image1 instanceof File ? formData.image1 : null,
    });
  };

  const preview = watch('image1')
    ? URL.createObjectURL(watch('image1'))
    : data.image1 || '/default-image.png';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" fontWeight="600" color="text.primary">Edit Navigation Data</Typography>
        <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          X
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, marginTop: 2 }}>
        <Box component="form" onSubmit={handleSubmit(handleSave)} noValidate>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Logo text is required' }}
            render={({ field, fieldState }) => (
              <TextField
                label="Logo Text"
                fullWidth
                variant="outlined"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ mb: 3 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Background color is required' }}
            render={({ field, fieldState }) => (
              <TextField
                label="Background Color"
                fullWidth
                variant="outlined"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ mb: 3 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Box textAlign="center" mb={3}>
            <img
              src={preview}
              alt="Logo Preview"
              width={120}
              height={120}
              style={{
                borderRadius: '12px',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '1rem',
              }}
            />
            <Button
              variant="outlined"
              component="label"
              size="large"
              sx={{ borderRadius: '8px' }}
            >
              Upload New Logo
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
          </Box>

          <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onClose} size="large" sx={{ borderRadius: '8px' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" sx={{ borderRadius: '8px' }}>
              Save Changes
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditNavCardModal;
