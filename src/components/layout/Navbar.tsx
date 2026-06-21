import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const tabs = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/browse', icon: '📚', label: 'Browse' },
  { path: '/quiz', icon: '🎯', label: 'Quiz' },
  { path: '/spell', icon: '✍️', label: 'Spell' },
  { path: '/review', icon: '🔄', label: 'Review' },
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
