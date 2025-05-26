import React from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

interface WhyItem {
  title: string;
  description: string;
  image?: string | File | null;  // image is optional and can be null
}

interface WhyElfoEditFormProps {
  defaultValues: {
    list: WhyItem[];
  };
  onSubmit: (data: { list: WhyItem[] }) => void;
  onCancel: () => void;
}

function WhyElfoEditForm({
  defaultValues,
  onSubmit,
  onCancel,
}: WhyElfoEditFormProps): React.JSX.Element {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: 'list',
  });

  const watchedItems = watch('list');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const file: File | undefined = e.target.files?.[0];
    if (file) {
      setValue(`list.${index}.image`, file); // Store file directly
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 900,
        margin: '0 auto',
        padding: 3,
        backgroundColor: 'background.paper',
        minHeight: '100vh',
      }}
    >
      {/* The form content */}
      <Box sx={{ flexGrow: 1 }}>
        {fields.map((field, index) => (
          <Paper key={field.id} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 3 }}>
              Item {index + 1}
            </Typography>

            {/* Title Row */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4} sm={3} md={2}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Title
                </Typography>
              </Grid>
              <Grid item xs={8} sm={9} md={10}>
                <Controller
                  name={`list.${index}.title`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TextField size="small" fullWidth variant="outlined" {...controllerField} />
                  )}
                />
              </Grid>
            </Grid>

            {/* Description Row */}
            <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4} sm={3} md={2}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Description
                </Typography>
              </Grid>
              <Grid item xs={8} sm={9} md={10}>
                <Controller
                  name={`list.${index}.description`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      {...controllerField}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Image Upload Row */}
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={4} sm={3} md={2}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Image
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}
                sm={9}
                md={10}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{
                    width: 100,
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
                  Choose File {index + 1}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      handleImageChange(e, index);
                    }}
                  />
                </Button>

                {watchedItems?.[index]?.image && (
                  <Box sx={{ width: 80, height: 80 }}>
                    <img
                      src={
                        typeof watchedItems[index].image === 'string'
                          ? watchedItems[index].image
                          : watchedItems[index].image instanceof File
                          ? URL.createObjectURL(watchedItems[index].image)
                          : ''
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
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      {/* Footer */}
      <Grid container spacing={2} justifyContent="flex-end" sx={{ marginTop: 'auto' }}>
        <Grid item>
          <Button
            onClick={() => {
              onCancel();
            }}
            variant="outlined"
            size="small"
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
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            size="small"
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default WhyElfoEditForm;
