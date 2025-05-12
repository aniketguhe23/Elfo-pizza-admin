import React from 'react';
import { Box, Button, Card, CardMedia, Divider, Typography } from '@mui/material';

const ExploreFeature = () => {
  const menuItems = [
    {
      title: 'Farmhouse Pizza',
      prices: {
        small: '₹199',
        medium: '₹299',
        large: '₹399',
      },
      image: '/images/ps1.png',
    },
    {
      title: 'Cheesy Burst',
      prices: {
        small: '₹179',
        medium: '₹259',
        large: '₹349',
      },
      image: '/images/ps1.png',
    },
    {
      title: 'Veg Supreme',
      prices: {
        small: '₹159',
        medium: '₹239',
        large: '₹299',
      },
      image: '/images/ps1.png',
    },
  ];

  return (
    <Card sx={{ p: 2, mb: 3 }}>
      {/* Card Title */}
      <Typography variant="h6" align="center" gutterBottom>
        Explore Featured Pizza’s
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Menu List */}
      <Box>
        {menuItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              gap: 2,
            }}
          >
            {/* Image */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <CardMedia
                component="img"
                sx={{ width: 80, height: 80, borderRadius: 2 }}
                image={item.image}
                alt={item.title}
              />
            </Box>

            {/* Title */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="body1" fontWeight={600}>
                {item.title}
              </Typography>
            </Box>

            {/* Prices */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Small: {item.prices.small} <br />
                Medium: {item.prices.medium} <br />
                Large: {item.prices.large}
              </Typography>
            </Box>

            {/* Edit Button */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" size="small">
                Edit
              </Button>
            </Box>
          </Box>
        ))}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end', marginRight: 5 }}>
          <Button variant="contained" size="small" sx={{ minWidth: 120 }}>
            Add
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ExploreFeature;
