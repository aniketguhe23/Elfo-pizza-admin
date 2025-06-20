'use client';

import React, { useEffect,JSX } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface EditNearmeModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    nearme_heading: string;
    nearme_subheading: string;
    nearme_title: string;
    nearme_desc: string;
    nearme_icon1: string;
    nearme_icon1_desc: string;
    nearme_icon2: string;
    nearme_icon2_desc: string;
    nearme_img: string;
  };
  onSave: (updatedData: {
    nearme_heading: string;
    nearme_subheading: string;
    nearme_title: string;
    nearme_desc: string;
    nearme_icon1_desc: string;
    nearme_icon2_desc: string;
    nearme_img: File | null;
    nearme_icon1: File | null;
    nearme_icon2: File | null;
  }) => void;
}

interface FormValues {
  nearme_heading: string;
  nearme_subheading: string;
  nearme_title: string;
  nearme_desc: string;
  nearme_icon1_desc: string;
  nearme_icon2_desc: string;
  nearme_img: File | null;
  nearme_icon1: File | null;
  nearme_icon2: File | null;
}

function EditNearmeModal({ open, onClose, data, onSave }: EditNearmeModalProps): JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      nearme_heading: '',
      nearme_subheading: '',
      nearme_title: '',
      nearme_desc: '',
      nearme_icon1_desc: '',
      nearme_icon2_desc: '',
      nearme_img: null,
      nearme_icon1: null,
      nearme_icon2: null,
    },
  });

  useEffect(() => {
    if (data) {
      setValue('nearme_heading', data.nearme_heading);
      setValue('nearme_subheading', data.nearme_subheading);
      setValue('nearme_title', data.nearme_title);
      setValue('nearme_desc', data.nearme_desc);
      setValue('nearme_icon1_desc', data.nearme_icon1_desc);
      setValue('nearme_icon2_desc', data.nearme_icon2_desc);
      setValue('nearme_img', null);
      setValue('nearme_icon1', null);
      setValue('nearme_icon2', null);
    }
  }, [data, setValue]);

  const watchImg = watch('nearme_img');
  const watchIcon1 = watch('nearme_icon1');
  const watchIcon2 = watch('nearme_icon2');

  const previewSrc = (file: File | null, fallback: string): string =>
    file instanceof File ? URL.createObjectURL(file) : fallback || '/default-image.png';

  const handleFileChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0] ?? null;
      setValue(field, file, { shouldValidate: true });
    };

  const onSubmit = (formData: FormValues): void => {
    onSave({
      nearme_heading: formData.nearme_heading,
      nearme_subheading: formData.nearme_subheading,
      nearme_title: formData.nearme_title,
      nearme_desc: formData.nearme_desc,
      nearme_icon1_desc: formData.nearme_icon1_desc,
      nearme_icon2_desc: formData.nearme_icon2_desc,
      nearme_img: formData.nearme_img,
      nearme_icon1: formData.nearme_icon1,
      nearme_icon2: formData.nearme_icon2,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="body"
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid #ddd' }}>
          Edit Nearme Section
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3,
            py: 3,
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
          }}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <FormRow<FormValues> label="Heading" name="nearme_heading" control={control} />
            <FormRow<FormValues> label="Subheading" name="nearme_subheading" control={control} />
            <FormRow<FormValues> label="Title" name="nearme_title" control={control} />
            <FormRow<FormValues>
              label="Description"
              name="nearme_desc"
              control={control}
              multiline
              rows={3}
            />

            <Divider sx={{ my: 1 }} />

            <FormRow<FormValues>
              label="Icon 1 Description"
              name="nearme_icon1_desc"
              control={control}
              multiline
              rows={2}
            />
            <FormRow<FormValues>
              label="Icon 2 Description"
              name="nearme_icon2_desc"
              control={control}
              multiline
              rows={2}
            />

            <Divider sx={{ my: 1 }} />

            <ImageUpload
              label="Main Image"
              previewSrc={previewSrc(watchImg, data.nearme_img)}
              onFileChange={handleFileChange('nearme_img')}
            />
            <ImageUpload
              label="Icon 1"
              previewSrc={previewSrc(watchIcon1, data.nearme_icon1)}
              onFileChange={handleFileChange('nearme_icon1')}
            />
            <ImageUpload
              label="Icon 2"
              previewSrc={previewSrc(watchIcon2, data.nearme_icon2)}
              onFileChange={handleFileChange('nearme_icon2')}
            />
          </Box>
        </DialogContent>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
            borderTop: '1px solid #ddd',
            px: 3,
            py: 2,
            zIndex: 10,
          }}
        >
          <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, p: 0 }}>
            <Button
              onClick={onClose}
              variant="outlined"
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
        </Box>
      </form>
    </Dialog>
  );
}

// ✅ Generic reusable FormRow
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

// ✅ Reusable image upload with preview
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
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Typography fontWeight={500}>{label}</Typography>
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

export default EditNearmeModal;
