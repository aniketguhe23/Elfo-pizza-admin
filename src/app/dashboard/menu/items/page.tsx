'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios'; // Removed AxiosResponse import, only used as type
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ListingTable } from './component/ListingTable';

interface SubCategory {
  id: number;
  name: string;
}

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

interface FormData {
  name: string;
  description: string;
  subcategory_id: number;
  is_vegetarian: number;
  is_available: number;
  image_url: FileList;
}

function ItemsComponent(): JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const { apiGetItems, apiCreateItem, apiUpdateItem, apiGetSubCategories } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Wrap fetch functions in useCallback to fix missing dependencies warning
  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<{ data: Item[] }>(apiGetItems);
      const fetchedItems = response.data.data || [];
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
    } catch (error) {
      // Optionally log to error tracking service
    }
  }, [apiGetItems]);

  const fetchSubCategories = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<{ data: SubCategory[] }>(apiGetSubCategories);
      const fetchedSubCategories = response.data.data || [];
      setSubCategories(fetchedSubCategories);
    } catch (error) {
      // Optionally log to error tracking service
    }
  }, [apiGetSubCategories]);

  useEffect(() => {
    void fetchItems();
    void fetchSubCategories();
  }, [fetchItems, fetchSubCategories]);

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

  const handleDialogOpen = (item?: Item): void => {
    setEditingItem(item || null);
    setImageFile(null);
    reset({
      name: item?.name || '',
      description: item?.description || '',
      subcategory_id: item?.subcategory_id ?? 0,
      is_vegetarian: item?.is_vegetarian ? 1 : 0,
      is_available: item?.is_available ? 1 : 0,
      image_url: undefined as unknown as FileList, // to satisfy TS, won't be used for reset
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingItem(null);
    setImageFile(null);
    reset();
  };

  const onSubmit = async (data: FormData): Promise<void> => {
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
        await axios.put(`${apiUpdateItem}/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(apiCreateItem, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      handleDialogClose();
      await fetchItems();
    } catch (error) {
      // Optionally log to error tracking service
    }
  };

  const isVegetarian = watch('is_vegetarian');
  const isAvailable = watch('is_available');

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Items
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Items"
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
        You have {items.length} total categories
      </Typography>

      <ListingTable
        data={filteredItems}
        onClick={(item) => {
          handleDialogOpen(item as Item);
        }}
      />

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
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Item Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Item name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            <Box display="flex" alignItems="flex-start" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500, mt: '6px' }}>Description</Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register('description', { required: 'Description is required' })}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Subcategory</Box>
              <TextField
                select
                fullWidth
                size="small"
                {...register('subcategory_id', { required: 'Subcategory is required' })}
                error={Boolean(errors.subcategory_id)}
                helperText={errors.subcategory_id?.message}
              >
                {subCategories.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {imageFile instanceof File && (
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>Image Preview</Box>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Upload Image</Box>
              <input
                type="file"
                accept="image/*"
                {...register('image_url')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                  }
                }}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Vegetarian</Box>
              <Checkbox
                checked={Boolean(isVegetarian)}
                onChange={(e) => {
                  setValue('is_vegetarian', e.target.checked ? 1 : 0);
                }}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Is Available</Box>
              <Checkbox
                checked={Boolean(isAvailable)}
                onChange={(e) => {
                  setValue('is_available', e.target.checked ? 1 : 0);
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3 }}>
          <Button onClick={handleDialogClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="item-form" variant="contained" color="primary">
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ItemsComponent;
