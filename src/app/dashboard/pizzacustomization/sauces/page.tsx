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
  image: string;
  image_url: string;
  created_at: string;
}

interface SauceForm {
  name: string;
  price: number;
  image: FileList;
}

function SaucesComponent() {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [filteredSauces, setFilteredSauces] = useState<Sauce[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSauce, setEditingSauce] = useState<Sauce | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSauceId, setSelectedSauceId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { apiGetSauces, apiCreateSauces, apiUpdateSauces, apiDeleteSauces } = ProjectApiList();

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

  useEffect(() => {
    void fetchSauces();
  }, [fetchSauces]);

  const handleDialogOpen = (sauce?: Sauce): void => {
    setEditingSauce(sauce || null);
    reset({
      name: sauce?.name || '',
      price: parseFloat(sauce?.price || '0'),
    });
    setImagePreview(sauce?.image_url || '');
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingSauce(null);
    reset();
    setImagePreview('');
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!selectedSauceId) return;
    setDeleting(true);
    try {
      await axios.delete(`${apiDeleteSauces}/${selectedSauceId}`); // 👈 Adjust URL if needed
      toast.success('Sauce deleted successfully');
      await fetchSauces();
      setDeleteDialogOpen(false);
    } catch (error) {
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
      formData.append('name', data.name);
      formData.append('price', String(data.price));
      if (data.image) {
        formData.append('image', data.image); // ✅ only works if image is File
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
      toast.error('Something went wrong while saving the sauce');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    const lower = term.toLowerCase();
    const filtered = sauces.filter((s) => s.name.toLowerCase().includes(lower));
    setFilteredSauces(filtered);
  };

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Sauces
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
              '&:hover': { backgroundColor: '#222' },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        You have {sauces.length} sauces
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
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
                  <TableCell>{sauce.name}</TableCell>
                  <TableCell>₹{sauce.price}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleDialogOpen(sauce);
                      }}
                    >
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
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No sauces found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
            {/* Sauce Name */}
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

            {/* Price */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Price (₹)</Box>
              <TextField
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                {...register('price', { required: 'Price is required' })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </Box>

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
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    onImageChange(e); // if you use preview
                    const file: any = e.target.files?.[0];
                    if (file) {
                      setValue('image', file); // ✅ sets the file in RHF
                    }
                  }}
                />
              </Button>
            </Box>

            {/* Image Preview */}
            {imagePreview && (
              <Box display="flex" justifyContent="center" mt={1}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
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
            disabled={isLoading}
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
            {isLoading ? (editingSauce ? 'Updating...' : 'Saving...') : editingSauce ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete dialog */}
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
