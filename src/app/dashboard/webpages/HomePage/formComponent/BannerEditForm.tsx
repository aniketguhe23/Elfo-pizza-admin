import React from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface BannerFormData {
  hero2_title_1: string;
  hero2_title_2: string;
  image1: File | null;
  image2: File | null;
  image3: File | null;
}

interface BannerEditFormProps {
  defaultValues: BannerFormData;
  onSubmit: (data: BannerFormData) => void;
  onCancel: () => void;
}

const BannerEditForm: React.FC<BannerEditFormProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const { control, handleSubmit, setValue, watch } = useForm<BannerFormData>({ defaultValues });

  const image1 = watch('image1');
  const image2 = watch('image2');
  const image3 = watch('image3');

  const handleImageUpload = (field: keyof BannerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(field, file, { shouldValidate: true });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        {[{ field: 'image1', value: image1 }, { field: 'image2', value: image2 }, { field: 'image3', value: image3 }].map(
          (img:any, index) => (
            <Grid item xs={12} sm={4} key={img.field}>
              <Box sx={{ textAlign: 'center' }}>
                {img.value && (
                  <img
                    src={img.value}
                    // src={URL.createObjectURL(img.value) || img.value}
                    alt={`Image ${index + 1}`}
                    width={100}
                    height={100}
                    style={{ borderRadius: 8 }}
                  />
                )}
                <Button variant="outlined" component="label" size="small" sx={{ mt: 1 }}>
                  Upload Image {index + 1}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload(img.field as keyof BannerFormData)} />
                </Button>
              </Box>
            </Grid>
          )
        )}
      </Grid>

      <Controller
        name="hero2_title_1"
        control={control}
        rules={{ required: 'Title 1 is required' }}
        render={({ field, fieldState }) => (
          <TextField
            label="Title 1"
            fullWidth
            size="small"
            variant="outlined"
            {...field}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="hero2_title_2"
        control={control}
        rules={{ required: 'Title 2 is required' }}
        render={({ field, fieldState }) => (
          <TextField
            label="Title 2"
            fullWidth
            size="small"
            variant="outlined"
            {...field}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Grid container spacing={1} justifyContent="center">
        <Grid item>
          <Button type="submit" variant="contained" size="small">
            Update
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" size="small" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BannerEditForm;
