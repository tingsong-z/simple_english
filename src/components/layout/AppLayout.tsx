import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useProgressStore } from '../../store/useProgressStore';
import Navbar from './Navbar';
import Header from './Header';
import './AppLayout.css';

export default function AppLayout() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    const userId = currentUser?.id ?? null;
    if (userId !== lastUserId.current) {
      lastUserId.current = userId;
      if (userId) {
        useProgressStore.getState()._initForUser(userId);
      } else {
        useProgressStore.getState()._clear();
      }
    }
  }, [currentUser]);

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
