'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import EditBestPizzaModal from '../formComponent/EditBestPizzaModal';

interface BestPizzaData {
  best_pizza_heading: string;
  best_pizza_heading2: string;
  best_pizza_title: string;
  best_pizza_desc: string | null;
  best_pizza_img1: string;
  best_pizza_img2: string;
  best_pizza_bgcolor: string;
}

interface UpdatedForm {
  heading: string;
  heading2: string;
  title: string;
  description: string | null;
  image1?: File | null;
  image2?: File | null;
  bgcolor: string;
}

function BestPizzaComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<BestPizzaData | null>(null);

  const { apiGetValueBestPizzaContent, apiUpdateValueBestPizzaContent } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: BestPizzaData }>(apiGetValueBestPizzaContent);
      setData(res.data.data);
    } catch {
      toast.error('Error fetching Best Pizza data');
    }
  }, [apiGetValueBestPizzaContent]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updatedForm: UpdatedForm): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('best_pizza_heading', updatedForm.heading);
      payload.append('best_pizza_heading2', updatedForm.heading2);
      payload.append('best_pizza_title', updatedForm.title);
      payload.append('best_pizza_desc', updatedForm.description ?? '');
      payload.append('best_pizza_bgcolor', updatedForm.bgcolor);

      if (updatedForm.image1) {
        payload.append('best_pizza_img1', updatedForm.image1);
      }
      if (updatedForm.image2) {
        payload.append('best_pizza_img2', updatedForm.image2);
      }

      const res = await axios.put<{ status: string }>(apiUpdateValueBestPizzaContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        await fetchData();
        setOpen(false);
      }
    } catch {
      toast.error('Error updating Best Pizza section');
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Best Pizza Section Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm={3} textAlign="center">
          <CardMedia
            component="img"
            image={data.best_pizza_img1}
            alt="Pizza Image 1"
            sx={{
              width: 100,
              height: 100,
              borderRadius: '12px',
              mx: 'auto',
              boxShadow: 3,
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
          <Typography variant="caption" display="block" mt={1}>
            Image 1
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3} textAlign="center">
          <CardMedia
            component="img"
            image={data.best_pizza_img2}
            alt="Pizza Image 2"
            sx={{
              width: 100,
              height: 100,
              borderRadius: '12px',
              mx: 'auto',
              boxShadow: 3,
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
          <Typography variant="caption" display="block" mt={1}>
            Image 2
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight={500}>
            Heading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.best_pizza_heading}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Sub-heading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.best_pizza_heading2}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.best_pizza_title}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Description
          </Typography>
          <Typography variant="body1">{data.best_pizza_desc || 'No description provided'}</Typography>
        </Grid>

        <Grid item xs={12} sm={3} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Edit Best Pizza Section
          </Button>
        </Grid>
      </Grid>

      <EditBestPizzaModal
        open={open}
        onClose={() => setOpen(false)}
        data={{
          heading: data.best_pizza_heading,
          heading2: data.best_pizza_heading2,
          title: data.best_pizza_title,
          description: data.best_pizza_desc,
          image1: data.best_pizza_img1,
          image2: data.best_pizza_img2,
          bgcolor: data.best_pizza_bgcolor,
        }}
        onSave={handleSave}
      />
    </Card>
  );
}

export default BestPizzaComponent;
