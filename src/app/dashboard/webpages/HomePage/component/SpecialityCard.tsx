'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Box, Button, Card, CardMedia, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import SpecialityEditForm from '../formComponent/SpecialityEditForm';

interface Dish {
  title: string;
  subtitle: string;
  button?: string;
  image: File | string | null;
}

// interface SpecialityData {
//   speciality1MainTitle: string;
//   speciality1SubTitle: string;
//   speciality1Card1Title: string;
//   speciality1Card1Subtitle: string;
//   speciality1Card1Button?: string;
//   speciality1Card1Img: string;
//   speciality1Card2Title: string;
//   speciality1Card2Subtitle: string;
//   speciality1Card2Button?: string;
//   speciality1Card2Img: string;
// }
interface SpecialityData {
  speciality1_maintitle: string;
  speciality1_subtitle: string;
  speciality1_card1_img: string;
  speciality1_card2_img: string;
  speciality1_card1_title: string;
  speciality1_card2_title: string;
  speciality1_card1_subtitle: string;
  speciality1_card2_subtitle: string;
  speciality1_card1_button?: string;
  speciality1_card2_button?: string;
}

interface SpecialityApiResponse {
  data: SpecialityData;
  status: string;
}
function SpecialityCard(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [specialityData, setSpecialityData] = useState<SpecialityData | null>(null);

  const { apiGetSpecialityData, apiUpdateSpecialityData } = ProjectApiList();

  // Fetch speciality data from API
  const fetchSpecialityData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<SpecialityApiResponse>(apiGetSpecialityData);
      setSpecialityData(res.data.data);
    } catch (error) {
      toast.error('Error fetching speciality data:');
    }
  }, [apiGetSpecialityData]);

  useEffect(() => {
    void fetchSpecialityData(); // prevent floating promise warning
  }, [fetchSpecialityData]); // no missing deps because fetchSpecialityData is stable here

  const handleUpdate = async (formData: { title: string; subtitle: string; dishes: Dish[] }): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('speciality1_maintitle', formData.title);
      payload.append('speciality1_subtitle', formData.subtitle);

      // Card 1
      payload.append('speciality1_card1_title', formData.dishes[0].title);
      payload.append('speciality1_card1_subtitle', formData.dishes[0].subtitle);
      payload.append('speciality1_card1_button', formData.dishes[0].button || '');
      if (formData.dishes[0].image instanceof File) {
        payload.append('speciality1_card1_img', formData.dishes[0].image);
      }

      // Card 2
      payload.append('speciality1_card2_title', formData.dishes[1].title);
      payload.append('speciality1_card2_subtitle', formData.dishes[1].subtitle);
      payload.append('speciality1_card2_button', formData.dishes[1].button || '');
      if (formData.dishes[1].image instanceof File) {
        payload.append('speciality1_card2_img', formData.dishes[1].image);
      }

      const res = await axios.put<{ status: string }>(apiUpdateSpecialityData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setOpen(false);
        await fetchSpecialityData();
      }
    } catch (error) {
      toast.error('Error updating speciality data:');
    }
  };

  if (!specialityData)
    return (
      <Typography variant="body2" align="center">
        Loading speciality data...
      </Typography>
    );

  return (
    <>
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#fafafa' }}>
        <Typography variant="h6" align="center" gutterBottom>
          {specialityData.speciality1_maintitle}
        </Typography>
        <Typography variant="subtitle2" align="center" color="text.secondary" gutterBottom>
          {specialityData.speciality1_subtitle}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box>
          {[1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box sx={{ flex: 2 }}>
                <Typography variant="body1">
                  {specialityData[`speciality1_card${i}_title` as keyof SpecialityData]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {specialityData[`speciality1_card${i}_subtitle` as keyof SpecialityData]}
                </Typography>
              </Box>

              <CardMedia
                component="img"
                sx={{ width: 80, height: 80, borderRadius: 2 }}
                image={specialityData[`speciality1_card${i}_img` as keyof SpecialityData]}
                alt={`Dish ${i}`}
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            size="small"
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
            Edit
          </Button>
        </Box>
      </Card>

      {open ? (
        <SpecialityEditForm
          open={open}
          defaultValues={{
            title: specialityData.speciality1_maintitle,
            subtitle: specialityData.speciality1_subtitle,
            dishes: [
              {
                title: specialityData.speciality1_card1_title,
                subtitle: specialityData.speciality1_card1_subtitle,
                button: specialityData.speciality1_card1_button || '',
                image: specialityData.speciality1_card1_img,
              },
              {
                title: specialityData.speciality1_card2_title,
                subtitle: specialityData.speciality1_card2_subtitle,
                button: specialityData.speciality1_card2_button || '',
                image: specialityData.speciality1_card2_img,
              },
            ],
          }}
          onSubmit={handleUpdate}
          onCancel={() => {
            setOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

export default SpecialityCard;
