'use client';

import React, { useEffect } from 'react';
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
import ProjectApiList from '@/app/api/ProjectApiList';

type CouponFormFields = {
  name: string;
  code: string;
  description: string;
  discountAmount: string;
  discountPercent: string;
  minOrderAmount: string;
  expiresAt: string; // Plain string, no ISO conversion
  isActive: boolean;
  image: FileList | null;
};

interface CouponFormProps {
  defaultValues?: Partial<CouponFormFields> & { id?: string };
  onSuccess: () => void;
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
      // Ensure expiresAt stays in string format (not ISO)
      const data = {
        ...defaultValues,
        expiresAt: defaultValues.expiresAt ?? '', // leave as-is
      };
      reset(data);
    }
  }, [defaultValues]);

  const fields = [
    { label: 'Name', field: 'name', required: true },
    { label: 'Code', field: 'code', required: true },
    { label: 'Description', field: 'description', multiline: true },
    { label: 'Flat Discount (₹)', field: 'discountAmount', type: 'number' },
    { label: 'Percent Discount (%)', field: 'discountPercent', type: 'number' },
    { label: 'Minimum Order (₹)', field: 'minOrderAmount', type: 'number' },
    { label: 'Expiry Date', field: 'expiresAt', type: 'date' }, // Keep as string
  ] as const;

  const onSubmit = async (data: CouponFormFields) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        const value = data[key as keyof CouponFormFields];

        if (key === 'image' && value && (value as FileList)[0]) {
          formData.append('image', (value as FileList)[0]);
        } else {
          formData.append(key, typeof value === 'boolean' ? String(value) : value || '');
        }
      }

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
          {fields.map(({ label, field, type, multiline, required }:any) => (
            <Grid item xs={12} container key={field} alignItems="center" spacing={1}>
              <Grid item xs={3}>
                <Label>{label}</Label>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  size="small"
                  type={type || 'text'}
                  fullWidth
                  multiline={multiline}
                  rows={multiline ? 2 : 1}
                  {...register(field, required ? { required: `${label} is required` } : {})}
                  error={!!errors[field]}
                  helperText={errors[field]?.message}
                />
              </Grid>
            </Grid>
          ))}

          {/* Image upload */}
          <Grid item xs={12} container alignItems="center" spacing={1}>
            <Grid item xs={3}>
              <Label>Upload Image</Label>
            </Grid>
            <Grid item xs={9}>
              <input type="file" accept="image/*" {...register('image')} />
            </Grid>
          </Grid>

          {/* Active status toggle */}
          {defaultValues && (
            <Grid item xs={12} container alignItems="center" spacing={1}>
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
          {defaultValues ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CouponForm;
