import React from 'react';
import type { JSX } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import ImagePreview from './ImagePreview';

interface Dish {
  title: string;
  subtitle: string;
  image: string | File;
  button?: string;
}

interface SpecialityFormProps {
  open: boolean;
  defaultValues: {
    title: string;
    subtitle: string;
    dishes: Dish[];
  };
  onSubmit: (data: SpecialityFormProps['defaultValues']) => void;
  onCancel: () => void;
}

// Converted to function declaration with explicit return type
function SpecialityEditForm({ open, defaultValues, onSubmit, onCancel }: SpecialityFormProps): JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: 'dishes',
  });

  const watchedDishes = watch('dishes');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue(`dishes.${index}.image`, file);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" align="center" fontWeight={600} fontSize="1rem">
          Edit Specialities
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="speciality-form"
          sx={{
            p: 2,
            backgroundColor: '#fff',
            borderRadius: 2,
          }}
          onSubmit={handleSubmit(onSubmit)} // use handleSubmit here
        >
          <Grid container spacing={2}>
            {/* Title */}
            {/* <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="main-title"
                    fontWeight={600}
                    fontSize="0.875rem"
                  >
                    Main Title
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        id="main-title"
                        size="small"
                        fullWidth
                        variant="outlined"
                        InputProps={{ style: { fontSize: '0.875rem' } }}
                        {...controllerField}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid> */}

            {/* Subtitle */}
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" component="label" htmlFor="subtitle" fontWeight={600} fontSize="0.875rem">
                    Subtitle
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Controller
                    name="subtitle"
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        id="subtitle"
                        size="small"
                        fullWidth
                        variant="outlined"
                        InputProps={{ style: { fontSize: '0.875rem' } }}
                        {...controllerField}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Dish Fields */}
            {fields.map((field, index) => (
              <Grid key={field.id} item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} fontSize="0.95rem" gutterBottom>
                  Dish {index + 1}
                </Typography>

                <Grid container spacing={1} alignItems="center">
                  {/* Labels */}
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    <Typography variant="body2" component="label" htmlFor={`dishes.${index}.title`} fontSize="0.875rem">
                      Dish Title
                    </Typography>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor={`dishes.${index}.subtitle`}
                      fontSize="0.875rem"
                    >
                      Dish Subtitle
                    </Typography>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor={`dishes.${index}.button`}
                      fontSize="0.875rem"
                    >
                      Button Text
                    </Typography>
                  </Grid>

                  {/* Inputs */}
                  <Grid item xs={12} sm={9} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Controller
                      name={`dishes.${index}.title`}
                      control={control}
                      render={({ field: dishTitleField }) => (
                        <TextField
                          size="small"
                          fullWidth
                          variant="outlined"
                          InputProps={{ style: { fontSize: '0.875rem' } }}
                          {...dishTitleField}
                        />
                      )}
                    />
                    <Controller
                      name={`dishes.${index}.subtitle`}
                      control={control}
                      render={({ field: dishSubtitleField }) => (
                        <TextField
                          size="small"
                          fullWidth
                          variant="outlined"
                          InputProps={{ style: { fontSize: '0.875rem' } }}
                          {...dishSubtitleField}
                        />
                      )}
                    />
                    <Controller
                      name={`dishes.${index}.button`}
                      control={control}
                      render={({ field: dishButtonField }) => (
                        <TextField
                          size="small"
                          fullWidth
                          variant="outlined"
                          InputProps={{ style: { fontSize: '0.875rem' } }}
                          {...dishButtonField}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{
                      width: 120,
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
                    Upload Image {index + 1}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        handleImageChange(e, index);
                      }}
                    />
                  </Button>

                  {watchedDishes?.[index]?.image &&
                    (typeof watchedDishes[index].image === 'string' || watchedDishes[index].image instanceof File) && (
                      <ImagePreview image={watchedDishes[index].image} />
                    )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: 'flex-end',
          backgroundColor: '#f9f9f9',
          borderTop: '1px solid #ddd',
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            minWidth: 80,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="speciality-form"
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            backgroundColor: '#000',
            fontSize: '0.75rem',
            minWidth: 80,
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          {defaultValues ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SpecialityEditForm;
