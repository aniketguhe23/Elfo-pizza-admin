'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import {
  Button,
  Card,
  CardMedia,
  Divider,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProjectApiList from '@/app/api/ProjectApiList';
import EditSocialLinksModal from '../formComponent/EditSocialLinksModal';
import type { SocialLinksFormValues } from '../formComponent/EditSocialLinksModal';

interface SocialLinksApiData extends Omit<
  SocialLinksFormValues,
  'facebook_image' | 'insta_image' | 'google_image' | 'youtub_image' | 'x_image'
> {
  facebook_image: string;
  insta_image: string;
  google_image: string;
  youtub_image: string;
  x_image: string;
}

interface IconWithSrc {
  url: string;
  image: string | File;
  alt: string;
  imgSrc: string;
}

function SocialLinksComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<SocialLinksApiData | null>(null);
  const { apiGetSocialLinks, apiUpdateSocialLinks } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: SocialLinksApiData }>(apiGetSocialLinks);
      setData(res.data.data);
    } catch {
      toast.error('Failed to fetch social links');
    }
  }, [apiGetSocialLinks]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updated: SocialLinksFormValues): Promise<void> => {
    try {
      const formData = new FormData();
      Object.entries(updated).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value as Blob | string);
        }
      });

      const res = await axios.put<{ data: SocialLinksApiData }>(apiUpdateSocialLinks, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setData(res.data.data);
      toast.success('Social links updated successfully!');
      setOpen(false);
    } catch {
      toast.error('Failed to update social links');
    }
  };

  const icons: IconWithSrc[] = useMemo(() => {
    if (!data) return [];

    const rawIcons: Omit<IconWithSrc, 'imgSrc'>[] = [
      { url: data.facebook_url, image: data.facebook_image, alt: 'Facebook' },
      { url: data.insta_url, image: data.insta_image, alt: 'Instagram' },
      { url: data.google_url, image: data.google_image, alt: 'Google' },
      { url: data.youtub_url, image: data.youtub_image, alt: 'YouTube' },
      { url: data.x_url, image: data.x_image, alt: 'X (Twitter)' },
    ];

    return rawIcons.map((item) => ({
      ...item,
      imgSrc: typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image),
    }));
  }, [data]);

  return (
    <Card
      elevation={3}
      sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fdfdfd' }}
    >
      <Typography variant="h5" align="center" fontWeight={600}>
        {data?.social_title_text || 'Social Links'}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} justifyContent="center">
        {icons.map((item) => (
          <Grid item key={item.alt}>
            <IconButton href={item.url} target="_blank" rel="noopener noreferrer">
              <CardMedia
                component="img"
                image={item.imgSrc}
                alt={item.alt}
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
              />
            </IconButton>
          </Grid>
        ))}

        <Grid item xs={12} textAlign="center" mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
            sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#000' } }}
          >
            Edit Social Links
          </Button>
        </Grid>
      </Grid>

      {data && (
        <EditSocialLinksModal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          data={data}
          onSave={handleSave}
        />
      )}
    </Card>
  );
}

export default SocialLinksComponent;
