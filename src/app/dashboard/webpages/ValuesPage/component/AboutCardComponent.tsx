'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditAboutCardModal from '../formComponent/EditAboutCardModal';

interface AboutData {
  about_heading: string;
  about_title: string;
  about_subtitle: string;
  about_text: string;
  about_img: string;
}

interface UpdatedForm {
  heading: string;
  title: string;
  subtitle: string;
  text: string;
  image1?: File | null;
}

function AboutCardComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  const { apiGetValueAboutContent, apiUpdateValueAboutContent } = ProjectApiList();

  const fetchAboutData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: AboutData }>(apiGetValueAboutContent);
      setAboutData(res.data.data);
    } catch (err) {
      toast.error("Error fetching about content");
    }
  }, [apiGetValueAboutContent]);

  useEffect(() => {
    void fetchAboutData();
  }, [fetchAboutData]);

  const handleSave = async (updatedForm: UpdatedForm): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('about_heading', updatedForm.heading);
      payload.append('about_title', updatedForm.title);
      payload.append('about_subtitle', updatedForm.subtitle);
      payload.append('about_text', updatedForm.text);
      if (updatedForm.image1) {
        payload.append('about_img', updatedForm.image1);
      }

      const res = await axios.put<{ status: string }>(apiUpdateValueAboutContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        await fetchAboutData();
        setOpen(false);
      }
    } catch (err) {
      toast.error('Error updating about section');
    }
  };

  if (!aboutData) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        About Section Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3} textAlign="center">
          <CardMedia
            component="img"
            image={aboutData.about_img}
            alt="About Image"
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
            Heading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {aboutData.about_heading}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {aboutData.about_title}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Subtitle
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {aboutData.about_subtitle}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Text
          </Typography>
          <Typography variant="body1">{aboutData.about_text}</Typography>
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
            Edit About Section
          </Button>
        </Grid>
      </Grid>

      <EditAboutCardModal
        open={open}
        onClose={() => setOpen(false)}
        data={{
          heading: aboutData.about_heading,
          title: aboutData.about_title,
          subtitle: aboutData.about_subtitle,
          text: aboutData.about_text,
          image1: aboutData.about_img,
        }}
        onSave={handleSave}
      />
    </Card>
  );
}

export default AboutCardComponent;
