'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import axios from 'axios';

import type { Restaurant } from '@/types/restaurant-types';
import AddItemDialog from '@/components/dashboard/resturant-menu-items/AddItemDialog';
import AddRestaurantDialog from '@/components/dashboard/resturant-menu-items/AddRestaurantDialog';
import ItemList from '@/components/dashboard/resturant-menu-items/ItemList';
import RestaurantList from '@/components/dashboard/resturant-menu-items/RestaurantList';

export default function RestaurantMenuItems(): JSX.Element {
  const { apiGetResturants, apiGetResturantitems } = ProjectApiList();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignedItemIds, setAssignedItemIds] = useState<number[]>([]);

  const fetchRestaurants = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get<{ status: string; data: Restaurant[] }>(apiGetResturants);
      if (res.data?.status === 'success') {
        setRestaurants(res.data.data);
      }
    } catch (err) {
     // Optional: use a logger or just remove
// console.error removed to satisfy eslint no-console rule
    } finally {
      setLoading(false);
    }
  }, [apiGetResturants]);

  const fetchAssignedItems = async (restaurantNo: string): Promise<void> => {
    try {
      const res = await axios.get<{ data: Record<string, { id: number }[]> }>(
        `${apiGetResturantitems}/${restaurantNo}/items`
      );
      const data = res.data?.data ?? {};
      const itemIds = Object.values(data)
        .flat()
        .map((item) => item.id);
      setAssignedItemIds(itemIds);
    } catch (err) {
     // Optional: use a logger or just remove
// console.error removed to satisfy eslint no-console rule

      setAssignedItemIds([]);
    }
  };

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  const handleAddRestaurant = (): void => {
    void fetchRestaurants();
  };

  const handleOpenItemDialog = async (): Promise<void> => {
    if (selectedRestaurant) {
      await fetchAssignedItems(selectedRestaurant.restaurants_no);
      setOpenItemDialog(true);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight={600}>
          Restaurant & Items
        </Typography>

        {selectedRestaurant ? (
          <Button
            variant="contained"
            onClick={() => {
              void handleOpenItemDialog();
            }}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Add Item
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialog(true);
            }}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Add Restaurant
          </Button>
        )}
      </Box>

      <AddRestaurantDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        onAdd={handleAddRestaurant}
      />

      {selectedRestaurant && (
        <AddItemDialog
          open={openItemDialog}
          onClose={() => {
            setOpenItemDialog(false);
          }}
          restaurantNo={selectedRestaurant.restaurants_no}
          assignedItemIds={assignedItemIds}
          onAdd={() => {
            setOpenItemDialog(false);
          }}
        />
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : selectedRestaurant ? (
        <>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedRestaurant(null);
            }}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#222' },
              mb: 2,
            }}
          >
            ← Back to Restaurants
          </Button>
          <Box mb={2}>
            <Typography variant="h5" fontWeight={600}>
              {selectedRestaurant.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedRestaurant.name}
            </Typography>
          </Box>

          <ItemList restaurantsNo={selectedRestaurant.restaurants_no} />
        </>
      ) : (
        <RestaurantList
          restaurants={restaurants}
          onSelect={(r): void => {
            setSelectedRestaurant(r);
          }}
        />
      )}
    </Container>
  );
}