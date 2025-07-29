'use client';

import React, { useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface RestaurantFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_email: string;
  contact_phone: string;
  opening_time: string;
  closing_time: string;
  is_active?: boolean;
  password: string;
}

interface RestaurantResponse {
  status: string;
  data: unknown;
}

interface AddRestaurantDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (restaurant: unknown) => void;
}

const fields: {
  name: keyof RestaurantFormData;
  label: string;
  type?: string;
}[] = [
  { name: 'name', label: 'Name' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'pincode', label: 'Pincode', type: 'text' },
  { name: 'contact_email', label: 'Contact Email' },
  { name: 'contact_phone', label: 'Contact Phone' },
];


const schema = yup.object().shape({
  name: yup.string().max(150).required(),
  address: yup.string().required(),
  city: yup.string().max(100).required(),
  state: yup.string().max(100).required(),
  pincode: yup.string().max(15).required(),
  contact_email: yup.string().email().max(150).required(),
  contact_phone: yup.string().max(15).required(),
  opening_time: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use 24h format HH:MM')
    .required(),
  closing_time: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use 24h format HH:MM')
    .required(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required()
    .test('not-email', 'Password cannot be same as email', function (value) {
      return value !== this.parent.contact_email;
    }),
  is_active: yup.boolean(),
});

export default function AddRestaurantDialog({ open, onClose, onAdd }: AddRestaurantDialogProps) {
  const { apiCreateReesturants } = ProjectApiList();
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      contact_email: '',
      contact_phone: '',
      opening_time: '',
      closing_time: '',
      password: '',
      is_active: true,
    },
  });

  const onSubmit = async (formData: RestaurantFormData) => {
    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      if (logo) data.append('logo', logo);
      if (banner) data.append('banner', banner);

      const res = await axios.post<RestaurantResponse>(apiCreateReesturants, data);
      if (res.data.status === 'success') {
        onAdd(res.data.data);
        onClose();
        reset();
        setLogo(null);
        setBanner(null);
      }
    } catch (error: any) {
      // Check if it's a response with expected field error
      const res = error?.response?.data;
      if (res?.status === 'error' && res?.field === 'contact_email') {
        setError('contact_email', {
          type: 'manual',
          message: res.message || 'Email already exists',
        });
      } else {
        toast.error('Failed to Create Restaurant. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    '& input': { fontSize: '0.875rem' },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle fontWeight={600}>Add Restaurant</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Text Inputs */}
          {fields.map(({ name, label, type }) => (
              <Grid item xs={12} key={name}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body2" fontWeight={600} color="#444" textTransform="uppercase" sx={{ pr: 2 }}>
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Controller
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          placeholder={`Enter ${label}`}
                          error={!!errors[name as keyof typeof errors]}
                          helperText={errors[name as keyof typeof errors]?.message}
                          type={type || 'text'}
                          inputProps={
                            name === 'pincode'
                              ? {
                                  inputMode: 'numeric',
                                  pattern: '[0-9]*',
                                  maxLength: 6,
                                }
                              : undefined
                          }
                          onChange={(e) => {
                            const value = name === 'pincode' ? e.target.value.replace(/\D/g, '') : e.target.value;
                            field.onChange(value);
                          }}
                          InputProps={{ sx: textFieldStyle }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}

            {/* Password Field */}
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight={600} color="#444" textTransform="uppercase" sx={{ pr: 2 }}>
                    Password
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        placeholder="Enter Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          sx: textFieldStyle,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Is Active Checkbox */}
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight={600} color="#444" textTransform="uppercase" sx={{ pr: 2 }}>
                    Status
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Active" />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Logo Upload */}
            {/* <Grid item xs={12}>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="#444"
            textTransform="uppercase"
            sx={{ pr: 2 }}
          >
            Logo
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setLogo(e.target.files[0])}
          />
        </Grid>
      </Grid>
    </Grid> */}

            {/* Banner Upload */}
            {/* <Grid item xs={12}>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="#444"
            textTransform="uppercase"
            sx={{ pr: 2 }}
          >
            Banner
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setBanner(e.target.files[0])}
          />
        </Grid>
      </Grid>
    </Grid> */}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
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
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
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
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
