'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectApiList from '@/app/api/ProjectApiList';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

interface Order {
  id: string;
  Order_no: string;
  order_status: string;
  total_price: string;
}

interface User {
  id: number;
  waId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  address_home: string;
  address_work: string;
  address_others: string;
}

export default function CustomerDetailPage() {
  const { apiUserDatabyId, apiGetUserOrdersById } = ProjectApiList();
    const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCustomerAndOrders() {
      try {
        // Fetch user details
        const resUser = await axios.get(`${apiUserDatabyId}/${customerId}`);
        const userData = resUser.data.user as User;
        setUser(userData);

        // Fetch user's orders
        const resOrders = await axios.get(`${apiGetUserOrdersById}/${userData?.waId}`);
        const fetchedOrders = resOrders.data.data as Order[];
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Failed to fetch user or orders:', err);
      }
    }

    if (customerId) fetchCustomerAndOrders();
  }, [customerId]);

  const filteredOrders = orders.filter((order) => order.Order_no.toLowerCase().includes(search.toLowerCase()));

  if (!user) return null;

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight={700}>
        Customer Id #{user.id}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        🎂 DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={600}>Order List ({orders?.length})</Typography>
              <TextField
                placeholder="Search by ID..."
                size="small"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl</TableCell>
                  <TableCell>Order Id</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.Order_no}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.order_status}
                        color={order.order_status === 'Delivered' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>₹ {order.total_price}</TableCell>
                    <TableCell align="right">
                      <IconButton color="secondary">
                        <VisibilityIcon
                          onClick={() => router.push(`/dashboard/allOrders/orderById?order_no=${order.Order_no}`)}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar sx={{ width: 56, height: 56 }}>{user.firstName[0]}</Avatar>
              <Box>
                <Typography fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmailIcon fontSize="small" />
                  <Typography variant="body2">{user.email}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PhoneIcon fontSize="small" />
                  <Typography variant="body2">{user.mobile}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ShoppingBagIcon fontSize="small" />
                  <Typography variant="body2">{orders?.length} Orders</Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
