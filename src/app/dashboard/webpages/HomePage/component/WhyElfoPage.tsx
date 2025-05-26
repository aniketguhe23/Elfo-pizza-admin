'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Box, Button, Card, CardMedia, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import WhyElfoEditForm from '../formComponent/WhyElfoEditForm';

export interface WhyItem {
  title: string;
  description: string;
  image?: string | File | null;
}

function WhyElfoPage(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<WhyItem[]>([]);

  const { apiGetWhyElfoData, apiUpdateWhyElfoData } = ProjectApiList();

  interface UpdateResponse {
    status: string;
  }

  interface WhyElfoApiResponse {
    whyElfo_title1?: string;
    whyElfo_desc1?: string;
    whyElfo_img1?: string;
    whyElfo_title2?: string;
    whyElfo_desc2?: string;
    whyElfo_img2?: string;
    whyElfo_title3?: string;
    whyElfo_desc3?: string;
    whyElfo_img3?: string;
  }

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: WhyElfoApiResponse }>(apiGetWhyElfoData);
      const responseData = res.data?.data;

      const formattedData: WhyItem[] = [
        {
          title: responseData?.whyElfo_title1 ?? '',
          description: responseData?.whyElfo_desc1 ?? '',
          image: responseData?.whyElfo_img1 ?? '',
        },
        {
          title: responseData?.whyElfo_title2 ?? '',
          description: responseData?.whyElfo_desc2 ?? '',
          image: responseData?.whyElfo_img2 ?? '',
        },
        {
          title: responseData?.whyElfo_title3 ?? '',
          description: responseData?.whyElfo_desc3 ?? '',
          image: responseData?.whyElfo_img3 ?? '',
        },
      ];

      setData(formattedData);
    } catch (error) {
      toast.error('Error fetching Why Elfo data:');
    }
  }, [apiGetWhyElfoData]);

  const handleSave = async (formData: { list: WhyItem[] }): Promise<void> => {
    try {
      const payload = new FormData();

      formData.list.forEach((item, i) => {
        const index = i + 1;
        payload.append(`whyElfo_title${index}`, item.title);
        payload.append(`whyElfo_desc${index}`, item.description);

        // If image is File, append as file
        if (item.image instanceof File) {
          payload.append(`whyElfo_img${index}`, item.image);
        }
        // If image is string (existing URL), optionally send it differently or ignore (depends on backend)
        else if (typeof item.image === 'string' && item.image.trim() !== '') {
          // If your backend expects string image URLs, you can append as well
          // Or you might skip sending unchanged image URLs to reduce payload
          payload.append(`whyElfo_img_url${index}`, item.image);
        }
      });

      const res = await axios.put<UpdateResponse>(apiUpdateWhyElfoData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res?.data?.status === 'success') {
        setOpen(false);
        await fetchData();
      }
    } catch (error) {
      toast.error('Error updating Why Elfo data:');
    }
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <>
      <Card sx={{ p: 3, mb: 4, backgroundColor: '#fafafa' }}>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Why Choose Elfo?
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          A few reasons that make us stand out from the rest.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" flexDirection="column" gap={3}>
          {data.map((item, index) => (
            <Box
              key={item.title || index}
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
                image={typeof item.image === 'string' ? item.image : ''}
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
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              setOpen(true);
            }}
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
            Edit Content
          </Button>
        </Box>
      </Card>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        maxWidth="md"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(3px)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Edit Why Elfo Content</DialogTitle>
        <DialogContent dividers>
          <WhyElfoEditForm
            defaultValues={{ list: data }}
            onSubmit={handleSave}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WhyElfoPage;
