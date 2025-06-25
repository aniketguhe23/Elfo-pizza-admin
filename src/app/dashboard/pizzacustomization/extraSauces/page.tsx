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
import axios from 'axios';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Sauce {
  id: number;
  name: string;
  price: string;
  image_url: string;
  created_at: string;
}

interface SauceForm {
  name: string;
  price: string;
  image_url: string;
  image?: FileList;
}

function ExtraSauceComponent(): JSX.Element {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [filteredSauces, setFilteredSauces] = useState<Sauce[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSauce, setEditingSauce] = useState<Sauce | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { apiGetExtraSauce, apiCreateExtraSauce, apiUpdateExtraSauce } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SauceForm>();

  const watchImage = watch('image');

  const fetchSauces = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: Sauce[] }>(apiGetExtraSauce);
      const data = res.data.data || [];
      setSauces(data);
      setFilteredSauces(data);
    } catch {
      toast.error('Error fetching sauces');
    }
  }, [apiGetExtraSauce]);

  useEffect(() => {
    void fetchSauces();
  }, [fetchSauces]);

  const handleDialogOpen = (sauce?: Sauce): void => {
    setEditingSauce(sauce || null);
    reset({
      name: sauce?.name || '',
      price: sauce?.price || '',
      image_url: sauce?.image_url || '',
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingSauce(null);
    reset();
  };

  const onSubmit = async (data: SauceForm): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      } else {
        formData.append('image_url', data.image_url);
      }

      if (editingSauce) {
        await axios.put(`${apiUpdateExtraSauce}/${editingSauce.id}`, formData);
      } else {
        await axios.post(apiCreateExtraSauce, formData);
      }

      handleDialogClose();
      await fetchSauces();
    } catch {
      toast.error('Error submitting sauce');
    }
  };

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();
    const filtered = sauces.filter((sauce) => sauce.name.toLowerCase().includes(lowerTerm));
    setFilteredSauces(filtered);
  };

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Extra Sauces
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search sauces"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
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
        You have {sauces.length} total sauces
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSauces.map((sauce, index) => (
              <TableRow key={sauce.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sauce.name}</TableCell>
                <TableCell>₹{sauce.price}</TableCell>
                <TableCell>
                  <img
                    src={sauce.image_url}
                    alt={sauce.name}
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{sauce.created_at.split('T')[0]}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(sauce)}>
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

      {/* Dialog */}
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
      {editingSauce ? 'Edit Sauce' : 'Add Sauce'}
    </Typography>
    <IconButton onClick={handleDialogClose} />
  </DialogTitle>

  <DialogContent sx={{ px: 3, py: 3, mt: 3 }}>
    <Box
      component="form"
      id="sauce-form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      {/* Name */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ width: 140, fontWeight: 500 }}>Sauce Name</Box>
        <TextField
          fullWidth
          size="small"
          {...register('name', { required: 'Sauce name is required' })}
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

      {/* Existing Image Preview */}
      {editingSauce && (
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ width: 140, fontWeight: 500 }}>Current Image</Box>
          <img
            src={editingSauce.image_url}
            alt="Current Sauce"
            style={{
              width: 80,
              height: 80,
              borderRadius: 6,
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
        </Box>
      )}

      {/* Optional Image URL */}
      {/* <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ width: 140, fontWeight: 500 }}>Image URL</Box>
        <TextField
          fullWidth
          size="small"
          {...register('image_url')}
          error={!!errors.image_url}
          helperText={errors.image_url?.message}
        />
      </Box> */}

      {/* Upload File */}
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
          <input type="file" hidden accept="image/*" {...register('image')} />
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
      form="sauce-form"
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
      {editingSauce ? 'Update' : 'Save'}
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default ExtraSauceComponent;
