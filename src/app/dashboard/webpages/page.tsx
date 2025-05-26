'use client';

import * as React from 'react';
import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Import the tab content components
import HomeTab from './HomePage/page';
import MenuTab from './MenuTab';
import BuildYourOwnTab from './BuildYourOwnTab';

export default function Page(): React.JSX.Element {
  const [value, setValue] = React.useState(0);

const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Pages</Typography>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Tabs value={value} onChange={handleTabChange} aria-label="Tabs for integrations">
        <Tab label="Home" />
        <Tab label="Menu" />
        <Tab label="Build Your Own" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {value === 0 && <HomeTab />}
        {value === 1 && <MenuTab />}
        {value === 2 && <BuildYourOwnTab />}
      </Box>
    </Stack>
  );
}
