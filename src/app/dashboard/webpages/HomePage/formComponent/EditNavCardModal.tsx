import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
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
  onSave: (updatedData: { title: string; description: string; image1: File | null }) => void;
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

  const watchedImage: any = watch('image1');
  const preview =
    watchedImage instanceof File ? URL.createObjectURL(watchedImage) : data.image1 || '/default-image.png';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Edit Navigation
        </Typography>
        <IconButton onClick={onClose}>{/* <Close /> */}</IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit(handleSave)} display="flex" flexDirection="column" gap={3}>
          {/* Title */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Logo Text</Box>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Logo text is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Description */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Background Color</Box>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Background color is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Image Preview */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Logo Preview</Box>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
          </Box>

          {/* Upload Image */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Upload Logo</Box>
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
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
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
          onClick={handleSubmit(handleSave)}
          variant="contained"
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNavCardModal;
