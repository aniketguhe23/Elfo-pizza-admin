'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  InputAdornment,
  Pagination,
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

import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function ItemVariantComponent(): React.ReactElement {
  const router = useRouter();
  const { apiGetAllOrders } = ProjectApiList();

  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [orderNoSearch, setOrderNoSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ data: any[]; count: number }>(
        `${apiGetAllOrders}?order_no=${orderNoSearch}&page=${page}&limit=${limit}`
      );
      setOrderData(res.data.data || []);
      setTotalCount(res.data.count || 0);
    } catch (error) {
      toast.error('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [apiGetAllOrders, orderNoSearch, page, limit]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orderData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'orders.xlsx');
  };

  const exportToCSV = () => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(orderData));
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

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
            placeholder="Search by Order No"
            variant="outlined"
            value={orderNoSearch}
            onChange={(e) => {
              setPage(1);
              setOrderNoSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />

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
              {/* <TableCell>Restaurant</TableCell> */}
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData.length > 0 ? (
              orderData.map((order: any, index) => (
                <TableRow key={order.id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
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
                  {/* <TableCell>
                    <Typography variant="body2">{order.restaurantInfo?.address}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.restaurantInfo?.contact_phone}
                    </Typography>
                  </TableCell> */}
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

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(totalCount / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default ItemVariantComponent;
