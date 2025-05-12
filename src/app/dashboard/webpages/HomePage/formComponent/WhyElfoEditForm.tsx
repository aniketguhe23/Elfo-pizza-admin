import React from 'react';
import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

interface WhyItem {
  title: string;
  description: string;
  image: string | File;
}

interface WhyElfoEditFormProps {
  defaultValues: {
    list: WhyItem[];
  };
  onSubmit: (data: { list: WhyItem[] }) => void;
  onCancel: () => void;
}

const WhyElfoEditForm: React.FC<WhyElfoEditFormProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: 'list',
  });

  const watchedItems = watch('list');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file: any = e.target.files?.[0];
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
        borderRadius: 2,
        // boxShadow: 3,
      }}
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Edit Why Elfo Items
      </Typography>

      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ pb: 3}}>
            Item {index + 1}
          </Typography>

          <Controller
            name={`list.${index}.title`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Title"
                size="small"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                {...field}
              />
            )}
          />

          <Controller
            name={`list.${index}.description`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Description"
                size="small"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
                {...field}
              />
            )}
          />

          {/* Image Upload Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{
                textTransform: 'none',
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' },
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

            {/* Image Preview */}
            {watchedItems?.[index]?.image && (
              <Box sx={{ width: 80, height: 80 }}>
                <img
                  src={
                    typeof watchedItems[index].image === 'string'
                      ? watchedItems[index].image
                      : URL.createObjectURL(watchedItems[index].image)
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

export default WhyElfoEditForm;
