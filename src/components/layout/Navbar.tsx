import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const tabs = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/browse', icon: '📚', label: '浏览' },
  { path: '/quiz', icon: '🎯', label: '测验' },
  { path: '/spell', icon: '✍️', label: '拼写' },
  { path: '/review', icon: '🔄', label: '复习' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`navbar__item ${pathname === tab.path ? 'navbar__item--active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="navbar__icon">{tab.icon}</span>
          <span className="navbar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
