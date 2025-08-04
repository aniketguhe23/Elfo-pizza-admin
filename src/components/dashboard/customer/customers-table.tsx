'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

export interface Customer {
  id: string;
  waId?: string;
  avatar?: string;
  name: string;
  email: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  phone: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  mobile: string;
  created_at: string;
}

interface CustomersTableProps {
  rows?: Customer[];
  onView?: (customer: Customer) => void;
}

export function CustomersTable({ rows = [], onView }: CustomersTableProps): React.JSX.Element {
  const router = useRouter();
  const rowIds = React.useMemo(() => rows.map((customer) => customer.id), [rows]);
  const { selected } = useSelection(rowIds);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary" sx={{ py: 2 }}>
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const isSelected = selected?.has(row.id);
                return (
                  <TableRow hover key={row.id} selected={isSelected}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={row.avatar || '/assets/default-avatar.png'} />
                        <Typography variant="subtitle2" noWrap>
                          {row.firstName} {row.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>
                      {row.created_at ? dayjs(row.created_at).format('MMM D, YYYY') : '—'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          onView ? onView(row) : router.push(`/dashboard/customers/customerById?id=${row.id}`)
                        }
                        color="secondary"
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
