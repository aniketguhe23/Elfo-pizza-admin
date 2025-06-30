'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import { Box, Button, Card, CardMedia, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import EditFooterCardModal, { FooterFormValues } from '../formComponent/EditFooterCardModal';

interface FooterApiData {
  footer_logo: string;
  footer_title_1: string;
  address_title: string;
  address: string;
  contact_title: string;
  contact_no: string;
  email: string;
  company_name: string;
  company_title: string;
}

function FooterContactComponent() {
  const [open, setOpen] = useState(false);
  const [footerData, setFooterData] = useState<FooterApiData | null>(null);
  const { apiGetFooterData, apiUpdateFooterData } = ProjectApiList();

  const fetchFooterData = async () => {
    try {
      const res = await axios.get(apiGetFooterData);
      setFooterData(res.data.data);
    } catch {
      toast.error('Failed to fetch footer data');
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const handleSaveFooter = async (updated: FooterFormValues) => {
    try {
      const formData = new FormData();
      formData.append('footer_title_1', updated.footer_title_1);
      formData.append('address_title', updated.address_title);
      formData.append('address', updated.address);
      formData.append('contact_title', updated.contact_title);
      formData.append('contact_no', updated.contact_no);
      formData.append('email', updated.email);
      formData.append('company_name', updated.company_name);
      formData.append('company_title', updated.company_title);
      if (updated.footer_logo) {
        formData.append('footer_logo', updated.footer_logo);
      }

      const res = await axios.put(apiUpdateFooterData, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFooterData(res.data.data); // assuming updated footer data is returned
      toast.success('Footer updated successfully!');
      setOpen(false);
    } catch {
      toast.error('Failed to update footer data');
    }
  };

  if (!footerData) return <div>Loading...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Footer Contact Info
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            image={footerData.footer_logo}
            alt="Footer Logo"
            sx={{
              width: 120,
              height: 120,
              borderRadius: '12px',
              mx: 'auto',
              objectFit: 'contain',
              backgroundColor: '#fff',
              p: 1,
              boxShadow: 3,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" gap={1}>
            {/* Title */}
            <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
              {footerData.footer_title_1}
            </Typography>

            {/* Info Rows */}
            {[
              { label: footerData.address_title, value: footerData.address },
              { label: footerData.contact_title, value: footerData.contact_no },
              { label: 'Email', value: footerData.email },
              { label: 'Company Name', value: footerData.company_name },
              { label: 'Company Title', value: footerData.company_title },
            ].map((item, index) => (
              <Box key={index} display="flex">
                <Typography sx={{ width: 140, color: 'text.secondary', fontWeight: 500 }}>{item.label}:</Typography>
                <Typography sx={{ color: 'text.primary' }}>{item.value}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      <Grid item xs={12} sm={4}>
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100%"
  >
    <Button
      variant="contained"
      onClick={() => setOpen(true)}
      sx={{
        backgroundColor: '#333',
        '&:hover': { backgroundColor: '#000' },
      }}
    >
      Edit Footer Info
    </Button>
  </Box>
</Grid>

      </Grid>

      <EditFooterCardModal open={open} onClose={() => setOpen(false)} data={footerData} onSave={handleSaveFooter} />
    </Card>
  );
}

export default FooterContactComponent;
