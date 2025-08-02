'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

import CouponForm from '@/components/dashboard/coupons/CouponForm';

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
  const { apiGetCoupons, apiDeleteCoupons } = ProjectApiList();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selected, setSelected] = useState<Coupon | undefined>(undefined);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<any>(null);

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
    setSelected(undefined);
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
              <TableCell>{c.discountAmount ? `₹${c.discountAmount}` : `${c.discountPercent}%`}</TableCell>
              <TableCell>{c.minOrderAmount ? `₹${c.minOrderAmount}` : 'N/A'}</TableCell>
              <TableCell>{dayjs(c.expiresAt).format('DD MMM YYYY')}</TableCell>
              <TableCell>{c.isActive ? '✅' : '❌'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(c)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedCouponId(c.id); // set the ID of the coupon
                    setOpenConfirm(true); // open the modal
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        <CouponForm
          defaultValues={{
            id: selected?.id,
            name: selected?.name,
            code: selected?.code,
            description: selected?.description,
            discountAmount: selected?.discountAmount ?? undefined,
            discountPercent: selected?.discountPercent ?? undefined,
            minOrderAmount: selected?.minOrderAmount ?? undefined,
            isActive: selected?.isActive,
            expiresAt: selected?.expiresAt,
          }}
          existingImageUrl={selected?.image ?? undefined}
          onSuccess={() => {
            handleClose();
            fetchCoupons();
          }}
        />
      </Dialog>

      {/* delete */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this coupon?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await axios.delete(`${apiDeleteCoupons}/${selectedCouponId}`);
                fetchCoupons(); // refetch updated list
              } catch (err) {
                console.error('Failed to delete coupon:', err);
              } finally {
                setOpenConfirm(false);
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CouponsPage;
