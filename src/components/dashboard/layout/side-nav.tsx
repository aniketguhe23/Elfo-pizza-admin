'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

import type { NavItemConfig } from '@/types/nav';
import { isNavItemActive } from '@/lib/is-nav-item-active';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        position: 'fixed',
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        top: 0,
        left: 0,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          ELFO&apos;S PIZZA
        </Typography>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map((item: NavItemConfig) => {
        const { key, ...itemProps } = item;
        return <NavItem key={key} {...itemProps} pathname={pathname} />;
      })}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  icon?: keyof typeof navIcons;
  items?: NavItemConfig[];
}

type ItemProps =
  | {
      component: React.ElementType;
      href: string;
      target?: string;
      rel?: string;
    }
  | {
      role: string;
      onClick: () => void;
      component?: undefined;
    };

function NavItem({ disabled, external, href, icon, matcher, pathname, title, items }: NavItemProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const hasChildren = items && items.length > 0;
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  const toggleOpen = (): void => {
    if (hasChildren) setOpen((prev) => !prev);
  };

  const itemProps: ItemProps =
    href && !hasChildren
      ? {
          component: external ? 'a' : RouterLink,
          href,
          target: external ? '_blank' : undefined,
          rel: external ? 'noreferrer' : undefined,
        }
      : {
          role: 'button',
          onClick: toggleOpen,
        };

  return (
    <li>
      <Box
        {...itemProps}
        component={itemProps.component ?? 'div'}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: disabled
            ? 'var(--NavItem-disabled-color)'
            : active
              ? 'var(--NavItem-active-color)'
              : 'var(--NavItem-color)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          bgcolor: active ? 'var(--NavItem-active-background)' : 'transparent',
        }}
      >
        {typeof Icon === 'function' && (
          <Icon
            fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
            fontSize="var(--icon-fontSize-md)"
            weight={active ? 'fill' : undefined}
          />
        )}

        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{title}</Typography>
        {hasChildren ? (
          <Box sx={{ marginLeft: 'auto' }}>
            {open ? (
              <CaretUp fontSize="var(--icon-fontSize-md)" weight="bold" />
            ) : (
              <CaretDown fontSize="var(--icon-fontSize-md)" weight="bold" />
            )}
          </Box>
        ) : null}
      </Box>

      {hasChildren && open ? <Box sx={{ ml: 4, mt: 1 }}>{renderNavItems({ items, pathname })}</Box> : null}
    </li>
  );
}
