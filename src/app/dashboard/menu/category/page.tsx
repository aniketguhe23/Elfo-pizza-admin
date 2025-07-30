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

interface Category {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  itemsCount: number;
  created_at: string;
}

interface CategoryResponse {
  data: Category[];
}

function CategoryComponent(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { apiGetCategories, apiCreateCategories, apiUpdateCategories,apiDeleteCategories } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<CategoryResponse>(apiGetCategories);
      const result = response.data?.data || [];
      setCategories(result);
    } catch (error) {
      toast.error('Error fetching categories'); // <-- replaced alert
    }
  }, [apiGetCategories]);

  useEffect(() => {
    void (async () => {
      await fetchCategories();
    })();
  }, [fetchCategories]);

  const handleDialogOpen = (category?: Category): void => {
    setEditingCategory(category || null);
    reset({ name: category?.name || '' });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: { name: string }): Promise<void> => {
    try {
      if (editingCategory) {
        await axios.put(`${apiUpdateCategories}/${editingCategory.id}`, data);
      } else {
        await axios.post(apiCreateCategories, data);
      }
      handleDialogClose();
      void fetchCategories();
    } catch (error) {
      toast.error('Error saving category');
    }
  };

  const handleDeleteClick = (category: Category): void => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!categoryToDelete) return;

    try {
      await axios.delete(`${apiDeleteCategories}/${categoryToDelete.id}`);
      toast.success('Category deleted');
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      void fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Categories
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Categories"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
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
        You have {categories.length} total categories
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.created_at ? new Date(category.created_at).toISOString().split('T')[0] : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleDialogOpen(category);
                    }}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(category)}>
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            id="category-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Category Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Category name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
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
            form="category-form"
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
            {editingCategory ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete modal */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', px: 3 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              fontWeight: 500,
              color: '#333',
              borderColor: '#ccc',
              '&:hover': {
                backgroundColor: '#f2f2f2',
                color: '#000',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              fontWeight: 500,
              backgroundColor: '#d32f2f',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryComponent;
