import { useAuthStore } from '@/stores/auth/useAuthStore';

export const authContext = {
  isLoggedIn: () => useAuthStore().isLoggedIn,
  getUserId: () => useAuthStore().user?.id ?? null,
};
