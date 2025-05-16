import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

// import CloseIcon from '@mui/icons-material/Close';

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    image1: string;
    image2: string;
  };
  onSave: (updatedData: { title: string; description: string; image1: File | null; image2: File | null }) => void;
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

  const handleImageUpload = (field: 'image1' | 'image2') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0] || null;
    setValue(field, file, { shouldValidate: true });
  };

  const getPreview = (field: 'image1' | 'image2') => {
    const file: any = watch(field);
    if (file instanceof File) return URL.createObjectURL(file);
    return data[field] || '/default-image.png';
  };

  const handleSave = (formData: any) => {
    onSave({
      title: formData.title,
      description: formData.description,
      image1: formData.image1 instanceof File ? formData.image1 : null,
      image2: formData.image2 instanceof File ? formData.image2 : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth  BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(3px)',
        },
      }}>
      <DialogContent sx={{ p: 4, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'grey.500',
            background: 'rgba(0,0,0,0.04)',
            '&:hover': { background: 'rgba(0,0,0,0.08)' },
          }}
        >
          {/* <CloseIcon /> */}
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
          Edit Card Details
        </Typography>

        <Grid container spacing={3}>
          {[
            { name: 'title', label: 'Title', multiline: false },
            { name: 'description', label: 'Description', multiline: true, rows: 4 },
          ].map((fieldConfig) => (
            <Grid item xs={12} key={fieldConfig.name}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 500 }}>{fieldConfig.label}</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Controller
                    name={fieldConfig.name as 'title' | 'description'}
                    control={control}
                    rules={{ required: `${fieldConfig.label} is required` }}
                    render={({ field, fieldState }) => (
                      <TextField
                        fullWidth
                        size="small"
                        multiline={!!fieldConfig.multiline}
                        rows={fieldConfig.rows || 1}
                        variant="outlined"
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}

          {['image1', 'image2'].map((field, index) => (
            <Grid item xs={12} key={field}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 500 }}>{`Image ${index + 1}`}</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                      src={getPreview(field as 'image1' | 'image2')}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid #ccc',
                      }}
                    />
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
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload(field as 'image1' | 'image2')}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, }}>
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
      </DialogContent>
    </Dialog>
  );
};

export default EditCardModal;
