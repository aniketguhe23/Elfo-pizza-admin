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
  Typography,
} from '@mui/material';
import axios from 'axios';

import WhyElfoEditForm from '../formComponent/WhyElfoEditForm';

const WhyElfoPage = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const { api_getWhyElfoData, api_updateWhyElfoData } = ProjectApiList();

  const fetchData = async () => {
    try {
      const res = await axios.get(api_getWhyElfoData);
      const responseData = res.data?.data;

      const formattedData = [
        {
          title: responseData?.whyElfo_title1,
          description: responseData?.whyElfo_desc1,
          image: responseData?.whyElfo_img1,
        },
        {
          title: responseData?.whyElfo_title2,
          description: responseData?.whyElfo_desc2,
          image: responseData?.whyElfo_img2,
        },
        {
          title: responseData?.whyElfo_title3,
          description: responseData?.whyElfo_desc3,
          image: responseData?.whyElfo_img3,
        },
      ];

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching Why Elfo data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData: { list: any[] }) => {
    try {
      const payload = new FormData();

      formData.list.forEach((item, i) => {
        const index = i + 1;
        payload.append(`whyElfo_title${index}`, item.title);
        payload.append(`whyElfo_desc${index}`, item.description);
        if (item.image) {
          payload.append(`whyElfo_img${index}`, item.image);
        }
      });

      const res = await axios.put(api_updateWhyElfoData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating Why Elfo data:', error);
    }
  };

  return (
    <>
      <Card sx={{ p: 3, mb: 4, backgroundColor: '#fafafa'  }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Why Choose Elfo?
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          A few reasons that make us stand out from the rest.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" flexDirection="column" gap={3}>
          {data?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
                image={item.image}
                alt={item.title}
              />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="contained" size="medium" onClick={() => setOpen(true)}>
            Edit Content
          </Button>
        </Box>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Why Elfo Content</DialogTitle>
        <DialogContent dividers>
          <WhyElfoEditForm
            defaultValues={{ list: data }}
            onSubmit={handleSave}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WhyElfoPage;
