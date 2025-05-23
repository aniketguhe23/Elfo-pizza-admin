'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Pencil, Plus, Search, Table, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ListingTable } from './component/ListingTable';

interface SubCategory {
  id: number;
  name: string;
}

// Interfacess

interface Item {
  id: number;
  name: string;
  description: string;
  subcategory_id: number;
  is_vegetarian: boolean;
  is_available: boolean;
  image_url?: string;
  subcategoryName?: string;
}

const ItemsComponent = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const { api_getItems, api_createItem, api_updateItem, api_getSubCategories } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{
    name: string;
    description: string;
    subcategory_id: number;
    is_vegetarian: number;
    is_available: number;
    image_url: any;
  }>();

  const fetchItems = async () => {
    try {
      const response = await axios.get(api_getItems);
      const fetchedItems = response.data?.data || [];
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(api_getSubCategories);
      setSubCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredItems(items);
      return;
    }
    const lowerSearch = search.toLowerCase();
    const filtered = items.filter(
      (item) => item.name.toLowerCase().includes(lowerSearch) || item.description.toLowerCase().includes(lowerSearch)
    );
    setFilteredItems(filtered);
  }, [search, items]);

  const handleDialogOpen = (item?: any) => {
    setEditingItem(item || null);
    setImageFile(null);
    reset({
      name: item?.name || '',
      description: item?.description || '',
      subcategory_id: item?.subcategory_id ?? undefined,
      is_vegetarian: item?.is_vegetarian ?? false,
      is_available: item?.is_available ?? true,
    });
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingItem(null);
    setImageFile(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('subcategory_id', String(data.subcategory_id));
    formData.append('is_vegetarian', String(data.is_vegetarian));
    formData.append('is_available', String(data.is_available));

    if (data.image_url?.[0]) {
      formData.append('image', data.image_url[0]);
    }

    try {
      if (editingItem) {
        await axios.put(`${api_updateItem}/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(api_createItem, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      handleDialogClose();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const isVegetarian = watch('is_vegetarian');
  const isAvailable = watch('is_available');

  return (
    <Box mt={5}>
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Items
        </Typography>

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
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          Add New
        </Button>
      </Box> */}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Items
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Items"
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
              '&:hover': {
                backgroundColor: '#222',
              },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        You have {items.length} total categories
      </Typography>

      {/* Pass filteredItems to ListingTable */}
      <ListingTable data={filteredItems} onClick={handleDialogOpen} />

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
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="item-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {/* Item Name */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Item Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Item name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Box>

            {/* Description */}
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500, mt: '6px' }}>Description</Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Box>

            {/* Select Subcategory */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Subcategory</Box>
              <TextField
                select
                fullWidth
                size="small"
                {...register('subcategory_id', { required: 'Subcategory is required' })}
                error={!!errors.subcategory_id}
                helperText={errors.subcategory_id?.message}
              >
                {subCategories.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Image Preview */}
            {imageFile && (
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>Image Preview</Box>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Upload Image */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Upload Image</Box>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                }}
              />
            </Box>

            {/* Is Vegetarian */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Vegetarian</Box>
              <Checkbox
                checked={!!isVegetarian}
                onChange={(e) => setValue('is_vegetarian', e.target.checked ? 1 : 0)}
              />
            </Box>

            {/* Is Available */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Available</Box>
              <Checkbox checked={!!isAvailable} onChange={(e) => setValue('is_available', e.target.checked ? 1 : 0)} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            color="secondary"
            sx={{
              width: 90,
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
            Cancel
          </Button>
          <Button
            type="submit"
            form="item-form"
            variant="contained"
            sx={{
              width: 90,
              fontSize: '0.75rem',
              padding: '5px 10px',
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
            {editingItem ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemsComponent;
