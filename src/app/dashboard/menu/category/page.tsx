'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Pencil, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { ListingTable } from './component/ListingTable';

interface Category {
  id: number;
  name: string;
}

const CategoryComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    api_getCategories,
    api_createCategories,
    api_updateCategories
  } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(api_getCategories);
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDialogOpen = (category?: Category) => {
    setEditingCategory(category || null);
    reset({ name: category?.name || '' });
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      if (editingCategory) {
        await axios.put(`${api_updateCategories}/${editingCategory.id}`, data);
      } else {
        await axios.post(api_createCategories, data);
      }
      handleDialogClose();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Categories
        </Typography>
        <Button
          sx={{
            backgroundColor: '#635bff',
            color: '#fff',
            fontSize: '14px',
            padding: '6px 16px',
            minWidth: 'unset',
            borderRadius: '4px',
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #ccc',
            '&:hover': {
              backgroundColor: '#3d33ff',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
          variant="contained"
          onClick={() => handleDialogOpen()}
        >
          <Plus height={17} />
          Add New
        </Button>
      </Box>

      {/* <TableContainer
        component={Paper}
        sx={{
          border: '1px solid #ddd', // subtle border for a clean look
          borderRadius: 1,
          overflow: 'hidden', // keeps border clean around edges
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '16px', fontWeight: 600, color: '#555' }}>
                <strong>S. No</strong>
              </TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 600, color: '#555' }}>
                <strong>Category Name</strong>
              </TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 600, color: '#555' }}>
                <strong>Created At</strong>
              </TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 600, color: '#555', textAlign: 'center' }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((category: any, index) => (
              <TableRow key={category.id}>
                <TableCell sx={{ padding: '16px', fontWeight: 500, color: '#333' }}>{index + 1}</TableCell>
                <TableCell sx={{ padding: '16px', fontWeight: 500, color: '#333' }}>{category?.name || '-'}</TableCell>
                <TableCell sx={{ padding: '16px', fontWeight: 500, color: '#333' }}>
                  {category?.created_at.split('T')[0] || '-'}
                </TableCell>
                <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                  <Button
                    sx={{
                      backgroundColor: '#fafafa',
                      color: '#333',
                      fontSize: '12px',
                      padding: '6px 15px',
                      minWidth: 'unset',
                      borderRadius: '4px',
                      textTransform: 'none',
                      border: '1px solid #ccc',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                      '&:focus': {
                        outline: 'none',
                      },
                    }}
                    onClick={() => handleDialogOpen(category)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
<ListingTable data={categories} onClick={handleDialogOpen} />

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={600} color="text.primary">
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="category-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Category Name"
              fullWidth
              {...register('name', { required: 'Category name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ marginBottom: '16px' }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="category-form" variant="contained">
            {editingCategory ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryComponent;
