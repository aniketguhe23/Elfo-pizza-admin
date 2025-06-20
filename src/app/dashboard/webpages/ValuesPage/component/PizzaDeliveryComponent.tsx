'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditPizzaDeliveryModal from '../formComponent/EditPizzaDeliveryModal';

interface PizzaDeliveryData {
  pizza_delivery_heading: string;
  pizza_delivery_title: string;
  pizza_delivery_desc: string | null;
  pizza_delivery_img: string;
}

interface UpdatedForm {
  heading: string;
  title: string;
  description: string | null;
  image1?: File | null;
}

function PizzaDeliveryComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<PizzaDeliveryData | null>(null);

  const { apiGetPizzaDeliveryContent, apiUpdatePizzaDeliveryContent } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: PizzaDeliveryData }>(apiGetPizzaDeliveryContent);
      setData(res.data.data);
    } catch {
      toast.error('Error fetching Pizza Delivery data');
    }
  }, [apiGetPizzaDeliveryContent]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updatedForm: UpdatedForm): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('pizza_delivery_heading', updatedForm.heading);
      payload.append('pizza_delivery_title', updatedForm.title);
      payload.append('pizza_delivery_desc', updatedForm.description ?? '');

      if (updatedForm.image1) {
        payload.append('pizza_delivery_img', updatedForm.image1);
      }

      const res = await axios.put<{ status: string }>(apiUpdatePizzaDeliveryContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        await fetchData();
        setOpen(false);
      }
    } catch {
      toast.error('Error updating Pizza Delivery section');
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Pizza Delivery Section Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm={4} textAlign="center">
          <CardMedia
            component="img"
            image={data.pizza_delivery_img}
            alt="Pizza Delivery"
            sx={{
              width: 150,
              height: 150,
              borderRadius: '12px',
              mx: 'auto',
              boxShadow: 3,
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
          <Typography variant="caption" display="block" mt={1}>
            Delivery Image
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Typography variant="subtitle1" fontWeight={500}>
            Heading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.pizza_delivery_heading}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.pizza_delivery_title}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Description
          </Typography>
          <Typography variant="body1">
            {data.pizza_delivery_desc || 'No description provided'}
          </Typography>
        </Grid>

        <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {setOpen(true)}}
            sx={{
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Edit Pizza Delivery Section
          </Button>
        </Grid>
      </Grid>

      <EditPizzaDeliveryModal
        open={open}
        onClose={() => {setOpen(false)}}
        data={{
          heading: data.pizza_delivery_heading,
          title: data.pizza_delivery_title,
          description: data.pizza_delivery_desc,
          image1: data.pizza_delivery_img,
        }}
        onSave={handleSave}
      />
    </Card>
  );
}

export default PizzaDeliveryComponent;
