import { AdministradorConjunto, Entrenador, Residente, SuperAdmin, UsuarioBase } from '@/models/interfaces';
import { create } from 'zustand';


interface AuthState {
  user: Entrenador | AdministradorConjunto | Residente | SuperAdmin | null;
  setUser: (user: Entrenador | AdministradorConjunto | Residente | SuperAdmin | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
