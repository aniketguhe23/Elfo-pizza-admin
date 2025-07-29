'use client';

import React, { useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import type { Restaurant } from '@/types/restaurant-types';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
  onDeleteSuccess?: () => void;
  onEdit: (restaurant: Restaurant) => void; // NEW
}

function RestaurantList({ restaurants, onSelect, onDeleteSuccess, onEdit }: RestaurantListProps): JSX.Element {
  const { apiRemoveRestaurant } = ProjectApiList();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const openConfirmDialog = (restaurant: Restaurant): void => {
    setSelectedRestaurant(restaurant);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = (): void => {
    setSelectedRestaurant(null);
    setConfirmDialogOpen(false);
  };

  const handleRemove = async (): Promise<void> => {
    if (!selectedRestaurant) return;

    try {
      setDeletingId(selectedRestaurant.id);
      await axios.delete(`${apiRemoveRestaurant}/${selectedRestaurant.restaurants_no}`);
      onDeleteSuccess?.();
    } catch (error: unknown) {
      toast.error('Failed to delet. Please try again later.');
      // Optional: use a logger or just remove
      // console.error removed to satisfy eslint no-console rule
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
                      onClick={() => {
                        openConfirmDialog(rest);
                      }}
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
                <Tooltip title="Edit Restaurant">
                  <IconButton
                    onClick={() => {
                      onEdit(rest);
                    }}
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l2.707 2.707a.5.5 0 0 1 0 .708l-9.146 9.146a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9.146-9.146zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zM10.5 3.207 2 11.707V13h1.293l8.5-8.5-1.293-1.293z" />
                    </svg>
                  </IconButton>
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
                onClick={() => {
                  onSelect(rest);
                }}
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
      <Dialog
        open={confirmDialogOpen}
        onClose={() => {
          closeConfirmDialog();
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{selectedRestaurant?.address}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closeConfirmDialog();
            }}
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
            onClick={async () => {
              await handleRemove();
            }}
            color="error"
            variant="contained"
            disabled={deletingId === selectedRestaurant?.id}
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
            {deletingId === selectedRestaurant?.id ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RestaurantList;
