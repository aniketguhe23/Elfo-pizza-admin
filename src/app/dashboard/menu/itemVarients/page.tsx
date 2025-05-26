'use client';

import React, { useCallback, useEffect, useState, type JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios, { type AxiosResponse } from 'axios';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Item {
  id: number;
  name: string;
}

interface ItemVariant {
  variantId: number;
  item_id: number;
  size: string;
  crustType: string;
  price: number;
  itemName?: string;
}

interface FormData {
  item_id: number;
  size: string;
  crustType: string;
  price: number;
}

function ItemVariantComponent(): JSX.Element {
  const [variants, setVariants] = useState<ItemVariant[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { apiGetItemVariants, apiCreateItemVariant, apiUpdateItemVariant, apiGetItems } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Wrapped fetch functions with useCallback to add to dependency array
  const fetchVariants = useCallback(async (): Promise<void> => {
    try {
      const res: AxiosResponse<{ data: ItemVariant[] }> = await axios.get(apiGetItemVariants);
      setVariants(res.data.data);
    } catch {
      // Handle error silently or add your error handling here
    }
  }, [apiGetItemVariants]);

  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const res: AxiosResponse<{ data: Item[] }> = await axios.get(apiGetItems);
      setItems(res.data.data);
    } catch {
      // Handle error silently or add your error handling here
    }
  }, [apiGetItems]);

  useEffect(() => {
    void fetchVariants();
    void fetchItems();
  }, [fetchVariants, fetchItems]);

  const handleDialogOpen = (variant?: ItemVariant): void => {
    setEditingVariant(variant ?? null);
    reset({
      item_id: variant?.item_id ?? undefined,
      size: variant?.size ?? '',
      crustType: variant?.crustType ?? '',
      price: variant?.price ?? undefined,
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    reset();
    setEditingVariant(null);
    setOpen(false);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (editingVariant) {
        await axios.put(`${apiUpdateItemVariant}/${editingVariant.variantId}`, data);
      } else {
        await axios.post(apiCreateItemVariant, data);
      }
      handleDialogClose();
      await fetchVariants();
    } catch {
      // Handle error silently or add your error handling here
    }
  };

  const filteredVariants = variants.filter(
    (v) =>
      (v.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      v.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.crustType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Item Variants
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search variants"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
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
        You have {variants.length} total variants
      </Typography>

      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Crust</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVariants.length > 0 ? (
              filteredVariants.map((sub, index) => {
                return (
                  <TableRow key={sub.variantId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sub.itemName}</TableCell>
                    <TableCell>{sub.size}</TableCell>
                    <TableCell>{sub.crustType}</TableCell>
                    <TableCell>₹{sub.price}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          handleDialogOpen(sub);
                        }}
                      >
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          // Placeholder for delete handler
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No item variants found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <DialogTitle>{editingVariant ? 'Edit Variant' : 'Add Variant'}</DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="variant-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            {/* Select Item */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Select Item</Box>
              <TextField
                select
                fullWidth
                {...register('item_id', { required: 'Item is required' })}
                error={Boolean(errors.item_id)}
                helperText={errors.item_id?.message}
                size="small"
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Size</Box>
              <TextField
                fullWidth
                {...register('size', { required: 'Size is required' })}
                error={Boolean(errors.size)}
                helperText={errors.size?.message}
                size="small"
              />
            </Box>

            {/* Crust Type */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Crust Type</Box>
              <TextField
                fullWidth
                {...register('crustType', { required: 'Crust type is required' })}
                error={Boolean(errors.crustType)}
                helperText={errors.crustType?.message}
                size="small"
              />
            </Box>

            {/* Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Price (₹)</Box>
              <TextField
                type="number"
                fullWidth
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Price must be a positive number' },
                })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button form="variant-form" type="submit" variant="contained" sx={{ textTransform: 'none' }}>
            {editingVariant ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ItemVariantComponent;
