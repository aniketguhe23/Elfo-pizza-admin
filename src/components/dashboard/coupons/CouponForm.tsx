'use client';

import React, { useEffect } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useForm } from 'react-hook-form';

type CouponFormFields = {
  name: string;
  code: string;
  description: string;
  discountAmount: string;
  discountPercent: string;
  minOrderAmount: string;
  expiresAt: string;
  isActive: boolean;
  image: FileList | null;
};

interface CouponFormProps {
  defaultValues?: Partial<CouponFormFields> & { id?: string };
  onSuccess: () => void;
  existingImageUrl?: string;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
    {children}
  </Typography>
);

const CouponForm: React.FC<CouponFormProps> = ({ defaultValues, onSuccess }) => {
  const { apiCreateCoupons, apiUpdateCoupons } = ProjectApiList();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormFields>({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      discountAmount: '',
      discountPercent: '',
      minOrderAmount: '',
      expiresAt: '',
      isActive: true,
      image: null,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        expiresAt: defaultValues.expiresAt,
      });
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: CouponFormFields) => {
    try {
      const formData = new FormData();

      // Append image separately
      if (data.image && data.image instanceof FileList && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      // Append all other fields individually
      formData.append('name', data.name || '');
      formData.append('code', data.code || '');
      formData.append('description', data.description || '');

      if (data.discountAmount) {
        formData.append('discountAmount', data.discountAmount.toString());
      }

      if (data.discountPercent) {
        formData.append('discountPercent', data.discountPercent.toString());
      }
      if (data.minOrderAmount) {
        formData.append('minOrderAmount', data.minOrderAmount.toString());
      }

      if (data.expiresAt) {
        formData.append('expiresAt', data.expiresAt); // Keep it as plain text string (as you said)
      }

      formData.append('isActive', data.isActive ? 'true' : 'false');

      if (defaultValues?.id) {
        await axios.put(`${apiUpdateCoupons}/${defaultValues.id}`, formData);
      } else {
        await axios.post(apiCreateCoupons, formData);
      }

      onSuccess();
    } catch (err) {
      console.error('Failed to submit form', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent dividers>
        <Grid container spacing={1}>
          {/* Name */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Name</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
          </Grid>

          {/* Code */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Code</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                size="small"
                {...register('code', { required: 'Code is required' })}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            </Grid>
          </Grid>

          {/* Description */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Description</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth size="small" multiline rows={2} {...register('description')} />
            </Grid>
          </Grid>

          {/* Flat Discount */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Flat Discount (₹)</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth size="small" type="number" {...register('discountAmount')} />
            </Grid>
          </Grid>

          {/* Percent Discount */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Percent Discount (%)</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth size="small" type="number" {...register('discountPercent')} />
            </Grid>
          </Grid>

          {/* Minimum Order */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Minimum Order (₹)</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth size="small" type="number" {...register('minOrderAmount')} />
            </Grid>
          </Grid>

          {/* Expiry Date */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Expiry Date</Label>
            </Grid>
            <Grid item xs={9}>
              <TextField fullWidth size="small" type="date" {...register('expiresAt')} />
            </Grid>
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Upload Image</Label>
            </Grid>
            <Grid item xs={9}>
              <input type="file" accept="image/*" {...register('image')} />
            </Grid>
          </Grid>

          {/* Active Toggle */}
          {defaultValues && (
            <Grid item xs={12} container spacing={1} alignItems="center">
              <Grid item xs={3}>
                <Label>Is Active?</Label>
              </Grid>
              <Grid item xs={9}>
                <FormControlLabel
                  control={
                    <Switch checked={watch('isActive')} onChange={(e) => setValue('isActive', e.target.checked)} />
                  }
                  label=""
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onSuccess}
          sx={{
            width: 90,
            fontSize: '0.75rem',
            padding: '5px 10px',
            color: '#333',
            borderColor: '#ccc',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: '#f2f2f2',
              color: '#000',
              borderColor: '#bbb',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: 90,
            fontSize: '0.75rem',
            padding: '5px 10px',
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
          {defaultValues ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CouponForm;
