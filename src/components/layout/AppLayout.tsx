import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import './AppLayout.css';

export default function AppLayout() {
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
