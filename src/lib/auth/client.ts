'use client';

import type { User } from '@/types/user';

class AuthClient {
  // Get the current user from localStorage
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const storedUser = localStorage.getItem('adminUser');

      if (!storedUser) {
        return { data: null };
      }

const user = JSON.parse(storedUser) as unknown as User;
      return { data: user };
    } catch (error) {
      return { data: null, error: 'Failed to parse user from localStorage' };
    }
  }

  // Sign out the user by clearing localStorage
  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    return {};
  }
}

export const authClient = new AuthClient();
