'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
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
import EditQuickLinksModal from '../formComponent/EditQuickLinksModal';
import type { QuickLinksFormValues } from '../formComponent/EditQuickLinksModal';

interface QuickLinksApiData extends QuickLinksFormValues {}

function QuickLinksComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<QuickLinksApiData | null>(null);
  const { apiGetFooterQuicklinks, apiUpdateFooterQuicklinks } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: QuickLinksApiData }>(apiGetFooterQuicklinks);
      setData(res.data.data);
    } catch {
      toast.error('Failed to fetch quick links');
    }
  }, [apiGetFooterQuicklinks]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updated: QuickLinksFormValues): Promise<void> => {
    try {
      const res = await axios.put<{ data: QuickLinksApiData }>(apiUpdateFooterQuicklinks, updated);
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
    <Card
      elevation={3}
      sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}
    >
      <Typography variant="h5" align="center" fontWeight={600}>
        {data.quick_link_text}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} key={item.label}>
            <Box display="flex">
              <Typography sx={{ width: 150, fontWeight: 500 }}>{item.label}:</Typography>
              <Typography color="text.secondary">{item.url}</Typography>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} textAlign="right" mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#000' },
            }}
          >
            Edit Quick Links
          </Button>
        </Grid>
      </Grid>

      <EditQuickLinksModal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        data={data}
        onSave={handleSave}
      />
    </Card>
  );
}

export default QuickLinksComponent;
