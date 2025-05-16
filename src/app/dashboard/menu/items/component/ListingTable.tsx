import * as React from 'react';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { Pencil, Trash2 } from 'lucide-react';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  refunded: { label: 'Refunded', color: 'error' },
} as const;

// export interface Order {
//   id: string;
//   customer: { name: string };
//   amount: number;
//   status: 'pending' | 'delivered' | 'refunded';
//   createdAt: Date;
// }

export interface LatestOrdersProps {
  data?: any;
  onClick?: any;
  sx?: SxProps;
}

export function ListingTable({ data = [], onClick, sx }: LatestOrdersProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      {/* <CardHeader title="Latest orders" /> */}
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>isVegetarian</TableCell>
              <TableCell>isAvailable</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((data: any, index: any) => {
              // const { label, color } = statusMap[data.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={data.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data?.description}</TableCell>
                  <TableCell>{data?.subcategoryName || '-'}</TableCell>
                  <TableCell>{data?.isVegetarian == 1 || data?.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{data?.isAvailable == 1 || data?.is_available ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <TableCell>
                      <IconButton onClick={() => onClick(data)}>
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
