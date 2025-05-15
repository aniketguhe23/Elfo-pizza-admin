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
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

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

const ItemsComponent = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      setItems(response.data?.data || []);
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
    console.log(data, 'data=========>');

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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Items
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleDialogOpen()}
          sx={{
            backgroundColor: '#635bff',
            color: '#fff',
            fontSize: '14px',
            padding: '6px 16px',
            borderRadius: '4px',
            gap: '8px',
            '&:hover': {
              backgroundColor: '#3d33ff',
            },
          }}
        >
          <Plus height={17} />
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>S. No</strong>
              </TableCell>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Subcategory</strong>
              </TableCell>
              <TableCell>
                <strong>Veg</strong>
              </TableCell>
              <TableCell>
                <strong>Available</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: any, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.subcategoryName || '-'}</TableCell>
                <TableCell>{item.isVegetarian == 1 || item.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.isAvailable == 1 || item.is_available ? 'Yes' : 'No'}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDialogOpen(item)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
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
            <TextField
              label="Item Name"
              fullWidth
              {...register('name', { required: 'Item name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              label="Select Subcategory"
              select
              fullWidth
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
            {/* Image Preview */}
            {imageFile && (
              <Box>
                <Typography variant="body2" mb={1}>
                  Image Preview:
                </Typography>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              {...register('image_url')}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!isVegetarian}
                  onChange={(e) => setValue('is_vegetarian', e.target.checked ? 1 : 0)}
                />
              }
              label="Is Vegetarian"
            />{' '}
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!isAvailable}
                  onChange={(e) => setValue('is_available', e.target.checked ? 1 : 0)}
                />
              }
              label="Is Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="item-form" variant="contained">
            {editingItem ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemsComponent;
