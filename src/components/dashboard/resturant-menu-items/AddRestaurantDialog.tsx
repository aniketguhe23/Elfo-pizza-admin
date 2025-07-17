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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={600}>Add Restaurant</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Name
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Address
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter Address"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      City
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter City"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      State
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter State"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Pincode */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="pincode"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Pincode
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter Pincode"
                      error={!!errors.pincode}
                      helperText={errors.pincode?.message}
                      type="text"
                      inputProps={{
                        inputMode: 'numeric', // shows numeric keyboard on mobile
                        pattern: '[0-9]*', // restricts to digits
                        maxLength: 6, // optional: restrict length if needed
                      }}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, ''); // remove non-digits
                        field.onChange(numericValue);
                      }}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Contact Email */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact_email"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Contact Email
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter Contact Email"
                      error={!!errors.contact_email}
                      helperText={errors.contact_email?.message}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Contact Phone */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact_phone"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Contact Phone
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Enter Contact Phone"
                      error={!!errors.contact_phone}
                      helperText={errors.contact_phone?.message}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Opening Time */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="opening_time"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Opening Time
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="time"
                      error={!!errors.opening_time}
                      helperText={errors.opening_time?.message}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Closing Time */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="closing_time"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Closing Time
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="time"
                      error={!!errors.closing_time}
                      helperText={errors.closing_time?.message}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: textFieldStyle }}
                    />
                  </>
                )}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="#444"
                      textTransform="uppercase"
                      sx={{ mb: 0.5 }}
                    >
                      Password
                    </Typography>
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Password"
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
                  </>
                )}
              />
            </Grid>

            {/* is_active */}
            <Grid item xs={12}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Active" />
                )}
              />
            </Grid>

            {/* Logo Upload */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{ width: 160, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#444' }}
                >
                  Logo
                </Box>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setLogo(e.target.files[0])}
                />
              </Box>
            </Grid>

            {/* Banner Upload */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{ width: 160, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#444' }}
                >
                  Banner
                </Box>
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setBanner(e.target.files[0])}
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
