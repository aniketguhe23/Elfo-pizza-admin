import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryItem {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  subcategoryName?: string;
  categoryName?: string;
  isVegetarian?: boolean | number;
  is_vegetarian?: boolean;
  isAvailable?: boolean | number;
  is_available?: boolean;
}

interface LatestOrdersProps {
  data?: CategoryItem[];
  onClick?: (item: CategoryItem) => void;
  onDelete?: (item: CategoryItem) => void;
  loading?: boolean;
  sx?: SxProps;
}

export function ListingTable({
  data = [],
  onClick,
  onDelete,
  loading = false,
  sx,
}: LatestOrdersProps): React.JSX.Element {
  const renderSkeletonRows = Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: 8 }).map((__, i) => (
        <TableCell key={i}>
          <Skeleton variant="rectangular" width="100%" height={20} />
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <Card sx={sx}>
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Item </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              {/* <TableCell>isVegetarian</TableCell> */}
              <TableCell>isAvailable</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" fontWeight={500} py={2}>
                    No items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow hover key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
                  <TableCell>{item.categoryName || '-'}</TableCell>
                  {/* <TableCell>
                    {item.isVegetarian === 1 || item.is_vegetarian === true ? 'Yes' : 'No'}
                  </TableCell> */}
                  <TableCell>
                    {item.is_available === true ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onClick?.(item)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton onClick={() => onDelete?.(item)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
