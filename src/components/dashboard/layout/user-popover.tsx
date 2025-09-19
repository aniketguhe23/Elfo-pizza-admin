import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { UpdateCredentialsModal } from '../account/UpdatePasswordModal';
// import { UpdatePasswordModal } from './UpdatePasswordModal';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { checkSession } = useUser();
  const router = useRouter();
  const [adminUser, setAdminUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setAdminUser(parsedUser);
      } catch {
        setAdminUser(null);
      }
    }
  }, []);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        logger.error('Sign out error', error);
        return;
      }
      await checkSession?.();
      router.refresh();
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={onClose}
        open={open}
        slotProps={{ paper: { sx: { width: '300px' } } }}
      >
        <Box sx={{ p: '16px 20px ' }}>
          <Typography variant="subtitle1">
            {String(adminUser?.firstname ?? '')} {String(adminUser?.lastname ?? '')}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {String(adminUser?.email ?? '')}
          </Typography>
        </Box>
        <Divider />
        <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
          <MenuItem onClick={() => setIsModalOpen(true)}>
            <ListItemIcon>
              <GearSixIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
           Change Credentials
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <SignOutIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </MenuList>
      </Popover>

      <UpdateCredentialsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adminId={adminUser?.id ?? ''}
      />
    </>
  );
}
