import * as React from 'react';
import { useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import axios from 'axios'; // Import axios for HTTP requests
import { Pencil, Trash2 } from 'lucide-react';

interface ListingTableProps {
  data: CategoryItem[];
  onClick?: (item: CategoryItem) => void;
  fetchSizes: () => void;
}

interface CategoryItem {
  id: number;
  name: string;
  size?: string;
  price?: string;
}

export function ListingTable({ data, onClick, fetchSizes }: ListingTableProps): React.ReactElement {
  const { apiDeleteBreadSize } = ProjectApiList();

  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteItemId) {
      try {
        await axios.delete(`${apiDeleteBreadSize}/${deleteItemId}`); // Replace with your actual delete endpoint
        fetchSizes();
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
      } catch (error) {
        console.error('Failed to delete item', error);
        // Handle error state or show error message
      }
    }
  };

  return (
    <Card>
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow hover key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.size || '-'}</TableCell>
                <TableCell>{item.price || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onClick?.(item)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeleteItemId(item.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this item?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
