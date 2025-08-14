'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
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
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface CheeseOption {
  id: number;
  name: string;
  price: string;
  image_url: string;
  is_vegan: boolean;
  pizza_size: string;
  light_price: string;
  regular_price: string;
  extra_price: string;
  created_at: string;
}

interface BreadSize {
  id: number;
  name: string;
}

function CategoryComponent(): React.JSX.Element {
  const [cheeseOptions, setCheeseOptions] = useState<CheeseOption[]>([]);
  const [breadSizes, setBreadSizes] = useState<BreadSize[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingCheese, setEditingCheese] = useState<CheeseOption | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCheese, setDeleteCheese] = useState<CheeseOption | null>(null);

  const {
    apiGetCheeseOptions,
    apiCreateCheeseOptions,
    apiUpdateCheeseOptions,
    apiDeleteCheeseOptions,
    apiGetBreadSize,
  } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<Omit<CheeseOption, 'id' | 'created_at'>>({
    defaultValues: {
      is_vegan: true,
      pizza_size: '',
      light_price: '',
      regular_price: '',
      extra_price: '',
    },
  });

  // Fetch cheese options
  const fetchCheeseOptions = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: CheeseOption[] }>(apiGetCheeseOptions);
      setCheeseOptions(res.data.data || []);
    } catch {
      toast.error('Error fetching cheese options');
    }
  }, [apiGetCheeseOptions]);

  // Fetch bread sizes
  const fetchBreadSizes = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: BreadSize[] }>(apiGetBreadSize);
      setBreadSizes(res.data.data || []);
    } catch {
      toast.error('Error fetching bread sizes');
    }
  }, [apiGetBreadSize]);

  useEffect((): void => {
    void fetchCheeseOptions();
    void fetchBreadSizes();
  }, [fetchCheeseOptions, fetchBreadSizes]);

  const handleDialogOpen = (cheese?: CheeseOption): void => {
    setEditingCheese(cheese || null);
    reset({
      name: cheese?.name || '',
      price: cheese?.price || '',
      is_vegan: cheese?.is_vegan ?? true,
      image_url: cheese?.image_url || '',
      pizza_size: cheese?.pizza_size || '',
      light_price: cheese?.light_price || '',
      regular_price: cheese?.regular_price || '',
      extra_price: cheese?.extra_price || '',
    });
    setImagePreview(cheese?.image_url || '');
    setSelectedImage(null);
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingCheese(null);
    reset();
    setSelectedImage(null);
    setImagePreview('');
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteDialogOpen = (cheese: CheeseOption): void => {
    setDeleteCheese(cheese);
    setDeleteOpen(true);
  };

  const handleDeleteDialogClose = (): void => {
    setDeleteCheese(null);
    setDeleteOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteCheese) return;
    try {
      await axios.delete(`${apiDeleteCheeseOptions}/${deleteCheese.id}`);
      toast.success('Cheese option deleted');
      handleDeleteDialogClose();
      await fetchCheeseOptions();
    } catch {
      toast.error('Error deleting cheese option');
    }
  };

  const onSubmit = async (data: Omit<CheeseOption, 'id' | 'created_at'>): Promise<void> => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      // formData.append('price', data.price);
      formData.append('is_vegan', String(data.is_vegan));
      formData.append('pizza_size', data.pizza_size);
      formData.append('light_price', data.light_price);
      formData.append('regular_price', data.regular_price);
      formData.append('extra_price', data.extra_price);

      if (selectedImage) formData.append('image', selectedImage);
      else formData.append('image_url', data.image_url);

      if (editingCheese) {
        await axios.put(`${apiUpdateCheeseOptions}/${editingCheese.id}`, formData);
        toast.success('Cheese option updated');
      } else {
        await axios.post(apiCreateCheeseOptions, formData);
        toast.success('Cheese option created');
      }

      handleDialogClose();
      await fetchCheeseOptions();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Error saving cheese option';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = cheeseOptions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box mt={5}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Cheese Options
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Cheese"
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
            sx={{ backgroundColor: '#000', color: '#fff', textTransform: 'none' }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              {/* <TableCell>Price</TableCell> */}
              <TableCell>Pizza Size</TableCell>
              <TableCell>Light</TableCell>
              <TableCell>Regular</TableCell>
              <TableCell>Extra</TableCell>
              <TableCell>Vegan</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <img src={item.image_url} alt={item.name} width={50} height={50} style={{ borderRadius: 8 }} />
                </TableCell>
                {/* <TableCell>₹{item.price}</TableCell> */}
                <TableCell>{item.pizza_size}</TableCell>
                <TableCell>₹{item.light_price}</TableCell>
                <TableCell>₹{item.regular_price}</TableCell>
                <TableCell>₹{item.extra_price}</TableCell>
                <TableCell>{item.is_vegan ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.created_at.split('T')[0]}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(item)}>
                    <Pencil size={16} />
                  </IconButton>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteDialogOpen(item)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingCheese ? 'Edit Cheese' : 'Add Cheese'}</DialogTitle>
        <DialogContent sx={{ px: 3, py: 3, mt: 1 }}>
          <Box
            component="form"
            id="cheese-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {/* Name */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Cheese Name</Typography>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            {/* Price */}
            {/* <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Price (₹)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('price', { required: 'Price is required' })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </Box> */}

            {/* Pizza Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Pizza Size</Typography>
              <TextField
                select
                fullWidth
                size="small"
                {...register('pizza_size', { required: 'Pizza size is required' })}
                error={Boolean(errors.pizza_size)}
                helperText={errors.pizza_size?.message}
              >
                {breadSizes.map((size) => (
                  <MenuItem key={size.id} value={size.name}>
                    {size.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Light Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Light Price (₹)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('light_price', { required: 'Light price is required' })}
                error={Boolean(errors.light_price)}
                helperText={errors.light_price?.message}
              />
            </Box>

            {/* Regular Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Regular Price (₹)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('regular_price', { required: 'Regular price is required' })}
                error={Boolean(errors.regular_price)}
                helperText={errors.regular_price?.message}
              />
            </Box>

            {/* Extra Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Extra Price (₹)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('extra_price', { required: 'Extra price is required' })}
                error={Boolean(errors.extra_price)}
                helperText={errors.extra_price?.message}
              />
            </Box>

            {/* Vegan */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Is Vegan?</Typography>
              <Checkbox
                {...register('is_vegan')}
                checked={watch('is_vegan')}
                onChange={(e) => setValue('is_vegan', e.target.checked)}
              />
            </Box>

            {/* Upload */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography width="150px">Image</Typography>
              <Box>
                <Button variant="outlined" component="label" size="small">
                  Choose Image
                  <input hidden type="file" accept="image/*" onChange={onImageChange} />
                </Button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit" form="cheese-form" variant="contained" disabled={isLoading}>
            {isLoading ? (editingCheese ? 'Updating...' : 'Saving...') : editingCheese ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Cheese Option</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteCheese?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryComponent;
