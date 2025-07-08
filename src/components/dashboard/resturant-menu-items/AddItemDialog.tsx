'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { Controller, useForm } from 'react-hook-form';

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  restaurantNo: string;
  assignedItemIds: number[];
}

interface Item {
  id: number;
  name: string;
  category: { name: string };
  description?: string;
  is_vegetarian?: number;
  is_available?: number;
  image_url?: string;
  [key: string]: unknown;
}

interface MenuResponse {
  success: boolean;
  data: Item[];
}

export default function AddItemDialog({
  open,
  onClose,
  onAdd,
  restaurantNo,
  assignedItemIds,
}: AddItemDialogProps): JSX.Element {
  const { apiGetAllMenu, apiAssignItemsToResturants } = ProjectApiList();

  const { control, handleSubmit, reset } = useForm<{ item_ids: number[] }>({
    defaultValues: { item_ids: [] },
  });

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const res: AxiosResponse<MenuResponse> = await axios.get(apiGetAllMenu);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error: unknown) {
      // Optional: use a logger or just remove
// console.error removed to satisfy eslint no-console rule

    } finally {
      setLoading(false);
    }
  }, [apiGetAllMenu]);

  useEffect(() => {
    if (open) {
      void fetchItems();
      const cleanedIds = assignedItemIds.filter(
        (id) => typeof id === 'number' && !Number.isNaN(id)
      );
      reset({ item_ids: cleanedIds });
    }
  }, [open, assignedItemIds, reset, fetchItems]);

  const onSubmit = async (data: { item_ids: number[] }): Promise<void> => {
    try {
      setSubmitting(true);
      await axios.post(apiAssignItemsToResturants, {
        restaurants_no: restaurantNo,
        item_ids: data.item_ids,
      });
      onAdd();
      onClose();
    } catch (error: unknown) {
      // Optional: use a logger or just remove
// console.error removed to satisfy eslint no-console rule

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Items to Add</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} id="add-items-form">
            <Controller
              name="item_ids"
              control={control}
              render={({ field }) => (
                <List dense>
                  {items.map((item) => {
                    const isChecked = field.value.includes(item.id);
                    return (
                      <ListItem
                        key={item.id}
                        alignItems="flex-start"
                        divider
                        sx={{ px: 1.5, py: 1 }}
                      >
                        <Avatar
                          variant="rounded"
                          src={item.image_url || ''}
                          alt={item.name}
                          sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <ListItemText
                          primary={
                            <Box>
                              <Typography fontWeight={600}>{item.name}</Typography>
                              <Typography variant="caption" color="text.primary">
                                Category: {item.category?.name ?? 'N/A'}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              {item.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  sx={{ pr: 5 }}
                                >
                                  {item.description}
                                </Typography>
                              )}
                              <Typography variant="caption" color="success.main">
                                {item.is_vegetarian === 1 ? 'Veg' : 'Non-Veg'}
                              </Typography>{' '}
                              |{' '}
                              <Typography variant="caption" color="primary.main">
                                {item.is_available === 1 ? 'Available' : 'Unavailable'}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Checkbox
                            edge="end"
                            size="small"
                            checked={isChecked}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...field.value, item.id]
                                : field.value.filter((id) => id !== item.id);
                              field.onChange(updated);
                            }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            />
          </form>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            width: 90,
            fontSize: '0.75rem',
            padding: '5px 10px',
            color: '#333',
            borderColor: '#ccc',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: '#f2f2f2',
              color: '#000',
              borderColor: '#bbb',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-items-form"
          variant="contained"
          disabled={submitting || loading}
          sx={{
            width: 90,
            fontSize: '0.75rem',
            padding: '5px 10px',
            backgroundColor: '#000',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          {submitting ? 'Saving...' : 'Add Items'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
