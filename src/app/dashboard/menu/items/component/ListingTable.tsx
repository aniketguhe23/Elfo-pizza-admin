import * as React from 'react';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Pencil, Trash2 } from 'lucide-react';

// Define a proper interface instead of using `any`
interface CategoryItem {
  id: number;
  name: string;
  description?: string;
  subcategoryName?: string;
  isVegetarian?: boolean | number;
  is_vegetarian?: boolean;
  isAvailable?: boolean | number;
  is_available?: boolean;
}

interface LatestOrdersProps {
  data?: CategoryItem[];
  onClick?: (item: CategoryItem) => void;
  onDelete?: (item: CategoryItem) => void;
  sx?: SxProps;
}

export function ListingTable({ data = [], onClick, onDelete, sx }: LatestOrdersProps): React.JSX.Element {
  return (
    <Card sx={sx}>
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
            {data.map((item, index) => (
              <TableRow hover key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description || '-'}</TableCell>
                <TableCell>{item.subcategoryName || '-'}</TableCell>
                <TableCell>{item.isVegetarian === 1 || item.is_vegetarian === true ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.isAvailable === 1 || item.is_available === true ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onClick?.(item)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton onClick={() => onDelete?.(item)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
