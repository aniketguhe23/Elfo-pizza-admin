'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Avatar,
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
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Topping {
  id: number;
  name: string;
  is_vegetarian: boolean;
  price: string;
  image_url: string;
  created_at: string;
}

interface ToppingResponse {
  data: Topping[];
}

function ToppingsComponent(): JSX.Element {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Topping | null>(null);
  const [search, setSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { apiGetToppings, apiCreateToppings, apiUpdateToppings } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    name: string;
    price: string;
    is_vegetarian: boolean;
    image: FileList;
  }>();

  const fetchToppings = useCallback(async () => {
    try {
      const response = await axios.get<ToppingResponse>(apiGetToppings);
      setToppings(response.data?.data || []);
    } catch {
      toast.error('Error fetching toppings');
    }
  }, [apiGetToppings]);

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const handleDialogOpen = (topping?: Topping) => {
    setEditing(topping || null);
    reset({
      name: topping?.name || '',
      price: topping?.price || '',
      is_vegetarian: topping?.is_vegetarian || false,
    });
    setPreviewImage(topping?.image_url || null);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditing(null);
    setPreviewImage(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('is_vegetarian', String(data.is_vegetarian));

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      if (editing) {
        await axios.put(`${apiUpdateToppings}/${editing.id}`, formData);
      } else {
        await axios.post(apiCreateToppings, formData);
      }

      handleDialogClose();
      fetchToppings();
    } catch {
      toast.error('Error saving topping');
    }
  };

  const filtered = toppings.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Typography variant="h4" fontWeight={700}>Toppings</Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search Toppings"
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
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        You have {toppings.length} toppings
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Vegetarian</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((topping, index) => (
              <TableRow key={topping.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={topping.image_url} alt={topping.name} />
                </TableCell>
                <TableCell>{topping.name}</TableCell>
                <TableCell>₹{topping.price}</TableCell>
                <TableCell>{topping.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {new Date(topping.created_at).toISOString().split('T')[0]}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(topping)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton>
                    <Trash2 size={16} />
                  </IconButton>
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
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
      {editing ? 'Edit Topping' : 'Add Topping'}
    </Typography>
    <IconButton onClick={handleDialogClose} />
  </DialogTitle>

  <DialogContent sx={{ px: 3, py: 3, mt: 3 }}>
    <Box
      component="form"
      id="topping-form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      {/* Name */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ width: 140, fontWeight: 500 }}>Topping Name</Box>
        <TextField
          fullWidth
          size="small"
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Box>

      {/* Price */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ width: 140, fontWeight: 500 }}>Price (₹)</Box>
        <TextField
          type="number"
          fullWidth
          size="small"
          inputProps={{ min: 0, step: 0.01 }}
          {...register('price', { required: 'Price is required' })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
      </Box>

      {/* Vegetarian */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ width: 140, fontWeight: 500 }}>Is Vegetarian?</Box>
        <Checkbox {...register('is_vegetarian')} />
      </Box>

      {/* Image Preview */}
      {previewImage && (
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ width: 140, fontWeight: 500 }}>Preview</Box>
          <Avatar
            src={previewImage}
            alt="Preview"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            variant="rounded"
          />
        </Box>
      )}

      {/* Upload Image */}
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
          <input
            hidden
            type="file"
            accept="image/*"
            {...register('image')}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
                setValue('image', e.target.files as any);
              }
            }}
          />
        </Button>
      </Box>
    </Box>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3, pb: 2 }}>
    <Button
      onClick={handleDialogClose}
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
      form="topping-form"
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
      {editing ? 'Update' : 'Save'}
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default ToppingsComponent;
