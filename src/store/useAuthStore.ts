import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  createdAt: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  createUser: (username: string) => User;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      createUser: (username: string) => {
        const existing = get().users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );
        if (existing) {
          set({ currentUser: existing });
          return existing;
        }
        const user: User = {
          id: Date.now().toString(36),
          username: username.trim(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, user], currentUser: user }));
        return user;
      },

      login: (userId: string) => {
        const user = get().users.find((u) => u.id === userId);
        if (user) set({ currentUser: user });
      },

      logout: () => set({ currentUser: null }),
    }),
    { name: 'ogden-850-auth' }
  )
);
