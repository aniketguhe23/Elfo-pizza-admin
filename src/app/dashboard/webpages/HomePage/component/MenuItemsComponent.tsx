'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

// Define a strict type for menu item
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price_small: number | null;
  price_medium: number | null;
  price_large: number | null;
  image_url: string;
}

// Define form inputs type
interface MenuItemFormInputs {
  name: string;
  category: string;
  price_small: number | '';
  price_medium: number | '';
  price_large: number | '';
  image_url: FileList | null;
}

function MenuItemsComponent(): JSX.Element {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { apiGetMenuItemsData, apiAddMenuItemsData, apiUpdateMenuItemsData } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MenuItemFormInputs>();

  // Fetch menu items
  const fetchMenuItems = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: MenuItem[] }>(apiGetMenuItemsData);
      setMenuItems(res.data.data || []);
    } catch (err) {
      toast.error('Error fetching menu items');
    }
  }, [apiGetMenuItemsData]);

  // Run once on mount
  useEffect(() => {
    void fetchMenuItems();
  }, [fetchMenuItems]);

  // Open edit dialog and populate form
  const handleEdit = (item: MenuItem): void => {
    setEditingItem(item);
    reset({
      name: item.name,
      category: item.category,
      price_small: item.price_small ?? '',
      price_medium: item.price_medium ?? '',
      price_large: item.price_large ?? '',
      image_url: null,
    });
    setImagePreview(item.image_url);
    setOpen(true);
  };

  // Open add dialog and reset form
  const handleAdd = (): void => {
    setEditingItem(null);
    reset({
      name: '',
      category: '',
      price_small: '',
      price_medium: '',
      price_large: '',
      image_url: null,
    });
    setImagePreview(null);
    setOpen(true);
  };

  // Update image preview on file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('image_url', e.target.files);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // Submit handler for form
  const onSubmit: SubmitHandler<MenuItemFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price_small', data.price_small.toString());
    formData.append('price_medium', data.price_medium.toString());
    formData.append('price_large', data.price_large.toString());

    if (data.image_url && data.image_url.length > 0) {
      formData.append('file', data.image_url[0]);
    }

    try {
      if (editingItem) {
        await axios.put(`${apiUpdateMenuItemsData}/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(apiAddMenuItemsData, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setOpen(false);
      await fetchMenuItems();
    } catch (err) {
      toast.error('Error saving menu item');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Menu Items
        </Typography>
        <Button variant="contained" onClick={handleAdd}>
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Small (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Medium (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Large (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                    }}
                  />
                </TableCell>
                <TableCell>{item.name || <Typography color="textSecondary">-</Typography>}</TableCell>
                <TableCell>{item.category || <Typography color="textSecondary">-</Typography>}</TableCell>
                <TableCell>
                  {item.price_small !== null ? (
                    `₹${item.price_small}`
                  ) : (
                    <Typography color="textSecondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.price_medium !== null ? (
                    `₹${item.price_medium}`
                  ) : (
                    <Typography color="textSecondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.price_large !== null ? (
                    `₹${item.price_large}`
                  ) : (
                    <Typography color="textSecondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="menu-item-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Name"
              fullWidth
              {...register('name', { required: 'Name is required' })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />

            <TextField
              label="Category"
              fullWidth
              {...register('category', { required: 'Category is required' })}
              error={Boolean(errors.category)}
              helperText={errors.category?.message}
            />

            <TextField
              label="Price (Small)"
              type="number"
              fullWidth
              {...register('price_small', { valueAsNumber: true })}
            />

            <TextField
              label="Price (Medium)"
              type="number"
              fullWidth
              {...register('price_medium', { valueAsNumber: true })}
            />

            <TextField
              label="Price (Large)"
              type="number"
              fullWidth
              {...register('price_large', { valueAsNumber: true })}
            />

            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Upload Image
              </Typography>
              <input type="file" accept="image/*" {...register('image_url')} onChange={handleImageChange} />
              {Boolean(imagePreview) && (
                <Box mt={2} textAlign="center">
                  <img
                    src={imagePreview ?? ''}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button type="submit" form="menu-item-form" variant="contained">
            {editingItem ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MenuItemsComponent;
