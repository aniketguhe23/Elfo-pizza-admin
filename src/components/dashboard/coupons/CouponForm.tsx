'use client';

import React, { useEffect, useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
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
  is_coustom: boolean;
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
  const [loading, setLoading] = useState(false);

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
      is_coustom: false,
      image: null,
    },
  });

  // ✅ Discount type state with 3 options
  const [discountType, setDiscountType] = useState<'amount' | 'percent' | 'both'>(
    defaultValues?.discountAmount && defaultValues?.discountPercent
      ? 'both'
      : defaultValues?.discountAmount
      ? 'amount'
      : 'percent'
  );

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        expiresAt: defaultValues.expiresAt,
      });

      if (defaultValues.discountAmount && defaultValues.discountPercent) {
        setDiscountType('both');
      } else if (defaultValues.discountAmount) {
        setDiscountType('amount');
      } else if (defaultValues.discountPercent) {
        setDiscountType('percent');
      }
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: CouponFormFields) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (data.image && data.image instanceof FileList && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      formData.append('name', data.name || '');
      formData.append('code', data.code || '');
      formData.append('description', data.description || '');

      // ✅ Append based on selected type
      if (discountType === 'amount' || discountType === 'both') {
        if (data.discountAmount) {
          formData.append('discountAmount', data.discountAmount.toString());
        }
      }
      if (discountType === 'percent' || discountType === 'both') {
        if (data.discountPercent) {
          formData.append('discountPercent', data.discountPercent.toString());
        }
      }

      if (data.minOrderAmount) {
        formData.append('minOrderAmount', data.minOrderAmount.toString());
      }
      if (data.expiresAt) {
        formData.append('expiresAt', data.expiresAt);
      }

      formData.append('isActive', data.isActive ? 'true' : 'false');
      formData.append('is_coustom', data.is_coustom ? 'true' : 'false');

      if (defaultValues?.id) {
        await axios.put(`${apiUpdateCoupons}/${defaultValues.id}`, formData);
      } else {
        await axios.post(apiCreateCoupons, formData);
      }

      onSuccess();
    } catch (err) {
      console.error('Failed to submit form', err);
    } finally {
      setLoading(false);
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

          {/* ✅ Discount Type Toggle */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Discount Type</Label>
            </Grid>
            <Grid item xs={9}>
              <ToggleButtonGroup
                value={discountType}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setDiscountType(newValue);
                    // clear values only if switching from both to single
                    if (newValue === 'amount') setValue('discountPercent', '');
                    if (newValue === 'percent') setValue('discountAmount', '');
                  }
                }}
                size="small"
              >
                <ToggleButton value="amount">Flat (₹)</ToggleButton>
                <ToggleButton value="percent">Percent (%)</ToggleButton>
                <ToggleButton value="both">Both</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          {/* Flat Discount */}
          {(discountType === 'amount' || discountType === 'both') && (
            <Grid item xs={12} container spacing={1} alignItems="center">
              <Grid item xs={3}>
                <Label>Flat Discount (₹)</Label>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  {...register('discountAmount', {
                    required: discountType === 'amount' ? 'Flat discount is required' : false,
                  })}
                  error={!!errors.discountAmount}
                  helperText={errors.discountAmount?.message}
                />
              </Grid>
            </Grid>
          )}

          {/* Percent Discount */}
          {(discountType === 'percent' || discountType === 'both') && (
            <Grid item xs={12} container spacing={1} alignItems="center">
              <Grid item xs={3}>
                <Label>Percent Discount (%)</Label>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  {...register('discountPercent', {
                    required: discountType === 'percent' ? 'Percent discount is required' : false,
                  })}
                  error={!!errors.discountPercent}
                  helperText={errors.discountPercent?.message}
                />
              </Grid>
            </Grid>
          )}

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
                    <Switch
                      checked={watch('isActive')}
                      onChange={(e) => setValue('isActive', e.target.checked)}
                    />
                  }
                  label=""
                />
              </Grid>
            </Grid>
          )}

          {/* Custom Toggle */}
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Label>Is Custom?</Label>
            </Grid>
            <Grid item xs={9}>
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('is_coustom')}
                    onChange={(e) => setValue('is_coustom', e.target.checked)}
                  />
                }
                label=""
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onSuccess}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : defaultValues ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CouponForm;
