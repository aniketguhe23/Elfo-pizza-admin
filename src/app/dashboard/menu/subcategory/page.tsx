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
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

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

const SubCategoryComponent = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const { api_getSubCategories, api_createSubCategories, api_updateSubCategories, api_getCategories } =
    ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ name: string; category_id: number }>();

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(api_getSubCategories);
      setSubCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(api_getCategories);
      const categoriesData = response.data?.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const handleDialogOpen = (subCategory?: SubCategory) => {

    // console.log(subCategory,"subCategory----------->")
    setEditingSubCategory(subCategory || null);

    reset({
      name: subCategory?.name || '',
      category_id: subCategory ? subCategory.category_id : undefined, // <--- No default on Add
    });

    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingSubCategory(null);
    reset();
  };

  const onSubmit = async (data: { name: string; category_id: number }) => {
    try {
      if (editingSubCategory) {
        await axios.put(`${api_updateSubCategories}/${editingSubCategory.id}`, data);
      } else {
        await axios.post(api_createSubCategories, data);
      }
      handleDialogClose();
      fetchSubCategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  // console.log(editingSubCategory,"editingSubCategory")

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Sub Categories
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleDialogOpen()}
          sx={{
            backgroundColor: '#635bff',
            color: '#fff',
            fontSize: '14px',
            padding: '6px 16px',
            borderRadius: '4px',
            gap: '8px',
            '&:hover': {
              backgroundColor: '#3d33ff',
            },
          }}
        >
          <Plus height={17} />
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>S. No</strong>
              </TableCell>
              <TableCell>
                <strong>Sub Category Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Created At</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories.map((sub, index) => (
              <TableRow key={sub.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.category_name || '-'}</TableCell>
                <TableCell>{sub.created_at?.split('T')[0]}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDialogOpen(sub)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            id="subcategory-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Subcategory Name"
              fullWidth
              {...register('name', { required: 'Subcategory name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Select Category"
              select
              fullWidth
              {...register('category_id', { required: 'Category is required' })}
              error={!!errors.category_id}
              helperText={errors.category_id?.message}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="caption">Selected category : {editingSubCategory?.category_name}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="subcategory-form" variant="contained">
            {editingSubCategory ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubCategoryComponent;
