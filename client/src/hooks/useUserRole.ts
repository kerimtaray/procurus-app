import { create } from 'zustand';
import { UserRole } from '@shared/schema';

interface UserState {
  username: string;
  role: UserRole | null;
  companyName: string;
  isLoggedIn: boolean;
  setUser: (username: string, role: UserRole, companyName: string) => void;
  resetUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  username: '',
  role: null,
  companyName: '',
  isLoggedIn: false,
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
}));

export default useUserStore;
