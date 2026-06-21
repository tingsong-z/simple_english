import { useProgressStore } from '../../store/useProgressStore';
import { getLevelFromPoints } from '../../utils/scoring';
import './Header.css';

export default function Header() {
  const streak = useProgressStore((s) => s.streak);
  const totalPoints = useProgressStore((s) => s.totalPoints);
  const level = getLevelFromPoints(totalPoints);

  return (
    <header className="header">
      <div className="header__title">Ogden 850</div>
      <div className="header__stats">
        <span className="header__badge" title="Streak">🔥 {streak}</span>
        <span className="header__badge" title="Level">⭐ Lv.{level}</span>
        <span className="header__badge" title="Points">💎 {totalPoints}</span>
      </div>
    </header>
  );
}
