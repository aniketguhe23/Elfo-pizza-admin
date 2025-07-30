'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  AccessTime,
  Cancel,
  CheckCircle,
  DeliveryDining,
  ErrorOutline,
  Fastfood,
  HourglassBottom,
  InsertChart,
  LocalDining,
  LocalShipping,
  MonetizationOn,
  Payment,
  QueryBuilder,
  Visibility,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
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

export default function CampaignReportsPage() {
  const { apiOrderReportofResturant, apiGetAllOrdersbyResturant, apiGetResturants } = ProjectApiList();
  const router = useRouter();

  const [timeFilter, setTimeFilter] = useState('all');
  const [ordersReport, setOrdersReport] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalOrders, setTotalOrders] = useState<any[]>([]);
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [restaurants, setResturant] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // you can adjust default
  const [totalPages, setTotalPages] = useState(0);

  const fetchResturants = async () => {
    try {
      const res = await axios.get(`${apiGetResturants}`);
      setResturant(res.data.data || []);
    } catch (err) {
      setError('Failed to load restaurants.');
    }
  };

  const fetchOrdersReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiOrderReportofResturant}?restaurant_id=${restaurantFilter}&time=${timeFilter}`
      );
      setOrdersReport(response.data.data || {});
    } catch (err) {
      setError('Failed to load order report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await axios.get(
        `${apiGetAllOrdersbyResturant}?restaurant_id=${restaurantFilter}&time=${timeFilter}&page=${page}&limit=${limit}`
      );
      setTotalOrders(response.data.data || []);
      setTotalPages(response.data.totalPages || 1); // Ensure your API returns totalPages
    } catch (err) {
      setError('Failed to load total orders.');
    }
  };

  useEffect(() => {
    fetchResturants();
  }, []);

  useEffect(() => {
    fetchOrdersReport();
    fetchTotalOrders();
  }, [restaurantFilter, timeFilter, page, limit]);

  const filteredOrders = totalOrders.filter((order) =>
    order.Order_no.toLowerCase().includes(searchOrderNo.toLowerCase())
  );

  const statusMap: Record<string, string> = {
    Pending: 'Pending',
    // Confirmed: 'Confirmed',
    // Accepted: 'Accepted',
    Processing: 'Processing',
    // Ready_For_Delivery: 'Ready for Delivery',
    Food_on_the_way: 'On the Way',
    Delivered: 'Delivered',
    // Dine_In: 'Dine In',
    Refunded: 'Refunded',
    // Refund_Requested: 'Refund Requested',
    // Scheduled: 'Scheduled',
    Payment_Failed: 'Payment Failed',
    Cancelled: 'Cancelled',
  };

  const iconMap: Record<string, JSX.Element> = {
    Pending: <AccessTime />,
    Confirmed: <CheckCircle />,
    Accepted: <Fastfood />,
    Processing: <QueryBuilder />,
    Ready_For_Delivery: <LocalDining />,
    Food_on_the_way: <LocalShipping />,
    Delivered: <CheckCircle />,
    Dine_In: <LocalDining />,
    Refunded: <MonetizationOn />,
    Refund_Requested: <Payment />,
    Scheduled: <HourglassBottom />,
    Payment_Failed: <ErrorOutline />,
    Cancelled: <Cancel />,
  };
  const colorMap: Record<string, string> = {
    Pending: '#fdf2f8', // Light Orange
    Confirmed: '#BBDEFB', // Light Blue
    Accepted: '#C8E6C9', // Light Green
    Processing: '#B3E5FC', // Light Cyan
    Ready_For_Delivery: '#D1C4E9', // Light Purple
    Food_on_the_way: '#B2DFDB', // Teal Light
    Delivered: '#DCEDC8', // Lime Light Green
    Dine_In: '#F8BBD0', // Light Pink
    Refunded: '#FFCDD2', // Light Red
    Refund_Requested: '#FFE082', // Light Amber
    Scheduled: '#B2EBF2', // Light Aqua
    Payment_Failed: '#FFCCBC', // Light Coral
    Cancelled: '#E0E0E0', // Grey 300
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          <InsertChart sx={{ verticalAlign: 'middle', mr: 1 }} />
          Food Campaign Order Report
        </Typography>
        <Box display="flex" gap={1}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={restaurantFilter} onChange={(e) => setRestaurantFilter(e.target.value)} displayEmpty>
              <MenuItem value="">All Restaurants</MenuItem>
              {restaurants?.map((data: any) => (
                <MenuItem key={data?.id} value={data?.restaurants_no}>
                  {data?.name} - {data?.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
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

      {/* Order Summary Cards */}
      <Grid container spacing={2} mb={4}>
        {/* Total Orders - Big Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ backgroundColor: '#1e40af', color: 'white', borderRadius: 2, boxShadow: 4 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', p: 1.2, borderRadius: '50%' }}>
                  <InsertChart />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Total Orders
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                {ordersReport?.AllOrders?.count || 0}
              </Typography>
              <Typography variant="body1">Total Amount: ₹{ordersReport?.AllOrders?.totalAmount || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Cards */}
        {Object.keys(statusMap).map((status, index) => {
          const count = ordersReport?.[status] || 0;
          const bgColor = colorMap[status] || '#a78bfa';
          const icon = iconMap[status] || <InsertChart />;

          return (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card sx={{ backgroundColor: bgColor, color: 'black', borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {/* <Box
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        p: 1.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {icon}
                    </Box> */}
                    <Typography variant="subtitle1" fontWeight={500} sx={{ color: 'gray' }}>
                      {statusMap[status]}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Orders Table */}
      <Typography variant="h6" gutterBottom>
        Total Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SI</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Item Total</TableCell>
              <TableCell>Coupon Discount</TableCell>
              <TableCell>Discount Amount</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Paid By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
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
                <TableCell>{order.delivery || 'N/A'}</TableCell>
                <TableCell>₹{order.total_price}</TableCell>
                <TableCell>{order.amount_received_by}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    color={
                      order.order_status === 'Delivered'
                        ? 'success.main'
                        : order.order_status === 'Canceled'
                          ? 'error.main'
                          : 'text.secondary'
                    }
                  >
                    {order.order_status.replace(/_/g, ' ')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => router.push(`/dashboard/allOrders/orderById?order_no=${order.Order_no}`)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center">
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
