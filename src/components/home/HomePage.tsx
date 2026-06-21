import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { useWordStore } from '../../store/useWordStore';
import { getLevelFromPoints } from '../../utils/scoring';
import { achievements, checkAchievements } from '../../utils/achievements';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { streak, totalPoints, quizHistory, spellHistory, learnedWords, unlockedBadges, checkIn, getTodayCount } = useProgressStore();
  const categories = useWordStore((s) => s.categories);
  const todayCount = getTodayCount();
  const level = getLevelFromPoints(totalPoints);
  const [showBadge, setShowBadge] = useState<string | null>(null);

  useEffect(() => {
    const newBadges = checkAchievements({
      learnedWords,
      quizHistory,
      spellHistory,
      streak,
      totalPoints,
      unlockedBadges,
    });
    newBadges.forEach((id) => {
      useProgressStore.getState().unlockBadge(id);
      setShowBadge(id);
      setTimeout(() => setShowBadge(null), 3000);
    });
  }, []);

  const dailyGoal = 20;
  const progress = Math.min(todayCount / dailyGoal, 1);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="home animate-fadeIn">
      <div className="home__hero">
        <div className="home__progress-ring">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#E8ECF0" strokeWidth="8" />
            <circle
              cx="60" cy="60" r={radius} fill="none" stroke="var(--color-primary)"
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-text-primary)">
              {todayCount}/{dailyGoal}
            </text>
            <text x="60" y="74" textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">
              today
            </text>
          </svg>
        </div>
        <div className="home__stats">
          <div className="home__stat" onClick={checkIn}>
            <span className="home__stat-value">🔥 {streak}</span>
            <span className="home__stat-label">days</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-value">⭐ Lv.{level}</span>
            <span className="home__stat-label">level</span>
          </div>
          <div className="home__stat">
            <span className="home__stat-value">💎 {totalPoints}</span>
            <span className="home__stat-label">points</span>
          </div>
        </div>
      </div>

      <div className="home__quick-actions">
        <button className="quick-btn quick-btn--quiz" onClick={() => navigate('/quiz')}>
          <span className="quick-btn__icon">🎯</span>
          <span>Quiz</span>
        </button>
        <button className="quick-btn quick-btn--spell" onClick={() => navigate('/spell')}>
          <span className="quick-btn__icon">✍️</span>
          <span>Spell</span>
        </button>
        <button className="quick-btn quick-btn--review" onClick={() => navigate('/review')}>
          <span className="quick-btn__icon">🔄</span>
          <span>Review</span>
        </button>
      </div>

      <section className="home__section">
        <h3 className="home__section-title">📚 Categories</h3>
        <div className="home__categories">
          {categories.map((cat) => (
            <button key={cat.id} className="home__cat-chip" onClick={() => navigate(`/browse/${cat.id}`)}>
              <span>{cat.emoji}</span>
              <span>{cat.nameZh}</span>
              <span className="home__cat-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home__section">
        <h3 className="home__section-title">🏆 Achievements</h3>
        <div className="home__achievements">
          {achievements.map((a) => {
            const unlocked = unlockedBadges.includes(a.id);
            return (
              <div key={a.id} className={`ach-badge ${unlocked ? 'ach-badge--unlocked' : ''}`}>
                <span className="ach-badge__icon">{unlocked ? a.emoji : '🔒'}</span>
                <span className="ach-badge__name">{a.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {showBadge && (
        <div className="badge-popup animate-bounceIn">
          <span className="badge-popup__emoji">{achievements.find((a) => a.id === showBadge)?.emoji}</span>
          <span>Achievement Unlocked!</span>
        </div>
      )}
    </div>
  );
}
