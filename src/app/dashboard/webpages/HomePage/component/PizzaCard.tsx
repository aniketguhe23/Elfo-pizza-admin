import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';

import PizzaCardEdit from '../formComponent/PizzaCardEdit';

const PizzaCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<any>('');

  let { api_getHedroData, api_updateHeroData } = ProjectApiList();

  const fetchPizzaData = async () => {
    try {
      const res = await axios.get(api_getHedroData);
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching pizza data:', error);
    }
  };

  useEffect(() => {
    fetchPizzaData();
  }, []);

  const updateHeroContent = async (formData: any) => {
    try {
      const payload = new FormData();
      payload.append('hero_title_1', formData.title);
      payload.append('hero_title_2', formData.subtitle);
      payload.append('hero_title_3', formData.description);

      if (formData.image) {
        payload.append('hero_img', formData.image);
      }

      const response = await axios.put(api_updateHeroData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'success') {
        setIsEditing(false);
        fetchPizzaData();
      }
    } catch (error) {
      console.error('Error updating hero content:', error);
    }
  };

  if (!data) return null;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Hero Section
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3} textAlign="center">
          <CardMedia
            component="img"
            image={data?.hero_img}
            alt="Pizza Image"
            sx={{
              width: 100,
              height: 100,
              borderRadius: 2,
              mx: 'auto',
              boxShadow: 3,
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight={600}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data?.hero_title_1}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600}>
            Subtitle
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {data?.hero_title_2}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600}>
            Description
          </Typography>
          <Typography variant="body2">{data?.hero_title_3}</Typography>
        </Grid>

        <Grid item xs={12} sm={3} textAlign="center">
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Edit Content
          </Button>
        </Grid>
      </Grid>

      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Hero Section</DialogTitle>
        <DialogContent>
          <PizzaCardEdit
            defaultValues={{
              title: data?.hero_title_1,
              subtitle: data?.hero_title_2,
              description: data?.hero_title_3,
              image: data?.hero_img,
            }}
            onSubmit={updateHeroContent}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PizzaCard;
