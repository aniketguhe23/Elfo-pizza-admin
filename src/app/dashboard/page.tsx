'use client';

import { AnyARecord } from 'node:dns';

import React, { useEffect, useState } from 'react';
import { DateRange } from '@mui/icons-material';
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
// import { format } from 'date-fns';
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import CustomDatePicker from '@/components/dashboard/dashboardItems/CustomDatePicker';

import ProjectApiList from '../api/ProjectApiList';

const Dashboard = () => {
  // const COLORS = ['#f47335', '#66BB6A'];

  // =================================================================>
  const {
    apigetTotalSalesChart,
    apigetTopSellingItems,
    apigetAverageOrderValue,
    apigetTopRestaurantsByOrders,
    apigetTotalCustomers,
    apigetSalesTypePieChart,
    apiGetResturants,
  } = ProjectApiList();

  const [activeFilter, setActiveFilter] = useState('all');
  const [salesReport, setSalesReport] = useState<any>({});
  // const [salesTypePieChart, setSalesTypePieChart] = useState<any>({});
  // const [totalCustomers, setTotalCustomers] = useState<any>();
  const [salesTypePieChart, setSalesTypePieChart] = useState<any>([]);
  const [OrderTypesData, setOrderTypesData] = useState<any>([]);
  const [totalCustomers, setTotalCustomers] = useState<any>([]);
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [restaurants, setResturant] = useState([]);

  const [topRestaurantsByOrders, setTopRestaurantsByOrders] = useState<any>();
  const [topRestaurantss, setTopRestaurants] = useState<any>();
  const [averageOrderValue, setAverageOrderValue] = useState<any>();
  const [topSellingItems, setTopSellingItems] = useState<any>();
  const [totalTopSellingItems, setTotalTopSellingItems] = useState<any>();
  const [totalSalesReport, setTotalSalesReport] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [date, setDate] = useState<AnyARecord>();
  const [startDate, setStartDate] = useState<string>(''); // for range.from
  const [endDate, setEndDate] = useState<string>(''); // for range.to

  const fetchResturants = async () => {
    try {
      const res = await axios.get(`${apiGetResturants}`);
      setResturant(res.data.data || []);
    } catch (err) {
      setError('Failed to load orders.');
    }
  };

  const theme = useTheme();
  const COLORS = ['#66BB6A', '#42A5F5', '#FFA726', '#AB47BC'];

  const chartCardStyle = {
    p: 2,
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: theme.palette.background.paper,
  };

  const sectionTitle = (title: string, subtitle?: string) => (
    <>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
      )}
    </>
  );
  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchOrdersReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTotalSalesChart}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurantId=${restaurantFilter}`
        );
        setSalesReport(response.data.data || []); // ✅ also set default to object
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersReport();
  }, [activeFilter, endDate, startDate, restaurantFilter]);

  useEffect(() => {
    if (Array.isArray(salesReport) && salesReport.length > 0) {
      const totalSalesData = salesReport?.map((entry) => ({
        date: entry.period,
        sales: Number(entry.total_sales),
      }));
      setTotalSalesReport(totalSalesData);
    }
  }, [salesReport]);

  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchTopSellingItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTopSellingItems}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurant_id=${restaurantFilter}`
        );
        setTopSellingItems(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingItems();
  }, [activeFilter, endDate, startDate, restaurantFilter]);

  useEffect(() => {
    if (Array.isArray(topSellingItems) && topSellingItems.length > 0) {
      const totalData = topSellingItems.map((entry) => ({
        name: entry.name,
        quantity: Number(entry.sold),
      }));
      setTotalTopSellingItems(totalData);
    }
  }, [salesReport]);

  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchAverageOrderValue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetAverageOrderValue}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurant_id=${restaurantFilter}`
        );
        setAverageOrderValue(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchAverageOrderValue();
  }, [activeFilter, endDate, startDate, restaurantFilter]);

  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchAverageOrderValue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTopRestaurantsByOrders}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurantId=`
        );
        setTopRestaurantsByOrders(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchAverageOrderValue();
  }, [activeFilter, endDate, startDate, restaurantFilter]);

  useEffect(() => {
    if (Array.isArray(topRestaurantsByOrders) && topRestaurantsByOrders.length > 0) {
      const totalData = topRestaurantsByOrders?.map((entry) => ({
        name: entry.restaurant,
        orders: Number(entry.orders),
      }));
      setTopRestaurants(totalData);
    }
  }, [topRestaurantsByOrders]);

  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchAverageOrderValue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTotalCustomers}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurantId=`
        );
        setTotalCustomers(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchAverageOrderValue();
  }, [activeFilter, endDate, startDate, restaurantFilter]);

  useEffect(() => {
    const fetchSalesTypePieChart = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetSalesTypePieChart}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurant_id=${restaurantFilter}`
        );
        setSalesTypePieChart(response.data.data || []);
      } catch (err: any) {
        console.error('Error fetching sales type pie chart:', err);
        setError('Failed to load sales type pie chart.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesTypePieChart();
  }, [activeFilter, endDate, startDate, restaurantFilter]);

  useEffect(() => {
    if (Array.isArray(salesTypePieChart) && salesTypePieChart.length > 0) {
      const orderTypesData = salesTypePieChart.map((item: any) => ({
        name: item.type,
        value: item.value,
        fill: item.fill,
      }));
      setOrderTypesData(orderTypesData);
    }
  }, [salesTypePieChart]);

  useEffect(() => {
    fetchResturants();
  }, []);

  const formatRupee = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <Grid container spacing={3} p={3}>
      {/* Filter Header */}
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* Dashboard Title on the Left */}
            <Grid item>
              <Typography variant="h3" fontWeight={600}>
                Dashboard
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ flexWrap: 'wrap', rowGap: 2 }}
              >
                {/* Restaurant Selector */}
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      height: 38,
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
                  <Select
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                    size="small"
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

                {/* Toggle Button Filter */}
                <ToggleButtonGroup
                  value={activeFilter}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) setActiveFilter(newValue);
                  }}
                  color="primary"
                  sx={{
                    borderRadius: 5,
                    backgroundColor: '#f5f5f5',
                    p: 0.5,
                    gap: 1,
                    boxShadow: 1,
                    flexWrap: 'wrap',
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: 20,
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      px: 2,
                      py: 0.8,
                      fontSize: '0.875rem',
                      color: '#555',
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        fontWeight: 600,
                      },
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                    },
                  }}
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="weekly">Weekly</ToggleButton>
                  <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>

                {/* Date Pickers */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ mt: 0, flexWrap: 'wrap' }}
                >
                  <Stack direction="column" alignItems="start" spacing={0}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                      Start Date:
                    </Typography>
                    <TextField
                      type="date"
                      size="small"
                      variant="outlined"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      sx={{
                        minWidth: 150,
                        '& input': { padding: '8.5px 10px' },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  <Stack direction="column" alignItems="start" spacing={0}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                      End Date:
                    </Typography>
                    <TextField
                      type="date"
                      size="small"
                      variant="outlined"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      sx={{
                        minWidth: 150,
                        '& input': { padding: '8.5px 10px' },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Total Sales Over Time */}
      <Grid item xs={12} md={8}>
        <Paper sx={chartCardStyle}>
          {sectionTitle('Total Sales Over Time', 'Monthly sales performance')}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={totalSalesReport}>
              <XAxis dataKey="date" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} tickFormatter={(value) => formatRupee(value)} />
              <Tooltip formatter={(value, name) => [formatRupee(Number(value)), name]} />
              <Line type="monotone" dataKey="sales" stroke="#00897B" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Order Types */}
      <Grid item xs={12} md={4}>
        <Paper sx={chartCardStyle}>
          {sectionTitle('Order Types', 'Distribution by service type')}
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={OrderTypesData} dataKey="value" nameKey="name" outerRadius={80}>
                {OrderTypesData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Top Selling Items */}
      <Grid item xs={12} md={6}>
        <Paper sx={chartCardStyle}>
          {sectionTitle('Top Selling Items', 'Most ordered items by quantity')}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={totalTopSellingItems}>
              <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" style={{ fontSize: '12px' }} />{' '}
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="quantity" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Average Order Value */}
      <Grid item xs={12} md={6}>
        <Paper sx={chartCardStyle}>
          {sectionTitle('Average Order Value', 'Monthly AOV trends')}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={averageOrderValue}>
              <XAxis dataKey="month" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} tickFormatter={(value) => formatRupee(value)} />
              <Tooltip formatter={(value) => formatRupee(Number(value))} />
              <Line dataKey="value" stroke="#EF5350" dot />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Top Restaurants */}
      <Grid item xs={12} md={6}>
        <Paper sx={chartCardStyle}>
          {sectionTitle('Top Restaurants', 'By order volume')}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topRestaurantss}>
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#26A69A" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Total Customers */}
      <Grid item xs={12} md={6}>
        <Paper sx={chartCardStyle}>
          {sectionTitle('Total Customers', 'Monthly customer growth')}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={totalCustomers}>
              <XAxis dataKey="month" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line dataKey="customers" stroke="#1E88E5" dot />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
