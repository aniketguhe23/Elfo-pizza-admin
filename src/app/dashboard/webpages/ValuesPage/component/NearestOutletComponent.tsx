'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditNearestOutletModal from '../formComponent/EditNearestOutletModal';
// import EditNearestOutletModal from '../formComponent/EditNearestOutletModal';

interface NearestOutletData {
  nearest_heading: string;
  nearest_title: string;
  nearest_subtitle: string;
  nearest_img: string;
  nearest_yes: string;
  nearest_yes_desc: string;
  nearest_no: string;
  nearest_no_desc: string;
}

interface UpdatedForm {
  heading: string;
  title: string;
  subtitle: string;
  yes: string;
  yes_desc: string;
  no: string;
  no_desc: string;
  image1?: File | null;
}

function NearestOutletComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<NearestOutletData | null>(null);

  const { apiGetNearestOutletContent, apiUpdateNearestOutletContent } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: NearestOutletData }>(apiGetNearestOutletContent);
      setData(res.data.data);
    } catch {
      toast.error('Error fetching Nearest Outlet data');
    }
  }, [apiGetNearestOutletContent]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updatedForm: UpdatedForm): Promise<void> => {

    try {
      const payload = new FormData();
      payload.append('nearest_heading', updatedForm.heading);
      payload.append('nearest_title', updatedForm.title);
      payload.append('nearest_subtitle', updatedForm.subtitle);
      payload.append('nearest_yes', updatedForm.yes);
      payload.append('nearest_yes_desc', updatedForm.yes_desc);
      payload.append('nearest_no', updatedForm.no);
      payload.append('nearest_no_desc', updatedForm.no_desc);

      if (updatedForm.image1) {
        payload.append('nearest_img', updatedForm.image1);
      }

      const res = await axios.put<{ status: string }>(apiUpdateNearestOutletContent, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        await fetchData();
        setOpen(false);
      }
    } catch {
      toast.error('Error updating Nearest Outlet section');
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Nearest Outlet Section Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm={4} textAlign="center">
          <CardMedia
            component="img"
            image={data.nearest_img}
            alt="Nearest Outlet"
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
            Outlet Image
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Typography variant="subtitle1" fontWeight={500}>
            Heading
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearest_heading}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearest_title}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            Subtitle
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearest_subtitle}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            &quot;Yes&quot; Label
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearest_yes}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            &quot;Yes&quot; Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearest_yes_desc}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            &quot;No&quot; Label
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {data.nearest_no}
          </Typography>

          <Typography variant="subtitle1" fontWeight={500}>
            &quot;No&quot; Description
          </Typography>
          <Typography variant="body1">
            {data.nearest_no_desc}
          </Typography>
        </Grid>

        <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {setOpen(true)}}
            sx={{
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
            }}
          >
            Edit Nearest Outlet Section
          </Button>
        </Grid>
      </Grid>

      <EditNearestOutletModal
        open={open}
        onClose={() => {setOpen(false)}}
        data={{
          heading: data.nearest_heading,
          title: data.nearest_title,
          subtitle: data.nearest_subtitle,
          yes: data.nearest_yes,
          yes_desc: data.nearest_yes_desc,
          no: data.nearest_no,
          no_desc: data.nearest_no_desc,
          image1: data.nearest_img,
        }}
        onSave={handleSave}
      />
    </Card>
  );
}

export default NearestOutletComponent;
