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
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { api_getSubCategories, api_createSubCategories, api_updateSubCategories, api_getCategories } =
    ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; category_id: number }>();

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(api_getSubCategories);
      const data = res.data?.data || [];
      setSubCategories(data);
      setFilteredSubCategories(data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(api_getCategories);
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const handleDialogOpen = (subCategory?: SubCategory) => {
    setEditingSubCategory(subCategory || null);
    reset({
      name: subCategory?.name || '',
      category_id: subCategory?.category_id || undefined,
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
    } catch (err) {
      console.error('Error saving subcategory:', err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();
    const filtered = subCategories.filter(
      (sub) => sub.name.toLowerCase().includes(lowerTerm) || sub.category_name?.toLowerCase().includes(lowerTerm)
    );
    setFilteredSubCategories(filtered);
  };

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
                  {/* <TableCell>
                    <Button onClick={() => handleDialogOpen(sub)} size="small">
                      <Pencil size={16} />
                    </Button>
                    <Button size="small">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell> */}
                  <TableCell>
                    <IconButton onClick={() => handleDialogOpen(sub)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton>
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
            {/* Subcategory Name */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Subcategory Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Subcategory name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Box>

            {/* Select Category */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 140, fontWeight: 500 }}>Category</Box>
              <TextField
                select
                fullWidth
                size="small"
                {...register('category_id', { required: 'Category is required' })}
                error={!!errors.category_id}
                helperText={errors.category_id?.message}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
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
              color: '#333', // dark gray text
              borderColor: '#ccc', // light gray border
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#f2f2f2', // slightly darker gray on hover
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
    </Box>
  );
};

export default SubCategoryComponent;
