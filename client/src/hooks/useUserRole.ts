import { create } from 'zustand';
import { UserRole } from '@shared/schema';

interface UserState {
  username: string;
  role: UserRole | null;
  companyName: string;
  isLoggedIn: boolean;
  setUser: (username: string, role: UserRole, companyName: string) => void;
  resetUser: () => void;
  setDemoMode: () => void; // New function for demo purposes
}

// Initialize with the user already logged in for demo purposes
const useUserStore = create<UserState>((set) => ({
  username: 'john.doe',
  role: UserRole.AGENT,
  companyName: 'Global Imports Inc.',
  isLoggedIn: true, // Auto-logged in for demo
  setUser: (username: string, role: UserRole, companyName: string) => set({ 
    username, 
    role, 
    companyName,
    isLoggedIn: true 
  }),
  resetUser: () => set({ 
    username: '', 
    role: null, 
    companyName: '',
    isLoggedIn: false 
  }),
  setDemoMode: () => set({
    username: 'john.doe',
    role: UserRole.AGENT,
    companyName: 'Global Imports Inc.',
    isLoggedIn: true
  }),
}));

export default useUserStore;
