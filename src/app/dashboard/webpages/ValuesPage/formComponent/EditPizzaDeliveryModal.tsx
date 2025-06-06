import React, { useEffect } from 'react';
import type { JSX } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface EditPizzaDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    heading: string;
    title: string;
    description: string | null;
    image1: string;
  };
  onSave: (updatedData: {
    heading: string;
    title: string;
    description: string | null;
    image1: File | null;
  }) => void;
}

interface FormValues {
  heading: string;
  title: string;
  description: string;
  image1: File | null;
}

function EditPizzaDeliveryModal({
  open,
  onClose,
  data,
  onSave,
}: EditPizzaDeliveryModalProps): JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      heading: '',
      title: '',
      description: '',
      image1: null,
    },
  });

  useEffect(() => {
    if (data) {
      setValue('heading', data.heading);
      setValue('title', data.title);
      setValue('description', data.description || '');
      setValue('image1', null);
    }
  }, [data, setValue]);

  const handleImage1Upload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image1', file, { shouldValidate: true });
  };

  const handleSave: SubmitHandler<FormValues> = (formData) => {
    onSave({
      heading: formData.heading,
      title: formData.title,
      description: formData.description,
      image1: formData.image1 instanceof File ? formData.image1 : null,
    });
  };

  const watchedImage1 = watch('image1');

  const preview1 =
    watchedImage1 instanceof File ? URL.createObjectURL(watchedImage1) : data.image1 || '/default-image.png';

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
          Edit Pizza Delivery Section
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <FormRow label="Heading" name="heading" control={control} />
            <FormRow label="Title" name="title" control={control} />
            <FormRow label="Description" name="description" control={control} multiline rows={3} />

            <Box display="flex" justifyContent="center">
              <ImageUpload label="Image" previewSrc={preview1} onFileChange={handleImage1Upload} />
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

export default EditPizzaDeliveryModal;
