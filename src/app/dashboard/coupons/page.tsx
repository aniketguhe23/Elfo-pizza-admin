'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Coupon | undefined>(undefined);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiGetCoupons}?page=${page}&limit=10`);
      setCoupons(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page]);

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

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : coupons.length === 0 ? (
        <Typography align="center" mt={4}>
          No coupons found.
        </Typography>
      ) : (
        <>
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
                    <IconButton
                      onClick={() => {
                        setSelectedCouponId(c.id);
                        setOpenConfirm(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} mt={4} mb={5}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1 || loading}
              sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
            >
              Previous
            </Button>

            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Page {page} of {totalPages}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages || loading}
              sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
            >
              Next
            </Button>
          </Stack>
        </>
      )}

      {/* Create/Edit Dialog */}
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

      {/* Confirm Delete Dialog */}
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
                fetchCoupons();
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
