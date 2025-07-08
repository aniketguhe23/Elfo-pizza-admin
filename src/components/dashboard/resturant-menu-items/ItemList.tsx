'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import type { JSX } from 'react';
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

interface ApiData {
  data: Record<string, Item[]>;
}

interface CategoryItemListProps {
  restaurantsNo: string;
}

export default function CategoryItemList({
  restaurantsNo,
}: CategoryItemListProps): JSX.Element {
  const { apiGetResturantitems, apiRemoveItemFromResturant } = ProjectApiList();

  const [data, setData] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [removing, setRemoving] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res: AxiosResponse<ApiData> = await axios.get(
        `${apiGetResturantitems}/${restaurantsNo}/items`
      );
      if (res.data && typeof res.data.data === 'object') {
        setData(res.data.data);
      }
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, [apiGetResturantitems, restaurantsNo]);

  const confirmRemove = async (): Promise<void> => {
    if (!selectedItem) return;
    try {
      setRemoving(true);
      await axios.delete(
        `${apiRemoveItemFromResturant}/${restaurantsNo}/item/${selectedItem.id}`
      );
      await fetchData();
      setSelectedItem(null);
    } catch {
      // handled silently
    } finally {
      setRemoving(false);
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

  const noItems =
    Object.keys(data).length === 0 ||
    Object.values(data).every((items) => items.length === 0);

  return (
    <Box mt={2}>
      {noItems ? (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={4}
        >
          No items found for this restaurant.
        </Typography>
      ) : (
        Object.entries(data).map(([category, items]) => (
          <Paper key={category} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        lineHeight={1.5}
                      >
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
        ))
      )}

      {/* Confirm Delete Modal */}
      <Dialog
        open={Boolean(selectedItem)}
        onClose={() => {
          setSelectedItem(null);
        }}
      >
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{' '}
            <strong>{selectedItem?.name}</strong> from this restaurant?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setSelectedItem(null);
            }}
            disabled={removing}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await confirmRemove();
            }}
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
