import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material';
import axios from 'axios';

import SpecialityEditForm from '../formComponent/SpecialityEditForm';

const SpecialityCard = () => {
  const [open, setOpen] = useState(false);
  const [specialityData, setSpecialityData] = useState<any>(null);

  const { api_getSpecialityData, api_updateSpecialityData } = ProjectApiList();

  const fetchSpecialityData = async () => {
    try {
      const res = await axios.get(api_getSpecialityData);
      setSpecialityData(res.data.data);
    } catch (error) {
      console.error('Error fetching speciality data:', error);
    }
  };

  useEffect(() => {
    fetchSpecialityData();
  }, []);

  const handleUpdate = async (formData: any) => {
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

      const res = await axios.put(api_updateSpecialityData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setOpen(false);
        fetchSpecialityData();
      }
    } catch (error) {
      console.error('Error updating speciality data:', error);
    }
  };

  if (!specialityData) return null;

  return (
    <>
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#fafafa'  }}>
        <Typography variant="h6" align="center" gutterBottom>
          {specialityData?.speciality1_maintitle}
        </Typography>
        <Typography variant="subtitle2" align="center" color="text.secondary" gutterBottom>
          {specialityData?.speciality1_subtitle}
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
                <Typography variant="body1">{specialityData[`speciality1_card${i}_title`]}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {specialityData[`speciality1_card${i}_subtitle`]}
                </Typography>
              </Box>

              <CardMedia
                component="img"
                sx={{ width: 80, height: 80, borderRadius: 2 }}
                image={specialityData[`speciality1_card${i}_img`]}
                alt={`Dish ${i}`}
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button variant="contained" size="small" onClick={() => setOpen(true)}  sx={{
              mt: { xs: 2, sm: 0 },
            
              backgroundColor: '#d3d3d3',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black', // light gray
                color: 'white',
              },
            }}>
            Edit
          </Button>
        </Box>
      </Card>

      {open && (
        <SpecialityEditForm
          open={open}
          defaultValues={{
            title: specialityData?.speciality1_maintitle || '',
            subtitle: specialityData?.speciality1_subtitle || '',
            dishes: [
              {
                title: specialityData?.speciality1_card1_title || '',
                subtitle: specialityData?.speciality1_card1_subtitle || '',
                button: specialityData?.speciality1_card1_button || '',
                image: specialityData?.speciality1_card1_img || null,
              },
              {
                title: specialityData?.speciality1_card2_title || '',
                subtitle: specialityData?.speciality1_card2_subtitle || '',
                button: specialityData?.speciality1_card2_button || '',
                image: specialityData?.speciality1_card2_img || null,
              },
            ],
          }}
          onSubmit={handleUpdate}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default SpecialityCard;
