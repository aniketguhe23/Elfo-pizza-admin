'use client';

import * as React from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Visibility } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { toast } from 'react-toastify';

import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { CircularProgress } from '@mui/material';

export default function Page(): React.JSX.Element {
  const { apiUserData } = ProjectApiList();

  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [searchText, setSearchText] = React.useState<string>('');

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUserData}`, {
        params: {
          page,
          limit: 10,
          search: searchText.trim(),
        },
      });
      const { users, totalPages } = res.data;

      setCustomers(users);
      setTotalPages(totalPages);
    } catch (err) {
      toast.error('Failed to fetch customers. Please try again later.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUserData, page, searchText]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1); // reset to first page on search
    setSearchText(e.target.value);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} mt={3} alignItems="center">
        <Typography variant="h4" sx={{ flex: 1 }}>
          Customers
        </Typography>
        <TextField size="small" label="Search by name or mobile" value={searchText} onChange={handleSearchChange} />
      </Stack>

      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <>
          <CustomersTable rows={customers} />
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} mt={3}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handlePrevious}
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
              onClick={handleNext}
              disabled={page === totalPages}
              sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
            >
              Next
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
