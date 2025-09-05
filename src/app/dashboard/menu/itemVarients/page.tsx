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
  Stack,
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
import { toast } from 'react-toastify';

interface Item {
  id: number;
  name: string;
  itemName: string;
}

interface ItemVariant {
  variantId: number;
  item_id: number;
  size: string;
  crustType: string;
  price: number;
  itemName?: string;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
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
  const [deletingVariant, setDeletingVariant] = useState<ItemVariant | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const { apiGetItemVariants, apiCreateItemVariant, apiUpdateItemVariant, apiGetItems, apiDeleteItemVariant } =
    ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();


  // Wrapped fetch functions with useCallback to add to dependency array
const fetchVariants = useCallback(async (): Promise<void> => {
  setLoading(true);
  try {
    const res: AxiosResponse<{
      data: ItemVariant[];
      pagination: { totalPages: number; totalItems: number; currentPage: number; totalCount: number };
    }> = await axios.get(`${apiGetItemVariants}?page=${page}&limit=${limit}`);

    setVariants(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
    setTotalCount(res.data.pagination.totalCount);
  } catch (err) {
    console.error('Failed to fetch item variants', err);
  } finally {
    setLoading(false);
  }
}, [apiGetItemVariants, page, limit]); // ✅ Add page and limit here


  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const res: AxiosResponse<{ data: Item[] }> = await axios.get(apiGetItems);
      setItems(res.data.data);
    } catch {
      // Handle error silently or add your error handling here
    }
  }, [apiGetItems]);

useEffect(() => {
  fetchVariants();
}, [fetchVariants]);

  useEffect(() => {
    // fetchVariants();
    fetchItems();
  }, [fetchVariants, fetchItems, page]);

  const handleDialogOpen = (variant?: ItemVariant): void => {
    setEditingVariant(variant ?? null);
    reset({
      item_id: variant?.item_id ?? undefined,
      size: variant?.size ?? '',
      crustType: variant?.crustType ?? '',
      price: variant?.price ?? 0,
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    reset();
    setEditingVariant(null);
    setOpen(false);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
  console.log(data);
  let payload = {
    item_id: data?.item_id,
    size: data?.size,
    crust_type: data?.crustType,
    price: data?.price,
  };
  
  try {
    if (editingVariant) {
      await axios.put(`${apiUpdateItemVariant}/${editingVariant.variantId}`, payload);
    } else {
      await axios.post(apiCreateItemVariant, payload); // use payload instead of data for consistency
    }
    handleDialogClose();
    await fetchVariants();
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error submitting item variant:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit item variant");
    } else {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred");
    }
  }
};


  const filteredVariants = variants?.filter(
    (v) =>
      (v.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      v.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.crustType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (editingVariant?.size) {
      setValue('size', editingVariant.size);
    }
  }, [editingVariant, setValue]);

  const handleDeleteClick = (variant: ItemVariant): void => {
    setDeletingVariant(variant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deletingVariant) return;

    try {
      await axios.delete(`${apiDeleteItemVariant}/${deletingVariant.variantId}`);
      await fetchVariants();
      setDeleteDialogOpen(false);
      setDeletingVariant(null);
    } catch (err) {
      // Handle or toast error
    }
  };

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
        You have {totalCount} total variants
      </Typography>

      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Size</TableCell>
              {/* <TableCell>Crust</TableCell> */}
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
                    {/* <TableCell>{sub.crustType ?? '-'}</TableCell> */}
                    <TableCell>₹{sub.price}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          handleDialogOpen(sub);
                        }}
                      >
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(sub)}>
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

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} mt={4} mb={5}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
          >
            Previous
          </Button>

          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Page {page} of {totalPages}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
            sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
          >
            Next
          </Button>
        </Stack>
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

            {editingVariant && (
              <Box mb={2} sx={{ ml: 16 }}>
                <Typography variant="body2" component="span" color="textSecondary">
                  Selected Item:{' '}
                </Typography>
                <Typography component="span" fontWeight={600}>
                  {editingVariant.itemName}
                </Typography>
              </Box>
            )}

            {/* Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Size</Box>
              <TextField
                select
                fullWidth
                size="small"
                {...register('size', { required: 'Size is required' })}
                error={Boolean(errors.size)}
                helperText={errors.size?.message}
              >
                {['small', 'medium', 'large'].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {editingVariant && (
              <Box mb={2} sx={{ ml: 16 }}>
                <Typography variant="body2" component="span" color="textSecondary">
                  Selected Size:{' '}
                </Typography>
                <Typography component="span" fontWeight={600}>
                  {editingVariant.size}
                </Typography>
              </Box>
            )}

            {/* Crust Type */}
            {/* <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Crust Type</Box>
              <TextField
                fullWidth
                {...register('crustType', { required: 'Crust type is required' })}
                error={Boolean(errors.crustType)}
                helperText={errors.crustType?.message}
                size="small"
              />
            </Box> */}

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

      {/* Delete modal */}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Variant</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>
              {deletingVariant?.itemName} ({deletingVariant?.size}, {deletingVariant?.crustType})
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ItemVariantComponent;
