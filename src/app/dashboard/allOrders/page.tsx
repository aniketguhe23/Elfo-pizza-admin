'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
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
import { Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';

function ItemVariantComponent(): React.ReactElement {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { apiGetAllOrders } = ProjectApiList();

  const fetchAllOrders = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: any[] }>(apiGetAllOrders);
      setOrderData(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders. Please try again later.');
    }
  }, [apiGetAllOrders]);

  useEffect(() => {
    void fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    const filtered = orderData.filter((order) => {
      const matchSearch = order.userInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'all' || order.type === typeFilter;
      return matchSearch && matchType;
    });
    setFilteredOrders(filtered);
  }, [orderData, searchTerm, typeFilter]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'orders.xlsx');
  };

  const exportToCSV = () => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(filteredOrders));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'orders.csv');
  };

  const buttonStyle = {
    backgroundColor: '#000',
    color: '#fff',
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: '#222',
    },
  };

  return (
    <Box mt={5}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>
          All Orders
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by name"
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
          <Select
            size="small"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{ minWidth: 120, background: '#fff' }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="pickup">Pickup</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
          </Select>
          <Button onClick={exportToExcel} sx={buttonStyle}>
            Export Excel
          </Button>
          <Button onClick={exportToCSV} sx={buttonStyle}>
            Export CSV
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Order Id</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Customer Info</TableCell>
              <TableCell>Restaurant</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: any, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.Order_no}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.userInfo?.firstName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.userInfo?.mobile}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.restaurantInfo?.address}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.restaurantInfo?.contact_phone}
                    </Typography>
                  </TableCell>
                  <TableCell>₹{order.total_price}</TableCell>
                  <TableCell>{order.type === 'pickup' ? 'Pickup' : 'Delivery'}</TableCell>
                  <TableCell>
                    <Box
                    onClick={() => router.push(`/dashboard/allOrders/orderById?order_no=${order.Order_no}`)}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#000',
                          '& svg': {
                            color: '#fff',
                          },
                        },
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No orders found.
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
