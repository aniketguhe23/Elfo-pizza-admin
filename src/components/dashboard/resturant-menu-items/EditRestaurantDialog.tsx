'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import PasswordChangeDialog from './PasswordChangeDialog';

interface RestaurantFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  contact_email: string;
  contact_phone: string;
  is_active?: boolean;
}

interface EditRestaurantDialogProps {
  open: boolean;
  onClose: () => void;
  restaurantData: any;
  onUpdate: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  pincode: yup.number().required('Pincode is required'),
  contact_email: yup.string().email('Invalid email').required('Email is required'),
  contact_phone: yup.string().required('Phone is required'),
  is_active: yup.boolean(),
});

export default function EditRestaurantDialog({ open, onClose, restaurantData, onUpdate }: EditRestaurantDialogProps) {
  const { apiUpdateRestaurantData, apigetStates, apigetCities } = ProjectApiList();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: yupResolver(schema),
  });

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(apigetStates);
        setStates(res.data || []);
      } catch (err) {
        console.error('Failed to fetch states', err);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when selectedStateId changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedStateId) return;
      try {
        const res = await axios.get(`${apigetCities}/${selectedStateId}`);
        setCities(res.data || []);
      } catch (err) {
        console.error('Failed to fetch cities', err);
      }
    };
    fetchCities();
  }, [selectedStateId]);

  // Set form defaults from restaurantData
  useEffect(() => {
    if (restaurantData) {
      reset({ ...restaurantData });

      const stateObj = states.find((s) => s.name === restaurantData.state);
      if (stateObj) {
        setSelectedStateId(stateObj.id);
      }
    }
  }, [restaurantData, states, reset]);

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${apiUpdateRestaurantData}/${restaurantData.restaurants_no}`, data);
      if (res.data.status === 'success') {
        toast.success('Restaurant updated');
        onUpdate();
        onClose();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        <DialogTitle>Edit Restaurant</DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <form>
            <Grid container spacing={2}>
              {['name', 'address', 'contact_email'].map((fieldName) => (
                <Grid item xs={12} key={fieldName}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <Typography variant="body2" fontWeight={500}>
                        {fieldName.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Controller
                        name={fieldName as keyof RestaurantFormData}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={!!errors[fieldName as keyof typeof errors]}
                            helperText={errors[fieldName as keyof typeof errors]?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              {/* PINCODE Field (Number Only) */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body2" fontWeight={500}>
                      CONTACT PHONE
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Controller
                      name="contact_phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                             maxLength: 15,
                          }}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          error={!!errors.contact_phone}
                          helperText={errors.contact_phone?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body2" fontWeight={500}>
                      PINCODE
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Controller
                      name="pincode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                             maxLength: 7,
                          }}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          error={!!errors.pincode}
                          helperText={errors.pincode?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* State Dropdown */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body2" fontWeight={500}>
                      STATE
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          size="small"
                          variant="outlined"
                          error={!!errors.state}
                          helperText={errors.state?.message}
                          onChange={(e) => {
                            const selectedName = e.target.value;
                            field.onChange(selectedName);
                            const selected = states.find((s) => s.name === selectedName);
                            setSelectedStateId(selected?.id || null);
                            setValue('city', '');
                          }}
                        >
                          <MenuItem value="">Select State</MenuItem>
                          {states.map((state) => (
                            <MenuItem key={state.id} value={state.name}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* City Dropdown */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body2" fontWeight={500}>
                      CITY
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          size="small"
                          variant="outlined"
                          error={!!errors.city}
                          helperText={errors.city?.message}
                        >
                          <MenuItem value="">Select City</MenuItem>
                          {cities.map((city) => (
                            <MenuItem key={city.id} value={city.name}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* is_active Checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value || false} />}
                    />
                  }
                  label="Active"
                />
              </Grid>

              {/* Change Password Button */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordModal(true)}
                  sx={{
                    fontSize: '0.75rem',
                    px: 2,
                    backgroundColor: '#AEAFB8',
                    color: 'black',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#222',
                      color: '#fff',
                    },
                  }}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{
              fontSize: '0.75rem',
              px: 2,
              backgroundColor: '#fff',
              color: '#000',
              textTransform: 'none',
              fontWeight: 500,
              border: '1px solid #cccccc',
              borderRadius: 1,
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
            {loading ? 'Updating...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <PasswordChangeDialog
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        restaurantId={restaurantData.restaurants_no}
        onPasswordChange={() => {
          setShowPasswordModal(false);
          toast.success('Password updated');
        }}
      />
    </>
  );
}
