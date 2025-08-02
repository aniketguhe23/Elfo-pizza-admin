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
}

interface FormData {
  name: string;
  price: number;
}

function DoughComponent(): JSX.Element {
  const [doughList, setDoughList] = useState<DoughType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDough, setEditingDough] = useState<DoughType | null>(null);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doughToDelete, setDoughToDelete] = useState<DoughType | null>(null);

  const { apiGetDough, apiCreateDough, apiUpdateDough, apiDeleteDough } = ProjectApiList();

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

  useEffect(() => {
    void fetchDough();
  }, [fetchDough]);

  const handleDialogOpen = (item?: DoughType): void => {
    setEditingDough(item ?? null);
    reset({
      name: item?.name || '',
      price: parseFloat(item?.price ?? '0'),
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
    } catch {
      toast.error('Error saving dough type');
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
            onChange={(e) => {
              setSearch(e.target.value);
            }}
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
            onClick={() => {
              handleDialogOpen();
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
                <TableCell colSpan={4} align="center">
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
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(2px)',
          },
        }}
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
