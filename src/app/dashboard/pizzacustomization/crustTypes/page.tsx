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

interface CrustType {
  id: number;
  name: string;
  price: string;
  created_at: string;
}

function CrustTypeComponent(): JSX.Element {
  const [crustTypes, setCrustTypes] = useState<CrustType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCrust, setEditingCrust] = useState<CrustType | null>(null);
  const [search, setSearch] = useState('');

  const { apiGetCrustTypes, apiCreateCrustTypes, apiUpdateCrustTypes } = ProjectApiList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; price: number }>();

  const fetchCrustTypes = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<{ data: CrustType[] }>(apiGetCrustTypes);
      setCrustTypes(response.data?.data || []);
    } catch (error) {
      toast.error('Error fetching crust types');
    }
  }, [apiGetCrustTypes]);

  useEffect(() => {
    void fetchCrustTypes();
  }, [fetchCrustTypes]);

  const handleDialogOpen = (crust?: CrustType): void => {
    setEditingCrust(crust || null);
    reset({
      name: crust?.name || '',
      price: parseFloat(crust?.price || '0'),
    });
    setOpen(true);
  };

  const handleDialogClose = (): void => {
    setOpen(false);
    setEditingCrust(null);
    reset();
  };

  const onSubmit = async (data: { name: string; price: number }): Promise<void> => {
    try {
      if (editingCrust) {
        await axios.put(`${apiUpdateCrustTypes}/${editingCrust.id}`, data);
      } else {
        await axios.post(apiCreateCrustTypes, data);
      }
      handleDialogClose();
      await fetchCrustTypes();
    } catch (error) {
      toast.error('Error saving crust type');
    }
  };

  const filteredCrustTypes = crustTypes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          Crust Types
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Crust"
            value={search}
            onChange={(e) => {setSearch(e.target.value)}}
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
        You have {crustTypes.length} total crust types
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Crust Name</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCrustTypes.map((crust, index) => (
              <TableRow key={crust.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{crust.name}</TableCell>
                <TableCell>₹{crust.price}</TableCell>
                <TableCell>{crust.created_at.split('T')[0]}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleDialogOpen(crust);
                    }}
                  >
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
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <DialogTitle>{editingCrust ? 'Edit Crust Type' : 'Add Crust Type'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            id="crust-form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Crust Name</Box>
              <TextField
                fullWidth
                size="small"
                {...register('name', { required: 'Crust name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ width: 120, fontWeight: 500 }}>Price (₹)</Box>
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
            form="crust-form"
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
            {editingCrust ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CrustTypeComponent;
