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
import type { Control, FieldValues, Path, SubmitHandler } from 'react-hook-form';

interface EditAboutCardModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    heading: string;
    title: string;
    subtitle: string;
    text: string;
    image1: string;
  };
  onSave: (updatedData: {
    heading: string;
    title: string;
    subtitle: string;
    text: string;
    image1: File | null;
  }) => void;
}

interface FormValues {
  heading: string;
  title: string;
  subtitle: string;
  text: string;
  image1: File | null;
}

function EditAboutCardModal({ open, onClose, data, onSave }: EditAboutCardModalProps): JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      heading: '',
      title: '',
      subtitle: '',
      text: '',
      image1: null,
    },
  });

  useEffect(() => {
    if (data) {
      setValue('heading', data.heading);
      setValue('title', data.title);
      setValue('subtitle', data.subtitle);
      setValue('text', data.text);
      setValue('image1', null);
    }
  }, [data, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image1', file, { shouldValidate: true });
  };

  const handleSave: SubmitHandler<FormValues> = (formData) => {
    onSave({
      heading: formData.heading,
      title: formData.title,
      subtitle: formData.subtitle,
      text: formData.text,
      image1: formData.image1 instanceof File ? formData.image1 : null,
    });
  };

  const watchedImage = watch('image1');
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
          Edit About Card
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit(handleSave)} display="flex" flexDirection="column" gap={3}>
          {/* Heading */}
          <FormRow<FormValues> label="Heading" name="heading" control={control} />
          {/* Title */}
          <FormRow<FormValues> label="Title" name="title" control={control} />
          {/* Subtitle */}
          <FormRow<FormValues> label="Subtitle" name="subtitle" control={control} />
          {/* Text */}
          <FormRow<FormValues> label="Text" name="text" control={control} />

          {/* Image Preview */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Image Preview</Box>
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
            <Box sx={{ width: 140, fontWeight: 500 }}>Upload Image</Box>
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
          onClick={handleSubmit(handleSave)}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ✅ Reusable Form Row Component with proper types
function FormRow<T extends FieldValues>({
  label,
  name,
  control,
}: {
  label: string;
  name: Path<T>;
  control: Control<T>;
}): JSX.Element {
  const isMultiline = name === 'text';

  return (
    <Box display="flex" alignItems={isMultiline ? 'flex-start' : 'center'} gap={2}>
      <Box sx={{ width: 140, fontWeight: 500, mt: isMultiline ? '6px' : 0 }}>{label}</Box>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            {...field}
            multiline={isMultiline}
            rows={isMultiline ? 4 : 1}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
  );
}

export default EditAboutCardModal;
