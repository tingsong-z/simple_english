import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useProgressStore } from '../../store/useProgressStore';
import { getLevelFromPoints } from '../../utils/scoring';
import './Header.css';

export default function Header() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const streak = useProgressStore((s) => s.streak);
  const totalPoints = useProgressStore((s) => s.totalPoints);
  const level = getLevelFromPoints(totalPoints);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__title">Ogden 850</div>
        {currentUser && (
          <span className="header__user">{currentUser.username}</span>
        )}
      </div>
      <div className="header__stats">
        <span className="header__badge" title="Streak">🔥 {streak}</span>
        <span className="header__badge" title="Level">⭐ Lv.{level}</span>
        <span className="header__badge" title="Points">💎 {totalPoints}</span>
        <button className="header__logout" onClick={handleLogout} title="退出">
          退出
        </button>
      </div>
    </header>
  );
}
