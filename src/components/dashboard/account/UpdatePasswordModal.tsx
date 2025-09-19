import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import ProjectApiList from '@/app/api/ProjectApiList';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/default-logger';

type Props = {
  open: boolean;
  onClose: () => void;
  adminId: string;
  onCredentialsUpdated?: () => void;
  currentEmail?: string;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const UpdateCredentialsModal: React.FC<Props> = ({
  open,
  onClose,
  adminId,
  onCredentialsUpdated,
  currentEmail = '',
}) => {
  const { apiUpdateUserDatabyId } = ProjectApiList();
  const router = useRouter();

  const [email, setEmail] = useState(currentEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateCredentials = async () => {
    setError('');
    if (showPasswordFields && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const payload: any = {};
      if (showEmailField) payload.email = email;
      if (showPasswordFields && newPassword) payload.password = newPassword;

      await axios.put(`${apiUpdateUserDatabyId}/${adminId}`, payload);

      // ✅ After updating credentials, force logout
      try {
        const { error: signOutError } = await authClient.signOut();
        if (signOutError) {
          logger.error('Sign out error', signOutError);
        }
      } catch (err) {
        logger.error('Sign out error', err);
      }

      setLoading(false);
      setNewPassword('');
      setConfirmPassword('');

      onCredentialsUpdated?.();
      onClose();

      // ✅ Refresh the app so login screen shows
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error updating credentials');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Update Credentials
        </Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {/* Buttons to show fields */}
        <Box mb={2} display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => {
              setShowEmailField(true);
              setShowPasswordFields(false);
            }}
          >
            Change Email
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setShowPasswordFields(true);
              setShowEmailField(false);
            }}
          >
            Change Password
          </Button>
        </Box>

        {/* Email Field */}
        {showEmailField && (
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {/* Password Fields */}
        {showPasswordFields && (
          <>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </>
        )}

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCredentials}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
