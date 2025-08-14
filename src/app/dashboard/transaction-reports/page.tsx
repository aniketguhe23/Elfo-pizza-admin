'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { BarChart2 } from 'lucide-react';

export default function TransactionReportsPage() {
  const { apiGetAllOrdersForResturant, apiTransactionReportofResturant, apiGetResturants } = ProjectApiList();
  const router = useRouter();

  const [timeFilter, setTimeFilter] = useState('all');
  const [transactionReport, setTransactionReport] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restaurants, setResturant] = useState([]);
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState<any[]>([]);
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default items per page
  const [totalPages, setTotalPages] = useState(1);

  // Fetch restaurants
  const fetchResturants = async () => {
    try {
      const res = await axios.get(`${apiGetResturants}`);
      setResturant(res.data.data || []);
    } catch (err) {
      setError('Failed to load restaurants.');
    } finally {
      setRestaurantLoading(false);
    }
  };

  // Fetch orders with backend filtering
  const fetchTotalOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiGetAllOrdersForResturant}?restaurant_name=${restaurantFilter}&time=${timeFilter}&page=${page}&limit=${limit}&order_id=${searchOrderNo}`
      );
      setTotalOrders(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction summary
  const fetchTransactionReport = async () => {
    try {
      const res = await axios.get(
        `${apiTransactionReportofResturant}?restaurant_id=${restaurantFilter}&time=${timeFilter}`
      );
      setTransactionReport(res.data.data || {});
    } catch (err) {
      setError('Failed to load transaction report.');
    }
  };

  // Load restaurants once
  useEffect(() => {
    fetchResturants();
  }, []);

  // Reload orders and report on filter/page change
  useEffect(() => {
    fetchTotalOrders();
    fetchTransactionReport();
  }, [restaurantFilter, timeFilter, page, searchOrderNo]);

  // Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [restaurantFilter, timeFilter, searchOrderNo]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4} gap={2}>
        <BarChart2 />
        <Typography variant="h5" fontWeight={600}>
          Transaction Report
        </Typography>

        <Box ml="auto" display="flex" gap={2}>
          {/* Restaurant Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Restaurants</MenuItem>
              {restaurants?.map((data: any) => (
                <MenuItem key={data?.id} value={data?.restaurants_no}>
                  {data?.name} {data?.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Time Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>

          {/* Search by Order ID */}
          {/* <TextField
            size="small"
            placeholder="Search Order ID"
            value={searchOrderNo}
            onChange={(e) => setSearchOrderNo(e.target.value)}
            sx={{ minWidth: 180 }}
          /> */}
        </Box>
      </Box>

      {/* Loader/Error */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <>
          {/* Summary Cards */}
          <Box display="flex" gap={2} mb={4}>
            {['complete', 'onHold', 'refunded'].map((key) => {
              const bg = key === 'complete' ? '#e6f4ea' : key === 'onHold' ? '#e3f2fd' : '#ffebee';
              const label =
                key === 'complete'
                  ? 'Completed Transactions'
                  : key === 'onHold'
                  ? 'On-Hold Transactions'
                  : 'Refunded Transactions';

              return (
                <Card key={key} sx={{ flex: 1, bgcolor: bg, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" align="center" sx={{ pb: 1 }}>
                      {label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} align="center" sx={{ color: 'primary.main', pb: 1 }}>
                      ₹{transactionReport?.[key]?.totalAmount || '0.00'}
                    </Typography>
                    <Typography variant="body2" align="center">
                      Total Orders: {transactionReport?.[key]?.count || 0}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Orders Table */}
<Box display="flex" justifyContent="flex-end" mb={1}>
  <TextField
    size="small"
    placeholder="Search Order ID"
    value={searchOrderNo}
    onChange={(e) => {
      setSearchOrderNo(e.target.value);
      setPage(1); // Reset page when search changes
    }}
    sx={{ minWidth: 180 }}
  />
</Box>

          {/* Orders Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Item Total</TableCell>
                  <TableCell>Coupon Discount</TableCell>
                  <TableCell>Discounted Amount</TableCell>
                  <TableCell>VAT/Tax</TableCell>
                  <TableCell>Delivery Charge</TableCell>
                  <TableCell>Packaging</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Received By</TableCell>
                  <TableCell>Payment Method</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalOrders.length > 0 ? (
                  totalOrders.map((order, index) => (
                    <TableRow key={order.Order_no}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.Order_no}</TableCell>
                      <TableCell>
                        {order.userInfo?.firstName} {order.userInfo?.lastName}
                      </TableCell>
                      <TableCell>₹{order.item_total}</TableCell>
                      <TableCell>₹{order.discount}</TableCell>
                      <TableCell>₹{order.discount}</TableCell>
                      <TableCell>₹{order.gst}</TableCell>
                      <TableCell>{order.delivery ?? 'NA'}</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>
                        ₹{order.total_price}
                        <Typography variant="caption" color={order.payment_status === 'Paid' ? 'green' : 'error'}>
                          ({order.payment_status})
                        </Typography>
                      </TableCell>
                      <TableCell>{order.amount_received_by}</TableCell>
                      <TableCell>{order.payment_method}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
          </Box>
        </>
      )}
    </Box>
  );
}
