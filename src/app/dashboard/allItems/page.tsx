'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  InputAdornment,
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
import { Search } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Variant {
  crust_type: string;
  price: number;
}

interface Category {
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: Category;
  is_vegetarian: number;
  is_available: number;
  on_homePage: boolean;
  on_suggestions: boolean;
  variants: Variant[];
}

const SUGGESTION_CATEGORIES = ['Sides', 'Drinks', 'Desserts'];

function ItemVariantComponent(): React.ReactElement {
  const [variants, setVariants] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { apiGetAllMenu, apiUpdateHomeMenu } = ProjectApiList();

  const fetchVariants = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: MenuItem[] }>(apiGetAllMenu);
      setVariants(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch variants. Please try again later.');
    }
  }, [apiGetAllMenu]);

  useEffect(() => {
    void fetchVariants(); // ✅ explicitly ignoring the promise
  }, [fetchVariants]);

  const handleToggle = async (
    id: number,
    currentValue: boolean,
    field: 'on_homePage' | 'on_suggestions'
  ): Promise<void> => {
    try {
      setLoading(true);
      const updatedValue = !currentValue;

      await axios.put(apiUpdateHomeMenu, {
        itemId: id,
        [field]: updatedValue,
      });

      setVariants((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: updatedValue } : item
        )
      );
    } catch (error) {
      toast.error(`Error updating ${field === 'on_suggestions' ? 'suggestions' : 'homepage'} status`);
    } finally {
      setLoading(false);
    }
  };

  const filteredVariants = variants.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box mt={5}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          All Items
        </Typography>
        <TextField
          size="small"
          placeholder="Search item name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value)}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
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
              <TableCell>Is Vegetarian</TableCell>
              <TableCell>Is Available</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>On HomePage</TableCell>
              <TableCell>On Suggestions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVariants.length > 0 ? (
              filteredVariants.map((item, index) => {
                const showSuggestionToggle = SUGGESTION_CATEGORIES.includes(item.category.name);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.category.name}</TableCell>
                    <TableCell>{item.is_vegetarian === 1 ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{item.is_available === 1 ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      {item.variants.map((variant) => (
                        <div key={`${item.id}-${variant.crust_type}`}>
                          {variant.crust_type} - ₹{variant.price}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.on_homePage}
                        onChange={() => {
                          void handleToggle(item.id, item.on_homePage, 'on_homePage');
                        }}
                        disabled={loading}
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      {showSuggestionToggle ? (
                        <Switch
                          checked={item.on_suggestions}
                          onChange={() => {
                            void handleToggle(item.id, item.on_suggestions, 'on_suggestions');
                          }}
                          disabled={loading}
                          color="primary"
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          --
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No items found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ItemVariantComponent;
