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
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
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
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { AlertCircle, ChevronDown, Clock, Eye, FileBarChart, FileDown, Search } from 'lucide-react';

export default function OrderReportsPage() {
  const { apiOrderReportofResturant, apiGetAllOrdersbyResturant, apiGetResturants } = ProjectApiList();
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('all');
  const [ordersReport, setOrdersReport] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restaurants_no, setResturant_no] = useState<any>('');
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState<any[]>([]);
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [restaurants, setResturant] = useState([]);
  const [restaurantFilter, setRestaurantFilter] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // or any default
  const [totalPages, setTotalPages] = useState(0);

  // const selectStyles = {
  //   minWidth: 180,
  //   '& .MuiOutlinedInput-root': {
  //     borderRadius: 1,
  //     fontSize: '0.875rem',
  //     height: 36,
  //   },
  //   '& .MuiOutlinedInput-notchedOutline': {
  //     borderColor: '#ccc',
  //   },
  //   '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //     borderColor: '#666',
  //   },
  // };

  const fetchResturants = async () => {
    try {
      const res = await axios.get(`${apiGetResturants}`);
      setResturant(res.data.data || []);
    } catch (err) {
      setError('Failed to load orders.');
    }
  };

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('restaurant');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed?.restaurants_no) {
          setResturant_no(parsed.restaurants_no);
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage restaurant:', error);
    } finally {
      setRestaurantLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchOrdersReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiOrderReportofResturant}?restaurant_id=${restaurantFilter}&time=${timeFilter}`
        );
        setOrdersReport(response.data.data || {});
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersReport();
  }, [apiOrderReportofResturant, timeFilter, restaurantFilter]);

  const fetchTotalOrders = async () => {
    try {
      const response = await axios.get(
        `${apiGetAllOrdersbyResturant}?restaurant_id=${restaurantFilter}&time=${timeFilter}&page=${page}&limit=${limit}`
      );
      setTotalOrders(response.data.data || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching total orders:', err);
      setError('Failed to load total orders.');
    }
  };

  useEffect(() => {
    fetchResturants();
  }, []);

  useEffect(() => {
    fetchTotalOrders();
  }, [restaurantFilter, timeFilter, page]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'primary.light';
      case 'Confirmed':
      case 'Accepted':
      case 'Processing':
      case 'Ready_For_Delivery':
      case 'Food_on_the_way':
      case 'Scheduled':
        return 'warning.light';
      case 'Delivered':
      case 'Dine_In':
        return 'success.light';
      case 'Refunded':
        return 'secondary.light';
      case 'Refunded_Requested':
        return 'pink';
      case 'Payment_Failed':
      case 'Cancelled':
        return 'error.light';
      default:
        return 'grey.300';
    }
  };

  const filteredOrders = totalOrders.filter((order) =>
    order.Order_no.toLowerCase().includes(searchOrderNo.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <FileBarChart size={24} />
          Order Report
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">ELFO'S PIZZA</Typography>
        <Box display="flex" flexDirection="row" gap={1}>
          <FormControl
            size="small"
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: '0.875rem',
                height: 36,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#666',
              },
            }}
            variant="outlined"
          >
            <Select value={restaurantFilter} onChange={(e) => setRestaurantFilter(e.target.value)} displayEmpty>
              <MenuItem value="">All Restaurants</MenuItem>
              {restaurants?.map((data: any) => (
                <MenuItem key={data?.id} value={data?.restaurants_no}>
                  {data?.name} {data?.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: '0.875rem',
                height: 36,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#666',
              },
            }}
            variant="outlined"
          >
            <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} displayEmpty>
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Report Cards */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={2} mb={4}>
        {[
          { label: 'Confirmed Orders', value: ordersReport?.Confirmed, color: '#E0F7FA' },
          { label: 'Pending Orders', value: ordersReport?.Pending, color: '#FFF3E0' },
          { label: 'Ready for delivery', value: ordersReport?.Ready_For_Delivery, color: '#E8F5E9' },
          { label: 'Processing Orders', value: ordersReport?.Processing, color: '#FFFDE7' },
          { label: 'Food On the Way', value: ordersReport?.Food_on_the_way, color: '#E3F2FD' },
          { label: 'Delivered', value: ordersReport?.Delivered, color: '#E6EE9C' },
          { label: 'Cancelled', value: ordersReport?.Cancelled, color: '#FFEBEE' },
          { label: 'Refunded', value: ordersReport?.Refunded, color: '#F3E5F5' },
          { label: 'Cancelled By Customer', value: ordersReport?.Cancelled_By_Customer, color: '#ECEFF1' },
        ].map((report, idx) => (
          <Card
            key={idx}
            variant="outlined"
            sx={{
              backgroundColor: report.color,
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {loading ? <CircularProgress size={20} /> : report.value ?? 0}
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                {report.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Orders Table */}
      <Typography variant="h6" mb={2}>
        Total Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Total Item Amount</TableCell>
              <TableCell>Coupon Discount</TableCell>
              <TableCell>Discounted Amount</TableCell>
              <TableCell>Vat/Tax</TableCell>
              <TableCell>Delivery Charge</TableCell>
              <TableCell>Extra Packaging</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Received By</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length ? (
              filteredOrders.map((order, index) => (
                <TableRow key={order.Order_no}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.Order_no}</TableCell>
                  <TableCell>
                    {order.userInfo.firstName} {order.userInfo.lastName}
                  </TableCell>
                  <TableCell>{order.item_total}</TableCell>
                  <TableCell>{order.discount}</TableCell>
                  <TableCell>{order.discount}</TableCell>
                  <TableCell>{order.gst}</TableCell>
                  <TableCell>{order.delivery ?? 'NA'}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>{order.total_price}</TableCell>
                  <TableCell>{order.amount_received_by ?? " -"}</TableCell>
                  <TableCell>{order.payment_method}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: getStatusColor(order.order_status),
                        borderRadius: 1,
                        fontSize: 12,
                        fontWeight: 500,
                        display: 'inline-block',
                      }}
                    >
                      {order.order_status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/dashboard/allOrders/orderById?order_no=${order.Order_no}`)}
                    >
                      <Eye size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} align="center">
                  No orders found.
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
    </Box>
  );
}
