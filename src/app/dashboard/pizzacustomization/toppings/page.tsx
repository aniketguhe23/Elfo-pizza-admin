'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Topping {
  id: number;
  name: string;
  is_vegetarian: boolean;
  price: string;
  image_url: string;
  created_at: string;
}

interface ToppingResponse {
  data: Topping[];
}

interface ToppingFormData {
  name: string;
  price: string;
  is_vegetarian: boolean;
  image: FileList;
}

function ToppingsComponent(): JSX.Element {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Topping | null>(null);
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Topping | null>(null);

  const { apiGetToppings, apiCreateToppings, apiUpdateToppings ,apiDeleteToppings} = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ToppingFormData>();

  const fetchToppings = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<ToppingResponse>(apiGetToppings);
      setToppings(response.data?.data || []);
    } catch {
      toast.error('Error fetching toppings');
    }
  }, [apiGetToppings]);

  useEffect(() => {
    void fetchToppings();
  }, [fetchToppings]);

  const handleDialogOpen = (topping?: Topping): void => {
    setEditing(topping || null);
    reset({
      name: topping?.name || '',
      price: topping?.price || '',
      is_vegetarian: topping?.is_vegetarian || false,
    });
    setPreviewImage(topping?.image_url || null);
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditing(null);
    setPreviewImage(null);
    reset();
  };

  const handleDeleteClick = (item: Topping) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      await axios.delete(`${apiDeleteToppings}/${itemToDelete.id}`);
      toast.success('Topping deleted');
      await fetchToppings();
    } catch (err) {
      toast.error('Failed to delete topping');
    } finally {
      setLoading(false);
      handleDeleteClose();
    }
  };

  const onSubmit = async (data: ToppingFormData): Promise<void> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('is_vegetarian', String(data.is_vegetarian));

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      } else if (editing) {
        // Send existing image URL for update
        formData.append('image_url', editing.image_url);
      }

      if (editing) {
        await axios.put(`${apiUpdateToppings}/${editing.id}`, formData);
        toast.success('Topping updated');
      } else {
        await axios.post(apiCreateToppings, formData);
        toast.success('Topping created');
      }

      handleDialogClose();
      void fetchToppings();
    } catch (error) {
      toast.error('Error saving topping');
    } finally {
      setLoading(false);
    }
  };
  // trigger('image');

  const filtered = toppings.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Toppings
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search Toppings"
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
        You have {toppings.length} toppings
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Vegetarian</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((topping, index) => (
              <TableRow key={topping.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={topping.image_url} alt={topping.name} />
                </TableCell>
                <TableCell>{topping.name}</TableCell>
                <TableCell>₹{topping.price}</TableCell>
                <TableCell>{topping.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(topping.created_at).toISOString().split('T')[0]}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleDialogOpen(topping);
                    }}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(topping)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Topping Dialog */}
      <Dialog
        open={open}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(3px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {editing ? 'Edit Topping' : 'Add Topping'}
          </Typography>
          <IconButton onClick={handleDialogClose}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3, mt: 3 }}>
          <Box
            component="form"
            id="topping-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Topping Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Price (₹)</Box>
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

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Vegetarian?</Box>
              <Checkbox defaultChecked  {...register('is_vegetarian')} />
            </Box>

            {previewImage && (
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>Preview</Box>
                <Avatar
                  src={previewImage}
                  alt="Preview"
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  variant="rounded"
                />
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Upload Image</Box>
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{
                  width: 110,
                  fontSize: '0.75rem',
                  padding: '5px 10px',
                  backgroundColor: '#fff',
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#222',
                    color: '#fff',
                  },
                }}
              >
                Choose File
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  // ❌ REMOVE: {...register('image')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                      setValue('image', e.target.files as any); // ✅ store file list manually
                    }
                  }}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, pb: 2 }}>
          <Button
            onClick={handleDialogClose}
            sx={{
              minWidth: 70,
              fontSize: '0.75rem',
              px: 2,
              backgroundColor: '#fff',
              color: '#000',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              border: '1px solid #cccccc',
              '&:hover': {
                backgroundColor: '#f2f2f2',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="topping-form"
            variant="contained"
            sx={{
              minWidth: 70,
              fontSize: '0.75rem',
              px: 2,
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#222',
              },
            }}
          >
            {loading ? (editing ? 'Updating...' : 'Creating...') : editing ? 'Update' : 'Create'}{' '}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dleet diloge */}

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ToppingsComponent;
