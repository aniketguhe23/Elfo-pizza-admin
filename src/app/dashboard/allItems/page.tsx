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
  Switch,
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
import { Pencil, Plus, Search, Trash, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Item {
  id: number;
  name: string;
}

interface ItemVariant {
  variantId: number;
  item_id: number;
  size: string;
  crustType: string;
  price: number;
  itemName?: string;
}

// connnnnnnnnnn
// connnnnnnnnnn
// connnnnnnnnnn
// connnnnnnnnnn
// connnnnnnnnnn
// connnnnnnnnnn

const ItemVariantComponent = () => {
  const [variants, setVariants] = useState<ItemVariant[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const { api_getAllmenu, api_updateHomeMenu } = ProjectApiList();

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const res = await axios.get(api_getAllmenu);
      setVariants(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching variants:', err);
    }
  };

  const handleToggle = async (id: number, currentValue: boolean) => {
    try {
      setLoading(true);
      const updatedValue = !currentValue;

      await axios.put(api_updateHomeMenu, {
        itemId: id,
        onHomePage: updatedValue,
      });

      // Update the local state after a successful API call
      setVariants((prev) => prev.map((item: any) => (item.id === id ? { ...item, on_homePage: updatedValue } : item)));
    } catch (error) {
      console.error('Toggle failed', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVariants = variants.filter(
    (v: any) => v.name?.toLowerCase().includes(searchTerm.toLowerCase())
    //   v.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   v.crustType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          All Items
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search item name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
          {/* <Button
            variant="contained"
            startIcon={<Plus size={18} />}
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
          </Button> */}
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        You have {variants.length} total Items.
      </Typography>

      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>is Vegetarian</TableCell>
              <TableCell>is Available</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>on HomePage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVariants?.length > 0 ? (
              filteredVariants?.map((sub: any, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub?.name}</TableCell>
                  <TableCell>{sub?.description}</TableCell>
                  <TableCell>{sub?.category?.name}</TableCell>
                  <TableCell>{sub?.is_vegetarian == 1 ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{sub?.is_available == 1 ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {sub?.variants?.map((data: any, index: any) => (
                      <>
                        <div key={index}>
                          {data?.crust_type} - ₹ {data?.price}
                        </div>
                      </>
                    ))}
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={sub?.on_homePage === true}
                      onChange={() => handleToggle(sub?.id, sub?.on_homePage)}
                      disabled={loading}
                      color="success"
                      inputProps={{ 'aria-label': 'toggle homepage visibility' }}
                    />
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
    </Box>
  );
};

export default ItemVariantComponent;
