import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

interface Dish {
  title: string;
  subtitle: string;
  image: string | File;
  button?: string;
}

interface SpecialityFormProps {
  defaultValues: {
    title: string;
    subtitle: string;
    dishes: Dish[];
  };
  onSubmit: (data: SpecialityFormProps['defaultValues']) => void;
  onCancel: () => void;
}

const SpecialityEditForm: React.FC<SpecialityFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: 'dishes',
  });

  const watchedDishes = watch('dishes');

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual File object
    setValue(`dishes.${index}.image`, file);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 800,
        margin: '0 auto',
        p: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
        Edit Speciality
      </Typography>

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            label="Main Title"
            size="small"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            {...field}
          />
        )}
      />
      <Controller
        name="subtitle"
        control={control}
        render={({ field }) => (
          <TextField
            label="Subtitle"
            size="small"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            {...field}
          />
        )}
      />

      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Dish {index + 1}
          </Typography>

          <Controller
            name={`dishes.${index}.title`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Dish Title"
                size="small"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                {...field}
              />
            )}
          />

          <Controller
            name={`dishes.${index}.subtitle`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Dish Subtitle"
                size="small"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                {...field}
              />
            )}
          />

          <Controller
            name={`dishes.${index}.button`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Button Text"
                size="small"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                {...field}
              />
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Upload Image</InputLabel>
              <Button
                variant="contained"
                component="label"
                size="small"
                color="primary"
                sx={{
                  width: 'fit-content',
                  textTransform: 'none',
                  backgroundColor: 'primary.main',
                }}
              >
                Upload Image {index + 1}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, index)}
                />
              </Button>
            </FormControl>

            {watchedDishes?.[index]?.image && (
              <Box sx={{ width: 80, height: 80 }}>
                <img
                  src={
                    watchedDishes[index].image instanceof File
                      ? URL.createObjectURL(watchedDishes[index].image)
                      : watchedDishes[index].image
                  }
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      ))}

      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            sx={{ fontWeight: 'bold', paddingX: 3 }}
          >
            Update
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={onCancel}
            variant="outlined"
            size="large"
            color="secondary"
            sx={{ fontWeight: 'bold', paddingX: 3 }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SpecialityEditForm;
