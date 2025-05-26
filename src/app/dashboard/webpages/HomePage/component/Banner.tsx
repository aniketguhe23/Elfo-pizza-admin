'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Box, Button, Card, CardMedia, Divider, Grid, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { toast } from 'react-toastify';
import BannerEditForm from '../formComponent/BannerEditForm';

interface BannerData {
  hero2_title_1: string;
  hero2_title_2: string;
  hero2_img1: string;
  hero2_img2: string;
  hero2_img3: string;
}

interface UpdateBannerResponse {
  status: 'success' | 'error'; 
  message?: string; 
  data?: BannerData; 
}
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

function Banner(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { apiGetBannerData, apiUpdateBannerData } = ProjectApiList();

  const fetchBannerData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: BannerData }>(apiGetBannerData);
      setBannerData(res.data.data);
    } catch (error) {
      toast.error('Error fetching banner data:');
      setSnackbar({ open: true, message: 'Failed to load banner data', severity: 'error' });
    }
  }, [apiGetBannerData]); // No dependencies if setBannerData, toast, setSnackbar don't change

  useEffect(() => {
    void fetchBannerData();
  }, [fetchBannerData]);

  const updateBannerContent = async (formData: {
    hero2_title_1: string;
    hero2_title_2: string;
    image1: File | string | null;
    image2: File | string | null;
    image3: File | string | null;
  }): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('hero2_title_1', formData.hero2_title_1);
      payload.append('hero2_title_2', formData.hero2_title_2);

      if (formData.image1) payload.append('hero2_img1', formData.image1);
      if (formData.image2) payload.append('hero2_img2', formData.image2);
      if (formData.image3) payload.append('hero2_img3', formData.image3);

      const res = await axios.put<UpdateBannerResponse>(apiUpdateBannerData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setOpen(false);
        await fetchBannerData();
        setSnackbar({
          open: true,
          message: 'Banner updated successfully!',
          severity: 'success',
        });
      }
    } catch (error) {
      toast.error('Error updating banner:');
      setSnackbar({
        open: true,
        message: 'Failed to update banner',
        severity: 'error',
      });
    }
  };

  if (!bannerData) {
    return (
      <Box textAlign="center" py={5}>
        <Typography variant="h6">Loading banner data...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Banner Section
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3} alignItems="center">
          {[bannerData.hero2_img1, bannerData.hero2_img2, bannerData.hero2_img3].map((img, key) => (
            <Grid item xs={12} sm={4} textAlign="center" key={`banner-img-${img}`}
>
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
                alt={`Image ${key + 1}`}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} align="center">
              {bannerData.hero2_title_1}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {bannerData.hero2_title_2}
            </Typography>
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
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
              Edit Banner
            </Button>
          </Grid>
        </Grid>
      </Card>

      <BannerEditForm
        open={open}
        defaultValues={{
          hero2_title_1: bannerData.hero2_title_1,
          hero2_title_2: bannerData.hero2_title_2,
          image1: bannerData.hero2_img1,
          image2: bannerData.hero2_img2,
          image3: bannerData.hero2_img3,
        }}
        onSubmit={updateBannerContent}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
          }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default Banner;
