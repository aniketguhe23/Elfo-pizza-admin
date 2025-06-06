'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditHeroCardModal from '../formComponent/EditHeroCardModal';
// import EditNavCardModal from '../formComponent/EditNavCardModal'; // Rename if needed

// Define type for Hero data returned from API
interface HeroData {
  hero_title: string;
  hero_subtitle: string;
  hero_bg: string;
}

// Define type for form data passed to onSave
interface UpdatedForm {
  title: string;
  description: string;
  image1?: File | null;
}

function HeroCardComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  const { apiGetValueHeroContent, apiUpdateValueHeroContent } = ProjectApiList();

  const fetchHeroData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: HeroData }>(apiGetValueHeroContent);
      setHeroData(res.data.data);
    } catch (err) {
      toast.error("Error fetching hero content");
    }
  }, [apiGetValueHeroContent]);

  useEffect(() => {
    void fetchHeroData();
  }, [fetchHeroData]);

  const handleSave = async (updatedForm: UpdatedForm): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('hero_title', updatedForm.title);
      payload.append('hero_subtitle', updatedForm.description);
      if (updatedForm.image1) {
        payload.append('hero_bg', updatedForm.image1);
      }

      const res = await axios.put<{ status: string }>(apiUpdateValueHeroContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        await fetchHeroData();
        setOpen(false);
      }
    } catch (err) {
      toast.error('Error updating hero section');
    }
  };

  if (!heroData) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Hero Section Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3} textAlign="center">
          <CardMedia
            component="img"
            image={heroData.hero_bg}
            alt="Hero Background"
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
        </Grid>

        <Grid item xs={12} sm={5}>
          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {heroData.hero_title}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Subtitle
          </Typography>
          <Typography variant="body1">{heroData.hero_subtitle}</Typography>
        </Grid>

        <Grid item xs={12} sm={4} textAlign="center">
          <Button
            variant="contained"
            size="medium"
            onClick={() => setOpen(true)}
            sx={{
              mt: { xs: 2, sm: 0 },
              ml: 15,
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Edit Hero Section
          </Button>
        </Grid>
      </Grid>

      <EditHeroCardModal
        open={open}
        onClose={() => setOpen(false)}
        data={{
          title: heroData.hero_title,
          description: heroData.hero_subtitle,
          image1: heroData.hero_bg,
        }}
        onSave={handleSave}
      />
    </Card>
  );
}

export default HeroCardComponent;
