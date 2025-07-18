'use client';

import * as React from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export default function Page(): React.JSX.Element {
  const { apiUserData } = ProjectApiList();
  const page = 0;
  const rowsPerPage = 5;

  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ users: any[] }>(apiUserData);
      const users = res.data.users || [];

      const transformed: Customer[] = users.map((user, idx) => ({
        id: `${user.id}`,
        name: `${user.firstName} ${user.lastName}`,
        avatar: `/assets/avatar-${(idx % 10) + 1}.png`,
        email: user.email,
        phone: user.mobile,
        waId: user.waId,
        address: {
          street: user.address_home || '',
          city: '',
          state: '',
          country: '',
        },
        createdAt: new Date(user.dateOfBirth),
        action: (
          <Button
            variant="text"
            color="primary"
            startIcon={<Visibility />}
            onClick={() => toast.info(`Viewing ${user.firstName} ${user.lastName}`)}
          >
            View
          </Button>
        ),
      }));

      setCustomers(transformed);
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

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      {/* Space added using mt (margin top) */}
      <Stack direction="row" spacing={3} mt={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
      </Stack>

      <CustomersFilters />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <CustomersTable count={customers.length} page={page} rows={paginatedCustomers} rowsPerPage={rowsPerPage} />
      )}
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
