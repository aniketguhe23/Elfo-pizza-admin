'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { yupResolver } from '@hookform/resolvers/yup';
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
  pincode: string;
  contact_email: string;
  contact_phone: string;
  opening_time: string;
  closing_time: string;
  is_active?: boolean;
}

interface EditRestaurantDialogProps {
  open: boolean;
  onClose: () => void;
  restaurantData: any;
  onUpdate: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  pincode: yup.string().required(),
  contact_email: yup.string().email().required(),
  contact_phone: yup.string().required(),
  opening_time: yup.string().required(),
  closing_time: yup.string().required(),
  is_active: yup.boolean(),
});

export default function EditRestaurantDialog({ open, onClose, restaurantData, onUpdate }: EditRestaurantDialogProps) {
  const { apiUpdateRestaurantData } = ProjectApiList();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (restaurantData) {
      reset({ ...restaurantData });
    }
  }, [restaurantData, reset]);

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
              {[
                'name',
                'address',
                'city',
                'state',
                'pincode',
                'contact_email',
                'contact_phone',
                'opening_time',
                'closing_time',
              ].map((fieldName) => (
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

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value} />}
                    />
                  }
                  label="Active"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordModal(true)}
                  sx={{
                    minWidth: 70,
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
