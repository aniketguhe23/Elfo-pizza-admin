'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, TextField, Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import ProjectApiList from '@/app/api/ProjectApiList';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
  onPasswordChange: () => void;
}

interface PasswordForm {
  password: string;
}

const schema = yup.object().shape({
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function PasswordChangeDialog({ open, onClose, restaurantId, onPasswordChange }: Props) {
  const { apiUpdateRestaurantData } = ProjectApiList();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      setLoading(true);
      const res = await axios.put(`${apiUpdateRestaurantData}/${restaurantId}`, { password: data.password });

      if (res.data.status === 'success') {
        reset();
        onPasswordChange();
      } else {
        toast.error(res.data.message || 'Password update failed');
      }
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography mb={2} fontSize={14}>
          Enter a new password for this restaurant:
        </Typography>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{
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
          }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}  sx={{
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
          }}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
