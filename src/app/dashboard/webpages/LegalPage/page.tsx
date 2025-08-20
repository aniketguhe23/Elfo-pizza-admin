'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { JSX } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProjectApiList from '@/app/api/ProjectApiList';
import EditLegalLinksModal from './EditLegalLinksModal';

interface LegalLinksApiData {
  id: number;
  terms_conditions: string;
  cookie_policy: string;
  privacy_policy: string;
  accessibility_info: string;
  supply_chain_policy: string;
  fssai_details: string;
}

function LegalLinksComponent(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<
    keyof Omit<LegalLinksApiData, 'id'> | null
  >(null);
  const [data, setData] = useState<LegalLinksApiData | null>(null);

  const { apiGetFooterLegalLinks, apiUpdateFooterLegalLinks } = ProjectApiList();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: LegalLinksApiData[] }>(apiGetFooterLegalLinks);
      setData(res.data.data[0]); // first record
    } catch {
      toast.error('Failed to fetch legal links');
    }
  }, [apiGetFooterLegalLinks]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSave = async (
    field: keyof Omit<LegalLinksApiData, 'id'>,
    value: string
  ): Promise<void> => {
    try {
      const updated = { ...data, [field]: value };
      const res = await axios.put<{ data: LegalLinksApiData }>(
        `${apiUpdateFooterLegalLinks}/${data?.id}`,
        updated
      );
      setData(res.data.data);
      toast.success(`Updated successfully!`);
      setOpen(false);
      setSelectedField(null);
    } catch {
      toast.error('Failed to update legal links');
    }
  };

  if (!data) return <div>Loading...</div>;

  const items = [
    { label: 'Terms & Conditions', field: 'terms_conditions' },
    { label: 'Cookie Policy', field: 'cookie_policy' },
    { label: 'Privacy Policy', field: 'privacy_policy' },
    { label: 'Accessibility Info', field: 'accessibility_info' },
    { label: 'Supply Chain Policy', field: 'supply_chain_policy' },
    { label: 'FSSAI Details', field: 'fssai_details' },
  ] as const;

  return (
    <Box>
      <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 3 }}>
        Legal Information
      </Typography>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} key={item.field}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: '#fdfdfd',
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {item.label}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{ pl: 1, mb: 2 }}
                dangerouslySetInnerHTML={{ __html: data[item.field] }}
              />

              <Box textAlign="right">
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setSelectedField(item.field);
                    setOpen(true);
                  }}
                  sx={{
                    backgroundColor: '#333',
                    '&:hover': { backgroundColor: '#000' },
                  }}
                >
                  Edit {item.label}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedField && (
        <EditLegalLinksModal
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedField(null);
          }}
          field={selectedField}
          label={items.find((i) => i.field === selectedField)?.label || ''}
          value={data[selectedField]}
          onSave={(val) => handleSave(selectedField, val)}
        />
      )}
    </Box>
  );
}

export default LegalLinksComponent;
