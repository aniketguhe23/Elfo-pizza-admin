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
import EditLegalLinksModal from '../formComponent/EditLegalLinksModal';
import type { LegalLinksFormValues } from '../formComponent/EditLegalLinksModal';

interface LegalLinksApiData extends LegalLinksFormValues {}

function LegalLinksComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<LegalLinksApiData | null>(null);
  const { apiGetLegalLinks, apiUpdateLegalLinks } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: LegalLinksApiData }>(apiGetLegalLinks);
      setData(res.data.data);
    } catch {
      toast.error('Failed to fetch legal links');
    }
  }, [apiGetLegalLinks]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (updated: LegalLinksFormValues): Promise<void> => {
    try {
      const res = await axios.put<{ data: LegalLinksApiData }>(
        apiUpdateLegalLinks,
        updated
      );
      setData(res.data.data);
      toast.success('Legal links updated successfully!');
      setOpen(false);
    } catch {
      toast.error('Failed to update legal links');
    }
  };

  if (!data) return <div>Loading...</div>;

  const items = [
    { label: data.terms_text, url: data.terms_url },
    { label: data.cookie_text, url: data.cookie_url },
    { label: data.privacy_text, url: data.privacy_url },
    { label: data.accessibility_text, url: data.accessibility_url },
    { label: data.applicant_text, url: data.applicant_url },
    { label: data.mp_text, url: data.mp_url },
    { label: data.supply_text, url: data.supply_url },
    { label: data.fssai_text, url: data.fssai_url },
  ];

  return (
    <Card
      elevation={3}
      sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#fdfdfd' }}
    >
      <Typography variant="h5" align="center" fontWeight={600}>
        {data.legal_title_text}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} key={item.label}>
            <Box display="flex">
              <Typography sx={{ width: 180, fontWeight: 500 }}>
                {item.label}:
              </Typography>
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
            Edit Legal Links
          </Button>
        </Grid>
      </Grid>

      <EditLegalLinksModal
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

export default LegalLinksComponent;
