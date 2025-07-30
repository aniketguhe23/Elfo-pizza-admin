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

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  category_id: number;
  created_at: string;
  category_name?: string;
}

interface SubCategoryForm {
  name: string;
  category_id: number;
}

function SubCategoryComponent(): JSX.Element {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubCategory | null>(null);

  const {
    apiGetSubCategories,
    apiCreateSubCategories,
    apiUpdateSubCategories,
    apiGetCategories,
    apiDeleteSubCategories,
  } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubCategoryForm>();

  // Wrap fetch functions with useCallback to avoid missing dependencies warning in useEffect
  const fetchSubCategories = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: SubCategory[] }>(apiGetSubCategories);
      const data = res.data.data || [];
      setSubCategories(data);
      setFilteredSubCategories(data);
    } catch (err) {
      // Handle error appropriately in production
      toast.error('Error fetching subcategories:');
    }
  }, [apiGetSubCategories]);

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: Category[] }>(apiGetCategories);
      const data = res.data.data || [];
      setCategories(data);
    } catch (err) {
      // Handle error appropriately in production
      toast.error('Error fetching categories:');
    }
  }, [apiGetCategories]);

  useEffect(() => {
    void fetchSubCategories();
    void fetchCategories();
  }, [fetchSubCategories, fetchCategories]);

  const handleDialogOpen = (subCategory?: SubCategory): void => {
    setEditingSubCategory(subCategory || null);
    reset({
      name: subCategory?.name || '',
      category_id: subCategory?.category_id ?? undefined,
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingSubCategory(null);
    reset();
  };

  const onSubmit = async (data: SubCategoryForm): Promise<void> => {
    try {
      if (editingSubCategory) {
        await axios.put(`${apiUpdateSubCategories}/${editingSubCategory.id}`, data);
      } else {
        await axios.post(apiCreateSubCategories, data);
      }
      handleDialogClose();
      await fetchSubCategories();
    } catch (err) {
      // Handle error appropriately in production
      toast.error('Error submitting subcategory:');
    }
  };

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();
    const filtered = subCategories.filter(
      (sub) =>
        sub.name.toLowerCase().includes(lowerTerm) || (sub.category_name?.toLowerCase().includes(lowerTerm) ?? false)
    );
    setFilteredSubCategories(filtered);
  };

  const handleDeleteClick = (sub: SubCategory): void => {
    setDeletingSubCategory(sub);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = (): void => {
    setDeleteConfirmOpen(false);
    setDeletingSubCategory(null);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deletingSubCategory) return;

    try {
      await axios.delete(`${apiDeleteSubCategories}/${deletingSubCategory.id}`);
      toast.success('Subcategory deleted successfully');
      await fetchSubCategories();
    } catch (err) {
      toast.error('Failed to delete subcategory');
    } finally {
      handleDeleteCancel();
    }
  };

  const selectedCategoryName = categories.find((cat) => cat.id === editingSubCategory?.category_id)?.name;

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Sub Categories
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search subcategories"
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
        You have {subCategories.length} total categories
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Subcategory Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((sub, index) => (
                <TableRow key={sub.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.category_name}</TableCell>
                  <TableCell>{sub.created_at?.split('T')[0]}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No subcategories found.
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
        <DialogTitle>{editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            id="subcategory-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Subcategory Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Subcategory name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Category</Box>
              <TextField
                select
                fullWidth
                size="small"
                {...register('category_id', { required: 'Category is required' })}
                error={Boolean(errors.category_id)}
                helperText={errors.category_id?.message}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {editingSubCategory && (
              <Box sx={{ display: 'flex', alignItems: 'end', mt: -2, ml: 16, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'gray', fontSize: '0.8rem', mr: 1 }}>
                  Selected Category:
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  {categories.find((cat) => cat.id === editingSubCategory.category_id)?.name || 'Unknown'}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, px: 3 }}>
          <Button
            onClick={() => {
              handleDialogClose();
            }}
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
            form="subcategory-form"
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
            {editingSubCategory ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete */}

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete subcategory <strong>{deletingSubCategory?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', px: 3 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubCategoryComponent;
