'use client';

import * as React from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Visibility } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { toast } from 'react-toastify';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export default function Page(): React.JSX.Element {
  const { apiUserData } = ProjectApiList();

  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ users: any[] }>(apiUserData);
      const users = res.data.users || [];

      setCustomers(users);
    } catch (err) {
      toast.error('Failed to fetch customers. Please try again later.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUserData]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} mt={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
      </Stack>

      <CustomersFilters />

      {loading ? <Typography>Loading...</Typography> : <CustomersTable rows={customers} />}
    </Stack>
  );
}
