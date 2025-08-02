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
  created_at: string;
}

function CategoryComponent(): React.JSX.Element {
  const [cheeseOptions, setCheeseOptions] = useState<CheeseOption[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingCheese, setEditingCheese] = useState<CheeseOption | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCheese, setDeleteCheese] = useState<CheeseOption | null>(null);

  const { apiGetCheeseOptions, apiCreateCheeseOptions, apiUpdateCheeseOptions,apiDeleteCheeseOptions } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Omit<CheeseOption, 'id' | 'created_at'>>({ defaultValues: {
    is_vegan: true, // ✅ Default to checked
  },});

  const fetchCheeseOptions = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: CheeseOption[] }>(apiGetCheeseOptions);
      setCheeseOptions(res.data.data || []);
    } catch {
      toast.error('Error fetching cheese options');
    }
  }, [apiGetCheeseOptions]);

  useEffect((): void => {
    void fetchCheeseOptions();
  }, [fetchCheeseOptions]);

  const handleDialogOpen = (cheese?: CheeseOption): void => {
    setEditingCheese(cheese || null);
    reset({
      name: cheese?.name || '',
      price: cheese?.price || '',
      is_vegan: cheese?.is_vegan || false,
      image_url: cheese?.image_url || '',
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
      await fetchCheeseOptions(); // refresh list
    } catch (error) {
      toast.error('Error deleting cheese option');
    }
  };

  const onSubmit = async (data: Omit<CheeseOption, 'id' | 'created_at'>): Promise<void> => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('is_vegan', String(data.is_vegan));
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
    } catch {
      toast.error('Error saving cheese option');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = cheeseOptions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Cheese Options
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Cheese"
            value={search}
            onChange={(e): void => {
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
            onClick={(): void => {
              handleDialogOpen();
            }}
            sx={{ backgroundColor: '#000', color: '#fff', textTransform: 'none' }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Price</TableCell>
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
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.is_vegan ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.created_at.split('T')[0]}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(): void => {
                      handleDialogOpen(item);
                    }}
                  >
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

      <Dialog
        open={open}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.7)',
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
            {editingCheese ? 'Edit Cheese' : 'Add Cheese'}
          </Typography>
          <IconButton onClick={handleDialogClose} />
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3, mt: 3 }}>
          <Box
            component="form"
            id="cheese-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Cheese Name</Box>
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
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('price', { required: 'Price is required' })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </Box>

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
                <input hidden type="file" accept="image/*" onChange={onImageChange} />
              </Button>
            </Box>

            {imagePreview && (
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>Preview</Box>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                />
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Vegan?</Box>
              <Checkbox
                {...register('is_vegan')}
                defaultChecked={editingCheese?.is_vegan || true}
                onChange={(e): void => {
                  setValue('is_vegan', e.target.checked);
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, pb: 2 }}>
          <Button
            onClick={handleDialogClose}
            disabled={isLoading}
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
            form="cheese-form"
            variant="contained"
            disabled={isLoading}
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
            {isLoading ? (editingCheese ? 'Updating...' : 'Saving...') : editingCheese ? 'Update' : 'Save'}
          </Button>

          {/* <Button
            type="submit"
            form="cheese-form"
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
            {editingCheese ? 'Update' : 'Save'}
          </Button> */}
        </DialogActions>
      </Dialog>

      {/* delete modal */}
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
