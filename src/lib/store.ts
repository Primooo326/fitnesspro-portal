import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  conjuntoData: any | null; // You might want to define a more specific type for conjuntoData
  setUser: (user: User | null) => void;
  setConjuntoData: (data: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  conjuntoData: null,
  setUser: (user) => set({ user }),
  setConjuntoData: (data) => set({ conjuntoData: data }),
  logout: () => set({ user: null, conjuntoData: null }),
}));
