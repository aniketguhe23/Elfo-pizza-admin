'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';

type SupportRequest = {
  id: number;
  order_id: string;
  restaurant_name: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
};

type Restaurant = {
  id: string;
  name: string;
  restaurants_no: string;
  address: string;
};

export default function ContactSupportPage() {
  const { apiGetContactSUpport, apiUpdateSupportStatus, apiGetResturants } = ProjectApiList();
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [modalOpenId, setModalOpenId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SupportRequest['status']>('pending');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(apiGetResturants);
      setRestaurants(res.data?.data || []);
    } catch (err) {
      setError('Failed to load restaurants.');
    }
  };

  const fetchSupportRequests = async () => {
    try {
      const res = await axios.get(`${apiGetContactSUpport}?restaurant_id=${restaurantId}&page=${page}&limit=10`);

      if (res.data.status === 'success') {
        setSupportRequests(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
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
      const res = await axios.put(`${apiUpdateSupportStatus}/${id}`, {
        status: newStatus,
      });

      if (res.data.status === 'success') {
        setModalOpenId(null);
        await fetchSupportRequests();
      } else {
        console.error('Status update failed:', res.data.message);
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
      case 'pending':
      default:
        return 'warning';
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        User Support Requests
      </Typography>

      <Box sx={{ m: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ minWidth: 150 }}>
          Select Restaurant:
        </Typography>

        <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
          <Select
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
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
              <em>All Resturent</em>
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
              <TableCell>Order ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supportRequests.map((req, index) => (
              <TableRow key={req.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/allOrders/orderById?order_no=${req.order_id}`}
                    style={{ color: '#1976d2', textDecoration: 'underline' }}
                  >
                    {req.order_id}
                  </Link>
                </TableCell>
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
                  <Dialog
                    open={modalOpenId === req.id}
                    onClose={() => setModalOpenId(null)}
                    fullWidth
                    maxWidth="xs"
                    PaperProps={{
                      sx: {
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: 'none',
                      },
                    }}
                    BackdropProps={{
                      sx: {
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <DialogTitle
                      sx={{
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        borderBottom: '1px solid #e0e0e0',
                        pb: 1.5,
                        mb: 1.5,
                      }}
                    >
                      Update Support Status
                    </DialogTitle>

                    <DialogContent>
                      <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                        Current Status:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          p: 1,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          display: 'inline-block',
                          backgroundColor: '#f9f9f9',
                        }}
                      >
                        {req.status}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                        Select New Status:
                      </Typography>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 16 }}>
                        {['pending', 'resolved', 'rejected'].map((status) => (
                          <Button
                            key={status}
                            variant={selectedStatus === status ? 'contained' : 'outlined'}
                            onClick={() => setSelectedStatus(status as SupportRequest['status'])}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              minWidth: 100,
                              bgcolor: selectedStatus === status ? '#000' : 'transparent',
                              color: selectedStatus === status ? '#fff' : '#000',
                              borderColor: '#000',
                              '&:hover': {
                                bgcolor: selectedStatus === status ? '#222' : '#f0f0f0',
                              },
                            }}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #e0e0e0' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleStatusChange(req.id, selectedStatus)}
                        disabled={updatingId === req.id}
                        sx={{
                          bgcolor: '#000',
                          color: '#fff',
                          '&:hover': { bgcolor: '#222' },
                          textTransform: 'none',
                        }}
                      >
                        {updatingId === req.id ? 'Updating...' : 'Update Status'}
                      </Button>
                      <Button
                        onClick={() => setModalOpenId(null)}
                        sx={{
                          textTransform: 'none',
                          color: '#333',
                          border: '1px solid #ccc',
                          bgcolor: '#f9f9f9',
                          '&:hover': { bgcolor: '#eee' },
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
      </TableContainer>
    </div>
  );
}
