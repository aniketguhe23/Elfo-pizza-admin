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

import BannerEditForm from '../formComponent/BannerEditForm'; // adjust path if needed

const Banner = () => {
  const [open, setOpen] = useState(false);
  const [bannerData, setBannerData] = useState<any>(null);

  const { api_getBannerData, api_updateBannerData } = ProjectApiList();

  const fetchBannerData = async () => {
    try {
      const res = await axios.get(api_getBannerData);
      setBannerData(res.data.data);
    } catch (error) {
      console.error('Error fetching banner data:', error);
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
      }
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  if (!bannerData) return null;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Banner Section
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="center">
        {/* Image Row */}
        <Grid item xs={12} sm={4} textAlign="center">
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
            image={bannerData?.hero2_img1}
            alt="Image 1"
          />
        </Grid>
        <Grid item xs={12} sm={4} textAlign="center">
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
            image={bannerData?.hero2_img2}
            alt="Image 2"
          />
        </Grid>
        <Grid item xs={12} sm={4} textAlign="center">
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
            image={bannerData?.hero2_img3}
            alt="Image 3"
          />
        </Grid>

        {/* Text Content */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} align="center">
            {bannerData?.hero2_title_1}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {bannerData?.hero2_title_2}
          </Typography>
        </Grid>

        {/* Edit Button */}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" onClick={() => setOpen(true)}>
            Edit Banner
          </Button>
        </Grid>
      </Grid>

      {/* Dialog for editing */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent dividers>
          <BannerEditForm
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Banner;
