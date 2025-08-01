'use client';

import { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Eye, Settings } from 'lucide-react';

import RefundDetailDialog from '@/components/dashboard/refunds/RefundDetailDialog';

type Refund = {
  id: string;
  Order_no: string;
  orderId: string;
  userName: string;
  reason: string;
  amount: number;
  status: string;
  createdAt: string;
};

type Restaurant = {
  id: string;
  name: string;
  restaurants_no: string;
  address: string;
};

export default function RefundListPage() {
  const { apiGetAllRefunds, apiGetResturants } = ProjectApiList();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [selected, setSelected] = useState<Refund | null>(null);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState('');

  const handleOpenDialog = (refund: Refund) => {
    setSelected(refund);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelected(null);
  };

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(apiGetResturants);
      setRestaurants(res.data?.data || []);
    } catch (err) {
      setError('Failed to load restaurants.');
    }
  };

  const fetchRefunds = async (restaurant_no: string) => {
    try {
      const res = await axios.get(`${apiGetAllRefunds}?restaurant_no=${restaurant_no}`);
      setRefunds(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching refunds:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchRefunds(restaurantId);
  }, [restaurantId]);

  return (
    <>
      <Box
        sx={{
          borderBottom: '1px solid #e0e0e0',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1.5,
        }}
      >
        <Settings size={24} />
        <Typography variant="h6">Refund</Typography>
      </Box>

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

      <Card sx={{ m: 2 }}>
        <CardHeader title={<Typography variant="h6">All Refund Requests</Typography>} />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {refunds.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No refund requests found.
            </Typography>
          ) : (
            refunds.map((refund) => (
              <Box
                key={refund.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>{refund.userName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order ID: {refund.Order_no}
                  </Typography>
                  <Typography variant="body2">
                    ₹{refund.amount} — {refund.reason}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip label={refund.status} variant="outlined" sx={{ textTransform: 'capitalize' }} />

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={() => handleOpenDialog(refund)}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Refund Details</DialogTitle>
        <Divider />
        <DialogContent>
          {selected && (
            <RefundDetailDialog
              refund={selected}
              onStatusChange={(newStatus: string) => {
                setRefunds((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: newStatus } : r)));
                handleCloseDialog();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
