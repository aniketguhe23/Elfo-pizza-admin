'use client';

import { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from '@mui/material';
import axios from 'axios';

type SupportRequest = {
  id: number;
  order_id: string;
  restaurant_name: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'rejected' | 'acknowledge';
  createdAt: string;
  restaurant_id: string;
};

type Restaurant = {
  id: string;
  name: string;
  restaurants_no: string;
  address: string;
};

export default function ContactSupportPage() {
  const { apigetResturantSupport, apiupdateResturantSupport, apiGetResturants } = ProjectApiList();
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [modalOpenId, setModalOpenId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SupportRequest['status']>('pending');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(apiGetResturants);
      setRestaurants(res.data?.data || []);
    } catch {
      setError('Failed to load restaurants.');
    }
  };

  const fetchSupportRequests = async () => {
    try {
      const res = await axios.get(
        `${apigetResturantSupport}?restaurant_id=${restaurantId}&page=${page}&limit=10`
      );
      if (res.data.status === 'success') {
        setSupportRequests(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch support requests', err);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, [restaurantId, page]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleStatusChange = async (id: number, newStatus: SupportRequest['status']) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(`${apiupdateResturantSupport}/${id}`, {
        status: newStatus,
      });

      if (res.data.status === 'success') {
        setModalOpenId(null);
        await fetchSupportRequests();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: SupportRequest['status']) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'acknowledge':
        return 'info';
      case 'pending':
      default:
        return 'warning';
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Restaurant Support Requests
      </Typography>

      <Box sx={{ m: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ minWidth: 150 }}>
          Select Restaurant:
        </Typography>

        <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
          <Select
            value={restaurantId}
            onChange={(e) => {
              setPage(1); // Reset to page 1 on restaurant change
              setRestaurantId(e.target.value);
            }}
            displayEmpty
            renderValue={(selected) => {
              const selectedRestaurant = restaurants.find((res) => res.restaurants_no === selected);
              return selectedRestaurant ? (
                <>
                  <Typography variant="body2" fontWeight={500}>
                    {selectedRestaurant.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {selectedRestaurant.address}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select Restaurant
                </Typography>
              );
            }}
          >
            <MenuItem value="">
              <em>All Restaurants</em>
            </MenuItem>
            {restaurants.map((res) => (
              <MenuItem key={res.id} value={res.restaurants_no} sx={{ display: 'block', py: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {res.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {res.address}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Restaurant ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supportRequests.map((req, index) => (
              <TableRow key={req.id}>
                <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                <TableCell>{req.restaurant_id}</TableCell>
                <TableCell>{req.subject}</TableCell>
                <TableCell>{req.message}</TableCell>
                <TableCell>
                  <Chip label={req.status} color={getStatusColor(req.status)} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setModalOpenId(req.id);
                      setSelectedStatus(req.status);
                    }}
                  >
                    Update
                  </Button>

                  {/* Dialog code (unchanged) */}
                  {/* ... */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
}
