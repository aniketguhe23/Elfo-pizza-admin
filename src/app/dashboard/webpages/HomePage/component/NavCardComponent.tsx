import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Box, Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';

import EditNavCardModal from '../formComponent/EditNavCardModal';

const NavCardComponent = () => {
  const [open, setOpen] = useState(false);
  const [navData, setNavData] = useState<any>(null);

  const { api_getNavigationContent, api_updateNavigationContent } = ProjectApiList();

  const fetchNavData = async () => {
    try {
      const res = await axios.get(api_getNavigationContent);
      setNavData(res.data.data);
    } catch (err) {
      console.error('Error fetching navigation content:', err);
    }
  };

  useEffect(() => {
    fetchNavData();
  }, []);

  const handleSave = async (updatedForm: any) => {
    try {
      const payload = new FormData();
      payload.append('nav_logo_text', updatedForm.title);
      payload.append('nav_bg_color', updatedForm.description);
      if (updatedForm.image1) {
        payload.append('nav_logo_img', updatedForm.image1);
      }

      const res = await axios.put(api_updateNavigationContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        fetchNavData();
        setOpen(false);
      }
    } catch (err) {
      console.error('Error updating navigation content:', err);
    }
  };

  if (!navData) return null;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Navigation Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3} textAlign="center">
          <CardMedia
            component="img"
            image={navData.nav_logo_img}
            alt="Logo"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '12px',
              mx: 'auto',
              boxShadow: 3,
              objectFit: 'contain',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Typography variant="subtitle1" fontWeight={500}>
            Logo Text
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {navData.nav_logo_text}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Background Color
          </Typography>
          <Typography variant="body1">{navData.nav_bg_color}</Typography>
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
                backgroundColor: 'black', // light gray
                color: 'white',
              },
            }}
          >
            Edit Navigation
          </Button>
        </Grid>
      </Grid>

      <EditNavCardModal
        open={open}
        onClose={() => setOpen(false)}
        data={{
          title: navData.nav_logo_text,
          description: navData.nav_bg_color,
          image1: navData.nav_logo_img,
        }}
        onSave={handleSave}
      />
    </Card>
  );
};

export default NavCardComponent;
