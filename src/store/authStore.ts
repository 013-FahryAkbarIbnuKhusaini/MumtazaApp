import { create } from 'zustand';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, phone: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    // TODO: replace with real API call
    await new Promise((res) => setTimeout(res, 1200));

    if (!email || !password) {
      set({ isLoading: false, error: 'All fields are required' });
      return false;
    }

    set({ user: { name: 'Demo User', email }, isLoading: false });
    return true;
  },
  register: async (fullName, phone, email, password) => {
    set({ isLoading: true, error: null });
    // TODO: replace with real API call
    await new Promise((res) => setTimeout(res, 1200));

    if (!fullName || !phone || !email || !password) {
      set({ isLoading: false, error: 'All fields are required' });
      return false;
    }

    if (password.length < 6) {
        set({ isLoading: false, error: 'Password must be at least 6 characters' });
        return false;
    }

    set({ user: { name: fullName, email }, isLoading: false });
    return true;
  },
}));
