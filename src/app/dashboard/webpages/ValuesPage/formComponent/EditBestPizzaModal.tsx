import React, { useEffect } from 'react';
import type { JSX } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface EditBestPizzaModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    heading: string;
    heading2: string;
    title: string;
    description: string | null;
    image1: string;
    image2: string;
    bgcolor: string;
  };
  onSave: (updatedData: {
    heading: string;
    heading2: string;
    title: string;
    description: string | null;
    image1: File | null;
    image2: File | null;
    bgcolor: string;
  }) => void;
}

interface FormValues {
  heading: string;
  heading2: string;
  title: string;
  description: string;
  image1: File | null;
  image2: File | null;
  bgcolor: string;
}

function EditBestPizzaModal({ open, onClose, data, onSave }: EditBestPizzaModalProps): JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      heading: '',
      heading2: '',
      title: '',
      description: '',
      image1: null,
      image2: null,
      bgcolor: '#FFFFFF',
    },
  });

  useEffect(() => {
    if (data) {
      setValue('heading', data.heading);
      setValue('heading2', data.heading2);
      setValue('title', data.title);
      setValue('description', data.description || '');
      setValue('image1', null);
      setValue('image2', null);
      setValue('bgcolor', data.bgcolor || '#FFFFFF');
    }
  }, [data, setValue]);

  const handleImage1Upload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image1', file, { shouldValidate: true });
  };

  const handleImage2Upload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image2', file, { shouldValidate: true });
  };

  const handleSave: SubmitHandler<FormValues> = (formData) => {
    onSave({
      heading: formData.heading,
      heading2: formData.heading2,
      title: formData.title,
      description: formData.description,
      image1: formData.image1 instanceof File ? formData.image1 : null,
      image2: formData.image2 instanceof File ? formData.image2 : null,
      bgcolor: formData.bgcolor,
    });
  };

  const watchedImage1 = watch('image1');
  const watchedImage2 = watch('image2');

  const preview1 =
    watchedImage1 instanceof File ? URL.createObjectURL(watchedImage1) : data.image1 || '/default-image.png';

  const preview2 =
    watchedImage2 instanceof File ? URL.createObjectURL(watchedImage2) : data.image2 || '/default-image.png';

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
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogTitle
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid #e0e0e0',
            fontWeight: 600,
          }}
        >
          Edit Best Pizza Section
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <FormRow label="Heading" name="heading" control={control} />
            <FormRow label="Sub-heading" name="heading2" control={control} />
            <FormRow label="Title" name="title" control={control} />
            <FormRow label="Description" name="description" control={control} multiline rows={4} />

            {/* Image Uploads */}
            <Box display="flex" justifyContent="space-between" gap={2} mt={2} mb={3}>
              <Box flex={1}>
                <ImageUpload label="Image 1" previewSrc={preview1} onFileChange={handleImage1Upload} />
              </Box>
              <Box flex={1}>
                <ImageUpload label="Image 2" previewSrc={preview2} onFileChange={handleImage2Upload} />
              </Box>
            </Box>

            {/* Background Color Picker */}
            <Controller
              name="bgcolor"
              control={control}
              render={({ field }) => (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography sx={{ width: 140, fontWeight: 500 }}>Background Color</Typography>
                  <TextField
                    {...field}
                    type="color"
                    sx={{ width: 100, height: 50, padding: 0 }}
                    inputProps={{ style: { height: 50, padding: 0, cursor: 'pointer' } }}
                  />
                </Box>
              )}
            />
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
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
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
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function FormRow({
  label,
  name,
  control,
  multiline = false,
  rows = 1,
}: {
  label: string;
  name: keyof FormValues;
  control: any;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <Box display="flex" alignItems={multiline ? 'flex-start' : 'center'} gap={2}>
      <Typography sx={{ width: 140, fontWeight: 500, mt: multiline ? '6px' : 0 }}>{label}</Typography>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            variant="outlined"
            multiline={multiline}
            rows={rows}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
  );
}

function ImageUpload({
  label,
  previewSrc,
  onFileChange,
}: {
  label: string;
  previewSrc: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box display="flex" alignItems="center" gap={2} flexDirection="column" sx={{ mt: 1 }}>
      <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
      <Box
        component="img"
        src={previewSrc}
        alt={`${label} Preview`}
        sx={{
          width: 140,
          height: 140,
          objectFit: 'cover',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          border: '1px solid #ddd',
          mb: 1,
        }}
      />
      <Button
        component="label"
        variant="outlined"
        sx={{
          px: 3,
          py: 1,
          borderRadius: 1,
          fontSize: '0.75rem',
          textTransform: 'none',
          color: '#000',
          borderColor: '#ccc',
          '&:hover': { borderColor: '#888' },
        }}
      >
        Upload {label}
        <input hidden accept="image/*" type="file" onChange={onFileChange} />
      </Button>
    </Box>
  );
}

export default EditBestPizzaModal;
