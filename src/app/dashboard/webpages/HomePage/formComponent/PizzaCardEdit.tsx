import React from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface FormData {
  title: string;
  subtitle: string;
  description: string;
  image: File | null | any;
}

interface PizzaCardEditProps {
  defaultValues: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const PizzaCardEdit: React.FC<PizzaCardEditProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const { handleSubmit, control, setValue, watch } = useForm<FormData>({
    defaultValues,
  });

  const image = watch('image');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue('image', file, { shouldValidate: true });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
      }}
    >
      {/* Image preview */}
      {image && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={image} alt="Pizza" width={100} height={100} style={{ borderRadius: 8 }} />
        </Box>
      )}

      {/* Upload button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" component="label" size="small">
          Upload Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>

      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field, fieldState }) => (
          <TextField
            label="Title"
            variant="outlined"
            size="small"
            fullWidth
            {...field}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="subtitle"
        control={control}
        render={({ field }) => <TextField label="Subtitle" variant="outlined" size="small" fullWidth {...field} />}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField label="Description" variant="outlined" size="small" multiline rows={4} fullWidth {...field} />
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

export default PizzaCardEdit;
