'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ProjectApiList from '@/app/api/ProjectApiList';

interface Item {
  id: number;
  name: string;
}

interface ItemVariant {
  id: number;
  item_id: number;
  size: string;
  crust_type: string;
  price: number;
  itemName?: string;
  variantId?: any;
}

const ItemVariantComponent = () => {
  const [variants, setVariants] = useState<ItemVariant[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(null);

  const {
    api_getItemVariants,
    api_createItemVariant,
    api_updateItemVariant,
    api_getItems,
  } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{
    item_id: number;
    size: string;
    crust_type: string;
    price: number;
  }>();

  const fetchVariants = async () => {
    try {
      const res = await axios.get(api_getItemVariants);
      setVariants(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching variants:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(api_getItems);
      setItems(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchVariants();
    fetchItems();
  }, []);

  const handleDialogOpen = (variant?: ItemVariant) => {
    setEditingVariant(variant || null);
    reset({
      item_id: variant?.item_id ?? undefined,
      size: variant?.size || '',
      crust_type: variant?.crust_type || '',
      price: variant?.price ?? undefined,
    });
    setOpen(true);
  };

  const handleDialogClose = () => {
    reset();
    setEditingVariant(null);
    setOpen(false);
  };

  const onSubmit = async (data: any) => {

    try {
      if (editingVariant) {
        await axios.put(`${api_updateItemVariant}/${editingVariant?.variantId}`, data);
      } else {
        await axios.post(api_createItemVariant, data);
      }
      handleDialogClose();
      fetchVariants();
    } catch (err) {
      console.error('Error saving variant:', err);
    }
  };

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Item Variants
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
            '&:hover': { backgroundColor: '#3d33ff' },
          }}
        >
          <Plus height={17} />
          Add Variant
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>S. No</strong></TableCell>
              <TableCell><strong>Item</strong></TableCell>
              <TableCell><strong>Size</strong></TableCell>
              <TableCell><strong>Crust Type</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((variant:any, index) => (
              <TableRow key={variant.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{variant.itemName || '-'}</TableCell>
                <TableCell>{variant.size}</TableCell>
                <TableCell>{variant.crustType}</TableCell>
                <TableCell>₹{variant.price}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" size="small" onClick={() => handleDialogOpen(variant)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingVariant ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="variant-form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              label="Select Item"
              fullWidth
              {...register('item_id', { required: 'Item is required' })}
              error={!!errors.item_id}
              helperText={errors.item_id?.message}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Size"
              fullWidth
              {...register('size', { required: 'Size is required' })}
              error={!!errors.size}
              helperText={errors.size?.message}
            />

            <TextField
              label="Crust Type"
              fullWidth
              {...register('crust_type', { required: 'Crust type is required' })}
              error={!!errors.crust_type}
              helperText={errors.crust_type?.message}
            />

            <TextField
              type="number"
              label="Price (₹)"
              fullWidth
              {...register('price', {
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Price must be a positive number' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="variant-form" variant="contained">
            {editingVariant ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemVariantComponent;
