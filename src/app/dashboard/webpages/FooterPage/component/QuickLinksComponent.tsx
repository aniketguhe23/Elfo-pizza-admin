'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProjectApiList from '@/app/api/ProjectApiList';
import EditQuickLinksModal, { QuickLinksFormValues } from '../formComponent/EditQuickLinksModal';

interface QuickLinksApiData {
  quick_link_text: string;
  home_text: string;
  home_url: string;
  current_page_text: string;
  current_page_url: string;
  menu_text: string;
  menu_url: string;
  aboutus_text: string;
  aboutus_url: string;
  careers_text: string;
  careers_url: string;
  meet_out_team_text: string;
  meet_out_team_url: string;
  gift_card_text: string;
  gift_card_url: string;
  press_text: string;
  press_url: string;
}

function QuickLinksComponent() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<QuickLinksApiData | null>(null);
  const { apiGetFooterQuicklinks, apiUpdateFooterQuicklinks } = ProjectApiList();

  const fetchData = async () => {
    try {
      const res = await axios.get(apiGetFooterQuicklinks);
      setData(res.data.data);
    } catch {
      toast.error('Failed to fetch quick links');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (updated: QuickLinksFormValues) => {
    try {
      const res = await axios.put(apiUpdateFooterQuicklinks, updated);
      setData(res.data.data);
      toast.success('Quick links updated successfully!');
      setOpen(false);
    } catch {
      toast.error('Failed to update quick links');
    }
  };

  if (!data) return <div>Loading...</div>;

  const items = [
    { label: data.home_text, url: data.home_url },
    { label: data.current_page_text, url: data.current_page_url },
    { label: data.menu_text, url: data.menu_url },
    { label: data.aboutus_text, url: data.aboutus_url },
    { label: data.careers_text, url: data.careers_url },
    { label: data.meet_out_team_text, url: data.meet_out_team_url },
    { label: data.gift_card_text, url: data.gift_card_url },
    { label: data.press_text, url: data.press_url },
  ];

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h5" align="center" fontWeight={600}>
        {data.quick_link_text}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {items.map((item, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Box display="flex">
              <Typography sx={{ width: 150, fontWeight: 500 }}>{item.label}:</Typography>
              <Typography color="text.secondary">{item.url}</Typography>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} textAlign="right" mt={2}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#000' } }}
          >
            Edit Quick Links
          </Button>
        </Grid>
      </Grid>

      <EditQuickLinksModal open={open} onClose={() => setOpen(false)} data={data} onSave={handleSave} />
    </Card>
  );
}

export default QuickLinksComponent;
