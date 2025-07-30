'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { BarChart2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination } from '@mui/material';


export default function FoodReportPage() {
  const { apiGetFoodReport, apiGetResturants, apiGetAllMenu } = ProjectApiList();
  const router = useRouter();

  const [foodReport, setFoodReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    restaurant: '',
    item: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
const [limit, setLimit] = useState(5);
const [totalPages, setTotalPages] = useState(1);


  const fetchVariants = useCallback(async () => {
    try {
      const res = await axios.get(apiGetAllMenu);
      setVariants(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch menu items.');
    }
  }, [apiGetAllMenu]);

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get(apiGetResturants);
      if (res.data?.status === 'success') {
        setRestaurants(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch restaurants.');
    }
  }, [apiGetResturants]);

 const fetchFoodReport = async () => {
  setLoading(true);
  try {
    const res = await axios.get(apiGetFoodReport, {
      params: {
        restaurant: filters.restaurant || undefined,
        item: filters.item || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page,
        limit,
      },
    });

    setFoodReport(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
  } catch (err) {
    setError('Failed to load food report.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchVariants();
    fetchRestaurants();
  }, [fetchVariants, fetchRestaurants]);

useEffect(() => {
  fetchFoodReport();
}, [filters, page, limit]);


  console.log(restaurants)

  return (
    <Box sx={{ pt: 2, maxWidth: 1200, mx: 'auto' }}>
      {/* Page Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <BarChart2 size={28} />
        <Typography variant="h5" fontWeight={600}>
          Food Sales Report
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={3}>
          Filter Reports
        </Typography>

        {/* First Row: Restaurant */}
        <Box mb={3}>
          <Box sx={{ flex: '1 1 250px' }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Restaurant
            </Typography>
            <FormControl fullWidth={false} size="small" sx={{ width: 370 }}>
              <Select
                value={filters.restaurant}
                onChange={(e) => setFilters((prev) => ({ ...prev, restaurant: e.target.value }))}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Restaurants</em>
                </MenuItem>
                {restaurants.map((restaurant: any) => (
                  <MenuItem key={restaurant.id} value={restaurant.restaurants_no}>
                    {restaurant.name} – {restaurant.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Second Row: Item, Start Date, End Date */}
        <Box display="flex" flexWrap="wrap" gap={3}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Item
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.item}
                onChange={(e) => setFilters((prev) => ({ ...prev, item: e.target.value }))}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Items</em>
                </MenuItem>
                {variants.map((item: any) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Start Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              End Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </Box>
        </Box>
      </Paper>

      {/* Data Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography align="center" color="error" mt={4}>
          {error}
        </Typography>
      ) : (
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Restaurant ID</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sold Count</TableCell>
                  <TableCell>Total Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {foodReport.length > 0 ? (
                  foodReport.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.item_name === 'undefined' ? 'Custom' : item.item_name || 'N/A'}</TableCell>
                      <TableCell>{item.restaurant_address}</TableCell>
                      <TableCell>{item.restaurants_no}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>{item.sold_count}</TableCell>
                      <TableCell>₹{item.total_revenue}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No food sales data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
             <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
        </Paper>
      )}
    </Box>
  );
}
