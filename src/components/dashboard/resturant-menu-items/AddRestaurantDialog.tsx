'use client';

import React, { useState } from 'react';
import type { ChangeEvent, JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
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
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  is_active: boolean;
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

export default function AddRestaurantDialog({ open, onClose, onAdd }: AddRestaurantDialogProps): JSX.Element {
  const { apiCreateReesturants } = ProjectApiList();

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contact_email: '',
    contact_phone: '',
    opening_time: '',
    closing_time: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = e.target;
    if (files?.length) {
      const file = files[0];
      if (name === 'logo') setLogo(file);
      else if (name === 'banner') setBanner(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const timeRegex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/;

    if (formData.name.length > 150) newErrors.name = 'Max 150 characters';
    if (formData.city.length > 100) newErrors.city = 'Max 100 characters';
    if (formData.state.length > 100) newErrors.state = 'Max 100 characters';
    if (formData.pincode.length > 15) newErrors.pincode = 'Max 15 characters';

    if (formData.contact_email.length > 150 || !emailRegex.test(formData.contact_email)) {
      newErrors.contact_email = 'Enter a valid email (max 150 chars)';
    }

    if (formData.contact_phone.length > 15) {
      newErrors.contact_phone = 'Max 15 characters';
    }

    if (!timeRegex.test(formData.opening_time)) {
      newErrors.opening_time = 'Use 24h format HH:MM';
    }

    if (!timeRegex.test(formData.closing_time)) {
      newErrors.closing_time = 'Use 24h format HH:MM';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (): Promise<void> => {
    if (!validate()) return;

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      if (logo) data.append('logo', logo);
      if (banner) data.append('banner', banner);

      const res: AxiosResponse<RestaurantResponse> = await axios.post(apiCreateReesturants, data);

      if (res.data.status === 'success') {
        onAdd(res.data.data);
        onClose();
      }
    } catch (error: unknown) {
     toast.error('Failed to Create Resturant. Please try again later.');
      // Optional: use a logger or just remove
      // console.error removed to satisfy eslint no-console rule
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle fontWeight={600}>Add Restaurant</DialogTitle>

      <DialogContent dividers>
        <Box mt={1}>
          <Grid container spacing={2}>
            {(
              [
                'name',
                'address',
                'city',
                'state',
                'pincode',
                'contact_email',
                'contact_phone',
                'opening_time',
                'closing_time',
              ] as (keyof RestaurantFormData)[]
            ).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#444"
                    textTransform="uppercase"
                    sx={{ mb: 0.5 }}
                  >
                    {key.replace(/_/g, ' ')}
                  </Typography>
                  <TextField
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    error={Boolean(errors[key])}
                    helperText={errors[key]}
                    fullWidth
                    size="small"
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    InputProps={{
                      sx: {
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '& input': { fontSize: '0.875rem' },
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="is_active" checked={formData.is_active} onChange={handleChange} />}
                label="Active"
                sx={{ ml: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 160,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: '#444',
                  }}
                >
                  Logo
                </Box>
                <input type="file" name="logo" accept="image/*" onChange={handleFileChange} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 160,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: '#444',
                  }}
                >
                  Banner
                </Box>
                <input type="file" name="banner" accept="image/*" onChange={handleFileChange} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          disabled={loading}
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
          variant="contained"
          onClick={handleAdd}
          disabled={loading}
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
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
