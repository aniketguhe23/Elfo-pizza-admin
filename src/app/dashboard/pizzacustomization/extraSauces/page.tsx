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
  MenuItem,
  Paper,
  Select,
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

interface BreadSize {
  id: number;
  name: string;
}

interface Sauce {
  id: number;
  name: string;
  pizza_size: string;
  light_price: string;
  regular_price: string;
  extra_price: string;
  price: string;
  image_url: string;
  created_at: string;
}

interface SauceForm {
  name: string;
  pizza_size: string;
  light_price: string;
  regular_price: string;
  extra_price: string;
  price: string;
  image_url: string;
  image?: FileList;
}

function ExtraSauceComponent(): JSX.Element {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [filteredSauces, setFilteredSauces] = useState<Sauce[]>([]);
  const [breadSizes, setBreadSizes] = useState<BreadSize[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSauce, setEditingSauce] = useState<Sauce | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSauce, setSelectedSauce] = useState<Sauce | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { apiGetExtraSauce, apiCreateExtraSauce, apiUpdateExtraSauce, apiDeleteExtraSauce, apiGetBreadSize } =
    ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SauceForm>({
    defaultValues: {
      pizza_size: '',
      light_price: '',
      regular_price: '',
      extra_price: '',
    },
  });

  // Fetch bread sizes for pizza_size dropdown
  const fetchBreadSizes = useCallback(async () => {
    try {
      const res = await axios.get<{ data: BreadSize[] }>(apiGetBreadSize);
      setBreadSizes(res.data.data || []);
    } catch {
      toast.error('Error fetching bread sizes');
    }
  }, [apiGetBreadSize]);

  // Fetch sauces
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
    void fetchBreadSizes();
    void fetchSauces();
  }, [fetchBreadSizes, fetchSauces]);

  const handleDialogOpen = (sauce?: Sauce): void => {
    setEditingSauce(sauce || null);
    reset({
      name: sauce?.name || '',
      pizza_size: sauce?.pizza_size || '',
      light_price: sauce?.light_price || '',
      regular_price: sauce?.regular_price || '',
      extra_price: sauce?.extra_price || '',
      // price: sauce?.price || '',
      image_url: sauce?.image_url || '',
    });
    setPreviewImage(sauce?.image_url || null);
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingSauce(null);
    setPreviewImage(null);
    reset();
  };

  const handleDeleteDialogOpen = (sauce: Sauce): void => {
    setSelectedSauce(sauce);
    setDeleteOpen(true);
  };

  const handleDeleteDialogClose = (): void => {
    setSelectedSauce(null);
    setDeleteOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedSauce) return;

    try {
      setLoading(true);
      await axios.delete(`${apiDeleteExtraSauce}/${selectedSauce.id}`);
      toast.success('Sauce deleted');
      handleDeleteDialogClose();
      await fetchSauces();
    } catch {
      toast.error('Failed to delete sauce');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SauceForm): Promise<void> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('pizza_size', data.pizza_size);
      formData.append('light_price', data.light_price);
      formData.append('regular_price', data.regular_price);
      formData.append('extra_price', data.extra_price);
      // formData.append('price', data.price);

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      } else if (editingSauce) {
        formData.append('image_url', editingSauce.image_url);
      }

      if (editingSauce) {
        await axios.put(`${apiUpdateExtraSauce}/${editingSauce.id}`, formData);
        toast.success('Sauce updated');
      } else {
        await axios.post(apiCreateExtraSauce, formData);
        toast.success('Sauce created');
      }

      handleDialogClose();
      await fetchSauces();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || error.response?.data?.message || 'Error submitting sauce');
      } else {
        toast.error('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
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
            onChange={(e) => {
              handleSearch(e.target.value);
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
        You have {sauces.length} total sauces
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Pizza Size</TableCell>
              <TableCell>Light Price</TableCell>
              <TableCell>Regular Price</TableCell>
              <TableCell>Extra Price</TableCell>
              {/* <TableCell>Price</TableCell> */}
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSauces.map((sauce, index) => {
              // const sizeName = breadSizes.find((size) => size.id === sauce.pizza_size)?.name || 'N/A';
              return (
                <TableRow key={sauce.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {sauce.image_url && (
                      <img
                        src={sauce.image_url}
                        alt={sauce.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{sauce.name}</TableCell>
                  <TableCell>{sauce.pizza_size}</TableCell>
                  <TableCell>₹{sauce.light_price}</TableCell>
                  <TableCell>₹{sauce.regular_price}</TableCell>
                  <TableCell>₹{sauce.extra_price}</TableCell>
                  {/* <TableCell>₹{sauce.price}</TableCell> */}
                  <TableCell>{sauce.created_at.split('T')[0]}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleDialogOpen(sauce);
                      }}
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDialogOpen(sauce)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
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
          <IconButton onClick={handleDialogClose} size="small" sx={{ ml: 2 }}>
            ✕
          </IconButton>
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
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            {/* Pizza Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Pizza Size</Box>
              <Select
                size="small"
                fullWidth
                defaultValue={breadSizes[0]?.id ?? ''}
                {...register('pizza_size', { required: 'Pizza size is required' })}
                error={Boolean(errors.pizza_size)}
              >
                {breadSizes.map((size) => (
                  <MenuItem key={size.id} value={size.name}>
                    {size.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.pizza_size && (
                <Typography variant="caption" color="error">
                  {errors.pizza_size.message}
                </Typography>
              )}
            </Box>

            {/* Light Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Light Price (₹)</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('light_price', { required: 'Light price is required' })}
                error={Boolean(errors.light_price)}
                helperText={errors.light_price?.message}
              />
            </Box>

            {/* Regular Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Regular Price (₹)</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('regular_price', { required: 'Regular price is required' })}
                error={Boolean(errors.regular_price)}
                helperText={errors.regular_price?.message}
              />
            </Box>

            {/* Extra Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Extra Price (₹)</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('extra_price', { required: 'Extra price is required' })}
                error={Boolean(errors.extra_price)}
                helperText={errors.extra_price?.message}
              />
            </Box>

            {/* Base Price */}
            {/* <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Base Price (₹)</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('price', { required: 'Price is required' })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </Box> */}

            {/* Existing Image */}
            {editingSauce?.image_url && (
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
                <input
                  type="file"
                  hidden
                  accept="image/*"
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

            {/* Preview Image */}
            {previewImage && (
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ width: 140, fontWeight: 500 }}>Preview</Box>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: 80, height: 80, borderRadius: 6, objectFit: 'cover' }}
                />
              </Box>
            )}
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
            disabled={loading}
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
            {loading ? (editingSauce ? 'Updating...' : 'Creating...') : editingSauce ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Sauce</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedSauce?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExtraSauceComponent;
