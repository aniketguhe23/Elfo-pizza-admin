'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProjectApiList from '@/app/api/ProjectApiList';

interface DoughType {
  id: number;
  name: string;
  price: string;
  pizza_size?: string;
}

interface BreadSize {
  id: number;
  name: string; // Assuming bread size has a "name" field
}

interface FormData {
  name: string;
  price: number;
  pizza_size: string;
}

function DoughComponent(): JSX.Element {
  const [doughList, setDoughList] = useState<DoughType[]>([]);
  const [breadSizes, setBreadSizes] = useState<BreadSize[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDough, setEditingDough] = useState<DoughType | null>(null);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doughToDelete, setDoughToDelete] = useState<DoughType | null>(null);

  const {
    apiGetDough,
    apiCreateDough,
    apiUpdateDough,
    apiDeleteDough,
    apiGetBreadSize,
  } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const fetchDough = useCallback(async () => {
    try {
      const response = await axios.get<{ data: DoughType[] }>(apiGetDough);
      setDoughList(response.data.data);
    } catch {
      toast.error('Failed to fetch dough types');
    }
  }, [apiGetDough]);

  const fetchBreadSizes = useCallback(async () => {
    try {
      const response = await axios.get<{ data: BreadSize[] }>(apiGetBreadSize);
      setBreadSizes(response.data.data);
    } catch {
      toast.error('Failed to fetch bread sizes');
    }
  }, [apiGetBreadSize]);

  useEffect(() => {
    void fetchDough();
    void fetchBreadSizes();
  }, [fetchDough, fetchBreadSizes]);

  const handleDialogOpen = (item?: DoughType): void => {
    setEditingDough(item ?? null);
    reset({
      name: item?.name || '',
      price: parseFloat(item?.price ?? '0'),
      pizza_size: item?.pizza_size || '',
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setEditingDough(null);
    reset();
    setOpen(false);
  };

const onSubmit = async (data: FormData): Promise<void> => {
  try {
    if (editingDough) {
      await axios.put(`${apiUpdateDough}/${editingDough.id}`, data);
    } else {
      await axios.post(apiCreateDough, data);
    }
    handleDialogClose();
    await fetchDough();
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.response?.data?.error || err.message || "Error saving dough type";
    toast.error(message);
    console.error("Error saving dough type:", err);
  }
};


  const handleDeleteClick = (dough: DoughType): void => {
    setDoughToDelete(dough);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!doughToDelete) return;

    try {
      await axios.delete(`${apiDeleteDough}/${doughToDelete.id}`);
      toast.success('Dough type deleted');
      setDeleteDialogOpen(false);
      setDoughToDelete(null);
      await fetchDough();
    } catch {
      toast.error('Failed to delete dough type');
    }
  };

  const filteredList = doughList.filter((dough) =>
    dough.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Dough Types
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search Dough"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => handleDialogOpen()}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        You have {doughList.length} dough types
      </Typography>

      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Pizza Size</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.length > 0 ? (
              filteredList.map((dough, index) => (
                <TableRow key={dough.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{dough.name}</TableCell>
                  <TableCell>₹{dough.price}</TableCell>
                  <TableCell>{dough.pizza_size || '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDialogOpen(dough)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(dough)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No dough types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingDough ? 'Edit Dough Type' : 'Add Dough Type'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            id="dough-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            {/* Name */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            {/* Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Price</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('price', { required: 'Price is required' })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </Box>

            {/* Pizza Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Pizza Size</Box>
              <Select
                fullWidth
                size="small"
                defaultValue=""
                {...register('pizza_size', { required: 'Pizza size is required' })}
                error={Boolean(errors.pizza_size)}
              >
                <MenuItem value="">Select Size</MenuItem>
                {breadSizes.map((size) => (
                  <MenuItem key={size.id} value={size.name}>
                    {size.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.pizza_size && (
                <Typography variant="caption" color="error">
                  {errors.pizza_size.message}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3 }}>
          <Button onClick={handleDialogClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="dough-form" variant="contained" color="primary">
            {editingDough ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{' '}
          <strong>{doughToDelete?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DoughComponent;
