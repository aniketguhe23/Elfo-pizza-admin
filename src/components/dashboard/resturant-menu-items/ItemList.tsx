'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Item {
  id: number;
  name: string;
  image: string;
  category: string;
  is_available?: any; // ✅ Added
  prices: {
    small: number | null;
    medium: number | null;
    large: number | null;
  };
}

interface ApiData {
  data: Record<string, Item[]>;
}

interface CategoryItemListProps {
  restaurantsNo: string;
}

export default function CategoryItemList({ restaurantsNo }: CategoryItemListProps): JSX.Element {
  const { apiGetResturantitems, apiRemoveItemFromResturant, apiUpdateRestaurant } = ProjectApiList();

  const [data, setData] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [removing, setRemoving] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res: AxiosResponse<ApiData> = await axios.get(`${apiGetResturantitems}/${restaurantsNo}/items`);
      if (res.data && typeof res.data.data === 'object') {
        setData(res.data.data);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [apiGetResturantitems, restaurantsNo]);

  const confirmRemove = async (): Promise<void> => {
    if (!selectedItem) return;
    try {
      setRemoving(true);
      await axios.delete(`${apiRemoveItemFromResturant}/${restaurantsNo}/item/${selectedItem.id}`);
      await fetchData();
      setSelectedItem(null);
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  const updateItemAvailability = async (restaurantNo: string, itemId: number, currentAvailability: boolean) => {
    try {
      const newAvailability = !currentAvailability; // toggle value

      await axios.put(`${apiUpdateRestaurant}/${restaurantNo}/item/${itemId}`, {
        is_available: newAvailability,
      });

      toast.success(`Item marked as ${newAvailability ? 'Available' : 'Unavailable'}`);
      await fetchData(); // Refresh the updated list
    } catch (error) {
      toast.error('Failed to update item availability');
    }
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const noItems = Object.keys(data).length === 0 || Object.values(data).every((items) => items.length === 0);

  return (
    <Box mt={2}>
      {noItems ? (
        <Typography variant="body2" color="text.secondary" align="center" mt={4}>
          No items found for this restaurant.
        </Typography>
      ) : (
        Object.entries(data).map(([category, items]) => (
          <Box key={category} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{
                my: 5,
                fontWeight: 600,
                fontSize: '1.5rem',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {category}
            </Typography>
            <Grid container spacing={1.5}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      height="100"
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, py: 1.5, px: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                        Small: ₹{item.prices.small ?? 'N/A'} <br />
                        Medium: ₹{item.prices.medium ?? 'N/A'} <br />
                        Large: ₹{item.prices.large ?? 'N/A'}
                      </Typography>
                    </CardContent>
                    <Box px={2} pb={1.5}>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        size="small"
                        onClick={() => {
                          setSelectedItem(item);
                        }}
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
                        Remove
                      </Button>

                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        onClick={() => updateItemAvailability(restaurantsNo, item.id, !!item.is_available)}
                        sx={{
                          mt: 1,
                          textTransform: 'none',
                          borderRadius: '10px',
                          backgroundColor: item.is_available ? '#4caf50' : '#9e9e9e', // Green or Gray
                          color: '#fff',
                          border: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: item.is_available ? '#388e3c' : '#757575',
                          },
                        }}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      {/* Confirm Delete Modal */}
      <Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{selectedItem?.name}</strong> from this restaurant?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setSelectedItem(null)}
            disabled={removing}
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
            onClick={confirmRemove}
            variant="contained"
            color="error"
            disabled={removing}
            sx={{
              width: 110,
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
            {removing ? 'Removing...' : 'Yes, Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
