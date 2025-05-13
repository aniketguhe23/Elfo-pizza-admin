import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
        backgroundColor: '#fffaf0', // light pizza-theme background
      }}
    >
      {/* Left section - form & logo */}
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            ELFO'S Pizza Admin
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>

      {/* Right section - themed visual */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          p: 4,
          background: 'radial-gradient(50% 50% at 50% 50%, #ff7043 0%, #d84315 100%)',
          color: '#fff',
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              sx={{
                fontSize: '26px',
                fontWeight: 'bold',
                lineHeight: '34px',
                textAlign: 'center',
              }}
              variant="h1"
            >
              Welcome to{' '}
              <Box component="span" sx={{ color: '#ffe082' }}>
                ELFO'S Pizza Admin
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1" sx={{ fontStyle: 'italic' }}>
              Manage pizzas, orders, and your hot oven with ease 🍕🔥
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              alt="Pizza Admin Widgets"
              src="/images/ps1.png" // <-- Make sure this image exists
              sx={{ height: 'auto', width: '100%', maxWidth: '520px', borderRadius: 2 }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
