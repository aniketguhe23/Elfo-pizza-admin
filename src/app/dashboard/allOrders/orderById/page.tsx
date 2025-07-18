'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectApiList from '@/app/api/ProjectApiList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function OrderDetailPage() {
  const { apiGetOrdersById, apiUpdateStatusOrdersById } = ProjectApiList();

  const searchParams = useSearchParams();
  const orderNo = searchParams.get('order_no');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${apiGetOrdersById}/${orderNo}`);
      setOrder(res.data.data);
      setStatus(res.data.data?.order_status || '');
    } catch {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => setOpen(false);

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${apiUpdateStatusOrdersById}/${orderNo}`, { status });
      toast.success('Order status updated');
      await fetchOrder(); // ✅ Refetch updated data
      setOpen(false);
    } catch {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    if (!orderNo) return;
    fetchOrder();
  }, [orderNo]);

  return (
    <Box p={4}>
      {/* HEADER */}
      <Grid container justifyContent="space-between" alignItems="flex-start" mb={4} spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Order #{order?.Order_no}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Placed on:{' '}
            {new Date(order?.created_at).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Restaurant: {order?.restaurantInfo?.name} - {order?.restaurantInfo?.address}
          </Typography>

          {/* ORDER SUMMARY */}
          <Box sx={{ py: 3, mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Order Summary
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Type
                </Typography>
                <Typography fontWeight={600}>{order?.type === 'pickup' ? 'Pick up' : 'Delivery'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Status
                </Typography>
                <Chip label={order?.order_status} color="warning" size="small" sx={{ fontWeight: 600 }} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Payment Method
                </Typography>
                <Chip label="Cash on Delivery" color="default" size="small" sx={{ fontWeight: 600 }} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Payment Status
                </Typography>
                <Chip label="Unpaid" color="error" size="small" sx={{ fontWeight: 600 }} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            {/* <Button
              variant="contained"
              sx={{
                backgroundColor: '#3366ff',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 0.5,
                '&:hover': { backgroundColor: '#809fff' },
                width: 160,
              }}
              onClick={() => {
                const params = new URLSearchParams({
                  order_no: order?.Order_no,
                });

                router.push(`/dashboard/allOrders/invoice?${params.toString()}`);
              }}
            >
              Print Invoice
            </Button> */}
{/* 
            <Button
              onClick={() => setOpen(true)}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: '#3366ff',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 0.5,
                '&:hover': { backgroundColor: '#809fff' },
                width: 160,
              }}
            >
              Update Status
            </Button> */}
          </Box>
        </Grid>
      </Grid>

      {/* MAIN CONTENT */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Ordered Items
          </Typography>
          <Stack spacing={2}>
            {order?.items?.map((item: any, idx: number) => (
              <Paper key={idx} elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                  ₹{item.price} × {item.quantity}
                </Typography>
                {item.size && <Typography variant="body2">Size: {item.size}</Typography>}
                {item.crust && <Typography variant="body2">Crust: {item.crust}</Typography>}
                {item.toppings?.length > 0 && (
                  <Typography variant="body2">Toppings: {item.toppings.join(', ')}</Typography>
                )}
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography fontWeight={600} color="text.secondary">
                Customer Information
              </Typography>
            </Box>
            <Typography>{order?.userInfo?.firstName}</Typography>
            <Typography variant="body2" color="textSecondary">
              {order?.userInfo?.mobile}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {order?.userInfo?.email}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography fontWeight={600} color="text.secondary">
                Delivery Address
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              {order?.address || '—'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <RestaurantIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography fontWeight={600} color="text.secondary">
                Restaurant Info
              </Typography>
            </Box>
            <Typography fontWeight={600}>{order?.restaurantInfo?.name || 'Hungry Puppets'}</Typography>
            <Typography variant="body2" color="textSecondary">
              {order?.restaurantInfo?.contact_phone}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {order?.restaurantInfo?.address}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Total Amount
            </Typography>
            <Typography variant="h6" color="primary">
              ₹{order?.total_price || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* STATUS DIALOG */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>Update Order Status</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 140, fontWeight: 500 }}>Status</Box>
            <FormControl fullWidth size="small">
              <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleDialogClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleStatusUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
