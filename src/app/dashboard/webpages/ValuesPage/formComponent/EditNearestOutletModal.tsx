'use client';

import React, { useEffect,JSX  } from 'react';

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
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler, Control, FieldValues, Path } from 'react-hook-form';

interface EditNearestOutletModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    heading: string;
    title: string;
    subtitle: string;
    yes: string;
    yes_desc: string;
    no: string;
    no_desc: string;
    image1: string;
  };
  onSave: (updatedData: {
    heading: string;
    title: string;
    subtitle: string;
    yes: string;
    yes_desc: string;
    no: string;
    no_desc: string;
    image1: File | null;
  }) => void;
}

interface FormValues {
  heading: string;
  title: string;
  subtitle: string;
  yes: string;
  yes_desc: string;
  no: string;
  no_desc: string;
  image1: File | null;
}

function EditNearestOutletModal({
  open,
  onClose,
  data,
  onSave,
}: EditNearestOutletModalProps): JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      heading: '',
      title: '',
      subtitle: '',
      yes: '',
      yes_desc: '',
      no: '',
      no_desc: '',
      image1: null,
    },
  });

  useEffect(() => {
    if (data) {
      setValue('heading', data.heading);
      setValue('title', data.title);
      setValue('subtitle', data.subtitle);
      setValue('yes', data.yes);
      setValue('yes_desc', data.yes_desc);
      setValue('no', data.no);
      setValue('no_desc', data.no_desc);
      setValue('image1', null);
    }
  }, [data, setValue]);

  const handleImage1Upload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image1', file, { shouldValidate: true });
  };

  const watchedImage1 = watch('image1');
  const preview1 =
    watchedImage1 instanceof File ? URL.createObjectURL(watchedImage1) : data.image1 || '/default-image.png';

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    onSave({
      heading: formData.heading,
      title: formData.title,
      subtitle: formData.subtitle,
      yes: formData.yes,
      yes_desc: formData.yes_desc,
      no: formData.no,
      no_desc: formData.no_desc,
      image1: formData.image1 instanceof File ? formData.image1 : null,
    });
  };

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
          fontWeight: 600,
        }}
      >
        Edit Nearest Outlet Section
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <FormRow<FormValues> label="Heading" name="heading" control={control} />
            <FormRow<FormValues> label="Title" name="title" control={control} />
            <FormRow<FormValues> label="Subtitle" name="subtitle" control={control} />
            <FormRow<FormValues> label="Yes" name="yes" control={control} />
            <FormRow<FormValues> label="Yes Description" name="yes_desc" control={control} multiline rows={3} />
            <FormRow<FormValues> label="No" name="no" control={control} />
            <FormRow<FormValues> label="No Description" name="no_desc" control={control} multiline rows={3} />

            <Box mt={2}>
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
              '&:hover': { backgroundColor: '#f2f2f2' },
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
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ✅ Generic and type-safe FormRow component
function FormRow<T extends FieldValues>({
  label,
  name,
  control,
  multiline = false,
  rows = 1,
}: {
  label: string;
  name: Path<T>;
  control: Control<T>;
  multiline?: boolean;
  rows?: number;
}): JSX.Element {
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

// ✅ Reusable typed ImageUpload component
function ImageUpload({
  label,
  previewSrc,
  onFileChange,
}: {
  label: string;
  previewSrc: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
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

export default EditNearestOutletModal;
