'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Card,
  CardMedia,
  Typography,
  Button,
  Divider,
  Grid,
} from '@mui/material';

import PizzaCardEdit from '../formComponent/PizzaCardEdit';

interface HeroData {
  hero_title_1: string;
  hero_title_2: string;
  hero_title_3: string;
  hero_img: string;
}

interface HeroApiResponse {
  status: string;
  data: HeroData;
}

interface FormDataProps {
  title: string;
  subtitle: string;
  description: string;
  image?: File | null;
  imageUrl?: string;
}

function PizzaCard(): JSX.Element {
  const [data, setData] = useState<HeroData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { apiGetHedroData, apiUpdateHeroData } = ProjectApiList();

  const fetchPizzaData = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<HeroApiResponse>(apiGetHedroData);
      setData(response.data.data);
    } catch (error) {
      toast.error('Error fetching hero data');
    }
  }, [apiGetHedroData]);

  useEffect(() => {
    void fetchPizzaData();
  }, [fetchPizzaData]);

  const updateHeroContent = async (formData: FormDataProps): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('hero_title_1', formData.title);
      payload.append('hero_title_2', formData.subtitle);
      payload.append('hero_title_3', formData.description);
      if (formData.image) {
        payload.append('hero_img', formData.image);
      }

      const response = await axios.put(apiUpdateHeroData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if ((response.data as { status: string }).status === 'success') {
        setIsEditing(false);
        await fetchPizzaData();
      }
    } catch (error) {
      toast.error('Error updating hero content');
    }
  };

  if (!data) return <div />;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Hero Section
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4} textAlign="center">
          <CardMedia
            component="img"
            image={data.hero_img}
            alt="Hero"
            sx={{
              width: 180,
              height: 180,
              borderRadius: 2,
              objectFit: 'cover',
              boxShadow: 3,
              backgroundColor: '#fff',
              p: 1,
              mx: 'auto',
            }}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" gutterBottom>
            {data.hero_title_1}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Subtitle
          </Typography>
          <Typography variant="body1" gutterBottom>
            {data.hero_title_2}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Description
          </Typography>
          <Typography variant="body1">{data.hero_title_3}</Typography>
        </Grid>

        <Grid item xs={12} sm={3} textAlign="center">
          <Button
            variant="contained"
            onClick={() => {setIsEditing(true)}}
            sx={{
              mt: { xs: 2, sm: 0 },
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Edit Hero
          </Button>
        </Grid>
      </Grid>

      <PizzaCardEdit
        open={isEditing}
        onCancel={() => {setIsEditing(false)}}
        defaultValues={{
          title: data.hero_title_1,
          subtitle: data.hero_title_2,
          description: data.hero_title_3,
          image: null,
          imageUrl: data.hero_img,
        }}
        onSubmit={updateHeroContent}
      />
    </Card>
  );
}

export default PizzaCard;
