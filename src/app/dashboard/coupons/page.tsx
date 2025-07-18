'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import CouponForm from '@/components/dashboard/coupons/CouponForm';
import ProjectApiList from '@/app/api/ProjectApiList';

interface Coupon {
  id: string;
  name: string;
  code: string;
  description: string;
  discountAmount: string | null;
  discountPercent: string | null;
  minOrderAmount: string | null;
  isActive: boolean;
  image: string | null;
  expiresAt: string;
  createdAt: string;
}

const CouponsPage = () => {
    const { apiGetCoupons,apiDeleteCoupons } = ProjectApiList();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [open, setOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(apiGetCoupons); // Replace with actual base URL if needed
      setCoupons(res.data.data);
    } catch (err) {
      console.error('Error fetching coupons', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleEdit = (coupon: Coupon) => {
    setSelected(coupon);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${apiDeleteCoupons}/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Coupons</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Coupon
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Min Order</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.code}</TableCell>
              <TableCell>
                {c.discountAmount ? `₹${c.discountAmount}` : `${c.discountPercent}%`}
              </TableCell>
              <TableCell>{c.minOrderAmount ? `₹${c.minOrderAmount}` : 'N/A'}</TableCell>
              <TableCell>{dayjs(c.expiresAt).format('DD MMM YYYY')}</TableCell>
              <TableCell>{c.isActive ? '✅' : '❌'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(c)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(c.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        <CouponForm
          defaultValues={selected}
          onSuccess={() => {
            handleClose();
            fetchCoupons();
          }}
        />
      </Dialog>
    </Box>
  );
};

export default CouponsPage;
