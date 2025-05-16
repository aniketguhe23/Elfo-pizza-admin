'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Box, Button, Card, CardMedia, Divider, Grid, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

import BannerEditForm from '../formComponent/BannerEditForm';

const Banner = () => {
  const [open, setOpen] = useState(false);
  const [bannerData, setBannerData] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { api_getBannerData, api_updateBannerData } = ProjectApiList();

  const fetchBannerData = async () => {
    try {
      const res = await axios.get(api_getBannerData);
      setBannerData(res.data.data);
    } catch (error) {
      console.error('Error fetching banner data:', error);
      setSnackbar({ open: true, message: 'Failed to load banner data', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  const updateBannerContent = async (formData: any) => {
    try {
      const payload = new FormData();
      payload.append('hero2_title_1', formData.hero2_title_1);
      payload.append('hero2_title_2', formData.hero2_title_2);
      payload.append('hero2_img1', formData.image1);
      payload.append('hero2_img2', formData.image2);
      payload.append('hero2_img3', formData.image3);

      const res = await axios.put(api_updateBannerData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setOpen(false);
        fetchBannerData();
        setSnackbar({ open: true, message: 'Banner updated successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      setSnackbar({ open: true, message: 'Failed to update banner', severity: 'error' });
    }
  };

  if (!bannerData)
    return (
      <Box textAlign="center" py={5}>
        <Typography variant="h6">Loading banner data...</Typography>
      </Box>
    );

  return (
    <>
      <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Banner Section
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3} alignItems="center">
          {[bannerData?.hero2_img1, bannerData?.hero2_img2, bannerData?.hero2_img3].map((img, i) => (
            <Grid item xs={12} sm={4} textAlign="center" key={i}>
              <CardMedia
                component="img"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  mx: 'auto',
                  boxShadow: 2,
                  objectFit: 'cover',
                  backgroundColor: '#fff',
                  p: 1,
                }}
                image={img}
                alt={`Image ${i + 1}`}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} align="center">
              {bannerData?.hero2_title_1}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {bannerData?.hero2_title_2}
            </Typography>
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                mt: { xs: 2, sm: 0 },
              
                backgroundColor: '#d3d3d3',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'black', // light gray
                  color: 'white',
                },
              }}
            >
              Edit Banner
            </Button>
          </Grid>
        </Grid>
      </Card>

      <BannerEditForm
        open={open}
        defaultValues={{
          hero2_title_1: bannerData?.hero2_title_1 || '',
          hero2_title_2: bannerData?.hero2_title_2 || '',
          image1: bannerData?.hero2_img1 || null,
          image2: bannerData?.hero2_img2 || null,
          image3: bannerData?.hero2_img3 || null,
        }}
        onSubmit={updateBannerContent}
        onCancel={() => setOpen(false)}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Banner;
