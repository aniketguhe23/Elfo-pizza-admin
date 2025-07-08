'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
  image: string;
  category: string;
  prices: {
    small: number | null;
    medium: number | null;
    large: number | null;
  };
}

type ApiResponse = Record<string, Item[]>;

export default function CategoryItemList({ restaurantsNo }: any) {
  const { apiGetResturantitems, apiRemoveItemFromResturant } = ProjectApiList();
  const [data, setData] = useState<ApiResponse>({});
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiGetResturantitems}/${restaurantsNo}/items`);
      if (res.data && typeof res.data.data === 'object') {
        setData(res.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = async () => {
    if (!selectedItem) return;
    try {
      setRemoving(true);
      await axios.delete(`${apiRemoveItemFromResturant}/${restaurantsNo}/item/${selectedItem.id}`);
      await fetchData();
      setSelectedItem(null); // Close dialog
    } catch (err: any) {
      console.error('Failed to remove item:', err.message);
    } finally {
      setRemoving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantsNo]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box mt={2}>
      {Object.entries(data).map(([category, items]) => (
        <Paper key={category} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {category}
          </Typography>
          <Grid container spacing={1.5}>
            {items.map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${category}-${idx}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
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
                      onClick={() => setSelectedItem(item)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: 1,
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      {/* Confirm Delete Modal */}
      <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
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
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRemove}
            variant="contained"
            color="error"
            disabled={removing}
            sx={{ textTransform: 'none' }}
          >
            {removing ? 'Removing...' : 'Yes, Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
