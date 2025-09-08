'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
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
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface Variant {
  crust_type: string;
  price: number;
}

// interface Category {
//   name: string;
// }

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  is_vegetarian: number;
  is_available: number;
  on_homePage: boolean;
  on_suggestions: boolean;
  variants: Variant[];
}

const SUGGESTION_CATEGORIES = ['SIDES', 'DRINKS', 'DESSERTS'];

function ItemVariantComponent(): React.ReactElement {
  const [variants, setVariants] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<any>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const { apiGetAllMenu, apiUpdateHomeMenu } = ProjectApiList();

  const fetchVariants = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiGetAllMenu}`, {
        params: {
          page,
          limit,
          search: searchTerm.trim(),
        },
      });

      setVariants(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      toast.error('Failed to fetch variants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [apiGetAllMenu, page, searchTerm]);

  useEffect(() => {
    void fetchVariants();
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

      setVariants((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: updatedValue } : item)));
    } catch (error) {
      toast.error(`Error updating ${field === 'on_suggestions' ? 'suggestions' : 'homepage'} status`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

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
          onChange={handleSearchChange}
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
        You have {totalItems} items.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={48} color="primary" />
        </Box>
      ) : (
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
              {variants.length > 0 ? (
                variants.map((item, index) => {
                  const showSuggestionToggle = SUGGESTION_CATEGORIES.includes(item?.category);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>{item?.description}</TableCell>
                      <TableCell>{item?.category}</TableCell>
                      <TableCell>{item?.is_vegetarian === 1 ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{item?.is_available === 1 ? 'Yes' : 'No'}</TableCell>
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
                          onChange={() => handleToggle(item.id, item.on_homePage, 'on_homePage')}
                          disabled={loading}
                          color="success"
                        />
                      </TableCell>
                      <TableCell>
                        {showSuggestionToggle ? (
                          <Switch
                            checked={item.on_suggestions}
                            onChange={() => handleToggle(item.id, item.on_suggestions, 'on_suggestions')}
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
      )}

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} mt={4} mb={6}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
        >
          Previous
        </Button>

        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Page {page} of {totalPages}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
}

export default ItemVariantComponent;
