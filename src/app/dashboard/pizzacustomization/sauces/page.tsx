'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
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

interface Sauce {
  id: number;
  pizza_size: string | null;
  name: string;
  light_price: string;
  regular_price: string;
  extra_price: string;
  image_url: string;
}

interface SauceForm {
  pizza_size: string;
  name: string;
  light_price: number;
  regular_price: number;
  extra_price: number;
  image: FileList | File;
}

function SaucesComponent() {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [filteredSauces, setFilteredSauces] = useState<Sauce[]>([]);
  const [pizzaSizes, setPizzaSizes] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSauce, setEditingSauce] = useState<Sauce | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSauceId, setSelectedSauceId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { apiGetSauces, apiCreateSauces, apiUpdateSauces, apiDeleteSauces, apiGetBreadSize } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SauceForm>();

  const fetchSauces = useCallback(async () => {
    try {
      const res = await axios.get<{ data: Sauce[] }>(apiGetSauces);
      setSauces(res.data.data);
      setFilteredSauces(res.data.data);
    } catch {
      toast.error('Failed to fetch sauces');
    }
  }, [apiGetSauces]);

  const fetchPizzaSizes = useCallback(async () => {
    try {
      const res = await axios.get<{ data: { id: string; name: string }[] }>(apiGetBreadSize);
      setPizzaSizes(res.data.data);
    } catch {
      toast.error('Failed to fetch pizza sizes');
    }
  }, [apiGetBreadSize]);

  useEffect(() => {
    void fetchSauces();
    void fetchPizzaSizes();
  }, [fetchSauces, fetchPizzaSizes]);

  const handleDialogOpen = (sauce?: Sauce) => {
    setEditingSauce(sauce || null);
    reset({
      pizza_size: sauce?.pizza_size || '',
      name: sauce?.name || '',
      light_price: parseFloat(sauce?.light_price || '0'),
      regular_price: parseFloat(sauce?.regular_price || '0'),
      extra_price: parseFloat(sauce?.extra_price || '0'),
    });
    setImagePreview(sauce?.image_url || '');
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingSauce(null);
    reset();
    setImagePreview('');
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!selectedSauceId) return;
    setDeleting(true);
    try {
      await axios.delete(`${apiDeleteSauces}/${selectedSauceId}`);
      toast.success('Sauce deleted successfully');
      await fetchSauces();
      setDeleteDialogOpen(false);
    } catch {
      toast.error('Failed to delete sauce');
    } finally {
      setDeleting(false);
      setSelectedSauceId(null);
    }
  };

  const onSubmit = async (data: any) => {
  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append('pizza_size', data.pizza_size);
    formData.append('name', data.name);
    formData.append('light_price', String(data.light_price));
    formData.append('regular_price', String(data.regular_price));
    formData.append('extra_price', String(data.extra_price));
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    if (editingSauce) {
      await axios.put(`${apiUpdateSauces}/${editingSauce.id}`, formData);
    } else {
      await axios.post(apiCreateSauces, formData);
    }

    toast.success(`Sauce ${editingSauce ? 'updated' : 'created'} successfully`);
    handleDialogClose();
    await fetchSauces();
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong while saving the sauce';
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};


  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lower = term.toLowerCase();
    const filtered = sauces.filter((s) => s.name.toLowerCase().includes(lower));
    setFilteredSauces(filtered);
  };

  return (
    <Box mt={5}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Sauces
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
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Pizza Size</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Light Price</TableCell>
              <TableCell>Regular Price</TableCell>
              <TableCell>Extra Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSauces.length > 0 ? (
              filteredSauces.map((sauce, index) => (
                <TableRow key={sauce.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {sauce.image_url && (
                      <img
                        src={sauce.image_url}
                        alt={sauce.name}
                        width={60}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: 6 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{sauce.pizza_size || '-'}</TableCell>
                  <TableCell>{sauce.name}</TableCell>
                  <TableCell>₹{sauce.light_price}</TableCell>
                  <TableCell>₹{sauce.regular_price}</TableCell>
                  <TableCell>₹{sauce.extra_price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDialogOpen(sauce)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedSauceId(sauce.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No sauces found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingSauce ? 'Edit Sauce' : 'Add Sauce'}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box
            component="form"
            id="sauce-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {/* Pizza Size */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Pizza Size</Box>
              <FormControl fullWidth size="small">
                <Select {...register('pizza_size', { required: 'Pizza size is required' })} defaultValue="">
                  {pizzaSizes.map((size) => (
                    <MenuItem key={size.id} value={size.name}>
                      {size.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.pizza_size && (
                  <Typography color="error" fontSize={12}>
                    {errors.pizza_size.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Name */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Sauce name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            {/* Light Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Light Price</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('light_price')}
              />
            </Box>

            {/* Regular Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Regular Price</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('regular_price')}
              />
            </Box>

            {/* Extra Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Extra Price</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('extra_price')}
              />
            </Box>

            {/* Upload Image */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Image</Box>
              <Button variant="outlined" component="label" size="small">
                Choose Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    onImageChange(e);
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue('image', file);
                    }
                  }}
                />
              </Button>
            </Box>

            {imagePreview && (
              <Box display="flex" justifyContent="center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit" form="sauce-form" variant="contained" disabled={isLoading}>
            {isLoading ? (editingSauce ? 'Updating...' : 'Saving...') : editingSauce ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this sauce?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SaucesComponent;
