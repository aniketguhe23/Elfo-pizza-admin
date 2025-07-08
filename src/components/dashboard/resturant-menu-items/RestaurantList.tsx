'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import axios from 'axios';
import { Restaurant } from '@/types/resturentTypes';
import ProjectApiList from '@/app/api/ProjectApiList';

interface Props {
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
  onDeleteSuccess?: () => void;
}

export default function RestaurantList({
  restaurants,
  onSelect,
  onDeleteSuccess,
}: Props) {
  const { apiRemoveRestaurant } = ProjectApiList();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const openConfirmDialog = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedRestaurant(null);
    setConfirmDialogOpen(false);
  };

  const handleRemove = async () => {
    if (!selectedRestaurant) return;

    try {
      // setDeletingId(selectedRestaurant.restaurants_no);
      await axios.delete(`${apiRemoveRestaurant}/${selectedRestaurant.restaurants_no}`);
      onDeleteSuccess?.();
    } catch (error: any) {
      console.error('Failed to delete restaurant:', error.message);
    } finally {
      setDeletingId(null);
      closeConfirmDialog();
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {restaurants.map((rest) => (
          <Grid item xs={12} sm={6} md={4} key={rest.id}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
              }}
            >
              {/* Header row */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {rest.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rest.address}
                  </Typography>
                </Box>

                <Tooltip title="Delete Restaurant">
                  <span>
                    <IconButton
                      onClick={() => openConfirmDialog(rest)}
                      color="error"
                      disabled={deletingId === rest.id}
                    >
                      {deletingId === rest.id ? (
                        <CircularProgress size={18} color="error" />
                      ) : (
                        <DeleteForeverRoundedIcon />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box mb={2}>
                <Typography variant="caption" color="text.secondary">
                  {rest.city}, {rest.state} - {rest.pincode}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  📞 {rest.contact_phone} | 📧 {rest.contact_email}
                </Typography>
              </Box>

              <Button
                onClick={() => onSelect(rest)}
                variant="contained"
                fullWidth
                sx={{
                  color: '#222',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '10px',
                  backgroundColor: '#e6e6e6',
                  border: '1px solid #ccc',
                  '&:hover': {
                    backgroundColor: '#222',
                    color: '#ffffff',
                    border: '1px solid #000',
                  },
                }}
              >
                View Menu Items
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove{' '}
            {/* <strong>{selectedRestaurant?.address}</strong>? */}
          </Typography>
          <Typography>
            {/* Are you sure you want to remove{' '} */}
            <strong>{selectedRestaurant?.address}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRemove}
            color="error"
            variant="contained"
            disabled={deletingId === selectedRestaurant?.id}
          >
            {deletingId === selectedRestaurant?.id ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
