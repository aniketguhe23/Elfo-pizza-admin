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
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ListingTable } from './component/ListingTable';

interface Size {
  id: number;
  name: string;
  size: string;
  price: string;
}

interface FormData {
  name: string;
  size: string;
  price: string;
}

function SizeComponent(): JSX.Element {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [filteredSizes, setFilteredSizes] = useState<Size[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [search, setSearch] = useState('');

  const { apiGetBreadSize, apiCreateBreadSize, apiUpdateBreadSize } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const fetchSizes = useCallback(async () => {
    try {
      const response = await axios.get<{ data: Size[] }>(apiGetBreadSize);
      const fetched = response.data.data || [];
      setSizes(fetched);
      setFilteredSizes(fetched);
    } catch {
      toast.error('Failed to fetch sizes');
    }
  }, [apiGetBreadSize]);

  useEffect(() => {
    void fetchSizes();
  }, [fetchSizes]);

  useEffect(() => {
    if (!search) {
      setFilteredSizes(sizes);
    } else {
      const lower = search.toLowerCase();
      const filtered = sizes.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) || s.size.toLowerCase().includes(lower)
      );
      setFilteredSizes(filtered);
    }
  }, [search, sizes]);

  const handleDialogOpen = (size?: Size): void => {
    setEditingSize(size || null);
    reset({
      name: size?.name || '',
      size: size?.size || '',
      price: size?.price || '',
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingSize(null);
    reset();
  };

const onSubmit = async (data: FormData): Promise<void> => {
  try {
    if (editingSize) {
      await axios.put(`${apiUpdateBreadSize}/${editingSize.id}`, data);
    } else {
      await axios.post(apiCreateBreadSize, data);
    }
    handleDialogClose();
    await fetchSizes();
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.error || // Your backend's { error: "..."} format
      error.response?.data?.message || // If backend uses { message: "..."}
      error.message || // Fallback to axios error message
      "Failed to save size"; // Default fallback
    toast.error(errorMsg);
  }
};


  return (
    <Box mt={5}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" fontWeight={700}>
          Pizza Sizes
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Sizes"
            value={search}
            onChange={(e) => {setSearch(e.target.value)}}
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
        You have {sizes.length} total sizes
      </Typography>

      <ListingTable
        data={filteredSizes}
        fetchSizes={fetchSizes}
        onClick={(item) => {
          handleDialogOpen(item as Size);
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
        <DialogTitle>{editingSize ? 'Edit Size' : 'Add Size'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            id="size-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Size Name</Box>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g., SMALL"
                {...register('name', { required: 'Name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Inches</Box>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g., 7 INCHES"
                {...register('size', { required: 'Size label is required' })}
                error={Boolean(errors.size)}
                helperText={errors.size?.message}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Price</Box>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g., 99"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('price', { required: 'Price is required' })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
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
              color: '#333',
              borderColor: '#ccc',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#f2f2f2',
                color: '#000',
                borderColor: '#bbb',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="size-form"
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
            {editingSize ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SizeComponent;
