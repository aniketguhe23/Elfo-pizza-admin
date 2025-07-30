'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import EditNearmeModal from '../formComponent/EditNearmeModal';

interface NearmeData {
  nearme_heading: string;
  nearme_subheading: string;
  nearme_icon1: string;
  nearme_icon1_desc: string;
  nearme_icon2: string;
  nearme_icon2_desc: string;
  nearme_title: string;
  nearme_desc: string;
  nearme_img: string;
}

interface UpdatedForm {
  heading: string;
  subheading: string;
  icon1_desc: string;
  icon2_desc: string;
  title: string;
  desc: string;
  image?: File | null;
  icon1Img?: File | null;
  icon2Img?: File | null;
}

function NearmeComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<NearmeData | null>(null);

  const { apiGetNeareMeContent, apiUpdateNeareMeContent } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: NearmeData }>(apiGetNeareMeContent);
      setData(res.data.data);
    } catch {
      toast.error('Error fetching Near Me data');
    }
  }, [apiGetNeareMeContent]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updatedForm: UpdatedForm): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('nearme_heading', updatedForm.heading);
      payload.append('nearme_subheading', updatedForm.subheading);
      payload.append('nearme_icon1_desc', updatedForm.icon1_desc);
      payload.append('nearme_icon2_desc', updatedForm.icon2_desc);
      payload.append('nearme_title', updatedForm.title);
      payload.append('nearme_desc', updatedForm.desc);

      // Only append image files if they are of type File
      if (updatedForm.image instanceof File) {
        payload.append('nearme_img', updatedForm.image);
      }

      if (updatedForm.icon1Img instanceof File) {
        payload.append('nearme_icon1', updatedForm.icon1Img);
      }

      if (updatedForm.icon2Img instanceof File) {
        payload.append('nearme_icon2', updatedForm.icon2Img);
      }

      const res = await axios.put<{ status: string }>(apiUpdateNeareMeContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        await fetchData();
        setOpen(false);
        toast.success('Updated successfully!');
      }
    } catch {
      toast.error('Error updating Near Me section');
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Near Me Section Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm={4} textAlign="center">
          <CardMedia
            component="img"
            image={data.nearme_img}
            alt="Near Me"
            sx={{
              width: 150,
              height: 150,
              borderRadius: '12px',
              mx: 'auto',
              boxShadow: 3,
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
          <Typography variant="caption" display="block" mt={1}>
            Section Image
          </Typography>

          <CardMedia
            component="img"
            image={data.nearme_icon1}
            alt="Icon 1"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '8px',
              mt: 2,
              mx: 'auto',
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
          <Typography variant="caption" display="block">
            Icon 1
          </Typography>

          <CardMedia
            component="img"
            image={data.nearme_icon2}
            alt="Icon 2"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '8px',
              mt: 2,
              mx: 'auto',
              objectFit: 'cover',
              backgroundColor: '#fff',
              p: 1,
            }}
          />
          <Typography variant="caption" display="block">
            Icon 2
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Typography variant="subtitle1" fontWeight={500}>
            Heading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearme_heading}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Subheading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearme_subheading}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Icon 1 Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearme_icon1_desc}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Icon 2 Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearme_icon2_desc}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearme_title}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Description
          </Typography>
          <Typography variant="body1">{data.nearme_desc}</Typography>
        </Grid>

        <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              setOpen(true);
            }}
            sx={{
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Edit Near Me Section
          </Button>
        </Grid>
      </Grid>

      <EditNearmeModal
        open={open}
        onClose={() => setOpen(false)}
        data={data}
        onSave={(updatedData) =>
          handleSave({
            heading: updatedData.nearme_heading,
            subheading: updatedData.nearme_subheading,
            title: updatedData.nearme_title,
            desc: updatedData.nearme_desc,
            icon1_desc: updatedData.nearme_icon1_desc,
            icon2_desc: updatedData.nearme_icon2_desc,
            image: updatedData.nearme_img instanceof File ? updatedData.nearme_img : null,
            icon1Img: updatedData.nearme_icon1 instanceof File ? updatedData.nearme_icon1 : null,
            icon2Img: updatedData.nearme_icon2 instanceof File ? updatedData.nearme_icon2 : null,
          })
        }
      />
    </Card>
  );
}

export default NearmeComponent;
