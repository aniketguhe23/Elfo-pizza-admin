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
  MenuItem,
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
  light_price: string;
  regular_price: string;
  extra_price: string;
  pizza_size: string | null;
  image_url: string;
  created_at: string;
}

interface ToppingResponse {
  data: Topping[];
}

interface PizzaSize {
  id: number;
  name: string;
}

interface PizzaSizeResponse {
  data: PizzaSize[];
}

interface ToppingFormData {
  name: string;
  price: string;
  light_price: string;
  regular_price: string;
  extra_price: string;
  pizza_size: string;
  is_vegetarian: boolean;
  image: FileList;
}

function ToppingsComponent(): JSX.Element {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [pizzaSizes, setPizzaSizes] = useState<PizzaSize[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Topping | null>(null);
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Topping | null>(null);

  const { apiGetToppings, apiCreateToppings, apiUpdateToppings, apiDeleteToppings, apiGetBreadSize } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ToppingFormData>({
    defaultValues: {
      is_vegetarian: true, // ✅ Checked by default
    },
  });

  const fetchToppings = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<ToppingResponse>(apiGetToppings);
      setToppings(response.data?.data || []);
    } catch {
      toast.error('Error fetching toppings');
    }
  }, [apiGetToppings]);

  const fetchPizzaSizes = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<PizzaSizeResponse>(apiGetBreadSize);
      setPizzaSizes(response.data?.data || []);
    } catch {
      toast.error('Error fetching pizza sizes');
    }
  }, [apiGetBreadSize]);

  useEffect(() => {
    void fetchToppings();
    void fetchPizzaSizes();
  }, [fetchToppings, fetchPizzaSizes]);

  const handleDialogOpen = (topping?: Topping): void => {
    setEditing(topping || null);
    reset({
      name: topping?.name || '',
      // price: topping?.price || '',
      light_price: topping?.light_price || '',
      regular_price: topping?.regular_price || '',
      extra_price: topping?.extra_price || '',
      pizza_size: topping?.pizza_size || '',
      is_vegetarian: topping?.is_vegetarian || true,
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
    } catch {
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
      formData.append('light_price', data.light_price);
      formData.append('regular_price', data.regular_price);
      formData.append('extra_price', data.extra_price);
      formData.append('pizza_size', data.pizza_size);
      formData.append('is_vegetarian', String(data.is_vegetarian));

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      } else if (editing) {
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
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Error saving topping');
      } else {
        toast.error('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = toppings.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box mt={5}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Toppings
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search Toppings"
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
        You have {toppings.length} toppings
      </Typography>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Pizza Size</TableCell>
              {/* <TableCell>Price</TableCell> */}
              <TableCell>Light Price</TableCell>
              <TableCell>Regular Price</TableCell>
              <TableCell>Extra Price</TableCell>
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
                <TableCell>{topping.pizza_size}</TableCell>
                {/* <TableCell>₹{topping.price}</TableCell> */}
                <TableCell>₹{topping.light_price}</TableCell>
                <TableCell>₹{topping.regular_price}</TableCell>
                <TableCell>₹{topping.extra_price}</TableCell>
                <TableCell>{topping.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(topping.created_at).toISOString().split('T')[0]}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(topping)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            {/* Pizza Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Pizza Size</Box>
              <TextField
                select
                fullWidth
                size="small"
                {...register('pizza_size', { required: 'Pizza size is required' })}
                error={Boolean(errors.pizza_size)}
                helperText={errors.pizza_size?.message}
              >
                {pizzaSizes.map((size) => (
                  <MenuItem key={size.id} value={size.name}>
                    {size.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Name */}
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

            {/* Prices */}
            {[
              // { label: 'Price (₹)', name: 'price' },
              { label: 'Light Price (₹)', name: 'light_price' },
              { label: 'Regular Price (₹)', name: 'regular_price' },
              { label: 'Extra Price (₹)', name: 'extra_price' },
            ].map((field) => (
              <Box key={field.name} display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>{field.label}</Box>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                  {...register(field.name as keyof ToppingFormData, { required: `${field.label} is required` })}
                  error={Boolean(errors[field.name as keyof ToppingFormData])}
                  helperText={errors[field.name as keyof ToppingFormData]?.message as string}
                />
              </Box>
            ))}

            {/* Vegetarian */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Vegetarian?</Box>
              {/* <Checkbox {...register('is_vegetarian')} checked={watch('is_vegetarian')} /> */}
              <Checkbox
                {...register('is_vegetarian')}
                checked={watch('is_vegetarian')}
                onChange={(e) => setValue('is_vegetarian', e.target.checked)}
              />
            </Box>

            {/* Preview */}
            {previewImage && (
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>Preview</Box>
                <Avatar
                  src={previewImage}
                  alt="Preview"
                  sx={{ width: 70, height: 70, borderRadius: 2 }}
                  variant="rounded"
                />
              </Box>
            )}

            {/* Upload Image */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Upload Image</Box>
              <Button variant="outlined" component="label" size="small">
                Choose File
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                      setValue('image', e.target.files as any);
                    }
                  }}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ backgroundColor: '#fff', color: '#000' }}>
            Cancel
          </Button>
          <Button type="submit" form="topping-form" variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }}>
            {loading ? (editing ? 'Updating...' : 'Creating...') : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
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
