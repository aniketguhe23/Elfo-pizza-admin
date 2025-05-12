'use client';

import React, { useEffect, useState } from 'react';
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

const MenuItemsComponent = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { api_getMenuItemsData, api_addMenuItemsData, api_updateMenuItemsData } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(api_getMenuItemsData);
      setMenuItems(res?.data?.data || []);
    } catch (err) {
      console.error('Error fetching menu items', err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    reset({
      name: item.name,
      category: item.category,
      price_small: item.price_small,
      price_medium: item.price_medium,
      price_large: item.price_large,
      image_url: '',
    });
    setOpen(true);
    setImagePreview(item.image_url); // Set the preview image when editing
  };

  const handleAdd = () => {
    setEditingItem(null);
    reset({
      name: '',
      category: '',
      price_small: '',
      price_medium: '',
      price_large: '',
      image_url: null,
    });
    setOpen(true);
    setImagePreview(null); // Clear preview image when adding new item
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image_url', file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price_small', data.price_small);
    formData.append('price_medium', data.price_medium);
    formData.append('price_large', data.price_large);
    if (data.image_url?.[0]) {
      formData.append('file', data.image_url[0]);
    }

    try {
      if (editingItem) {
        await axios.put(`${api_updateMenuItemsData}/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(api_addMenuItemsData, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setOpen(false);
      fetchMenuItems();
    } catch (err) {
      console.error('Error saving menu item', err);
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
                <TableCell>
                  {item.name ? (
                    item.name
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -{' '}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.category ? (
                    item.category
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -{' '}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.price_small ? (
                    `₹${item.price_small}`
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -{' '}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.price_medium ? (
                    `₹${item.price_medium}`
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -{' '}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.price_large ? (
                    `₹${item.price_large}`
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -{' '}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
              error={!!errors.name}
            />

            <TextField
              label="Category"
              fullWidth
              {...register('category', { required: 'Category is required' })}
              error={!!errors.category}
            />

            <TextField label="Price (Small)" type="number" fullWidth {...register('price_small')} />

            <TextField label="Price (Medium)" type="number" fullWidth {...register('price_medium')} />

            <TextField label="Price (Large)" type="number" fullWidth {...register('price_large')} />

            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Upload Image
              </Typography>
              <input type="file" accept="image/*" {...register('image_url')} onChange={handleImageChange} />
              {imagePreview && (
                <Box mt={2} textAlign="center">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="menu-item-form" variant="contained">
            {editingItem ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuItemsComponent;
