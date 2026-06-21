import { useLocation, useNavigate } from 'react-router-dom';
import type { Word, QuizMode } from '../../types';
import './QuizResultPage.css';

export default function QuizResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    total: number; correct: number; points: number;
    answers: { wordId: string; correct: boolean }[];
    questions: Word[]; mode: QuizMode;
  } | null;

  if (!state) { navigate('/quiz'); return null; }

  const { total, correct, points } = state;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct === 100 ? '🎉' : pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪';

  return (
    <div className="quiz-result animate-slideUp">
      <div className="quiz-result__hero">
        <span className="quiz-result__emoji">{emoji}</span>
        <span className="quiz-result__score">{correct}/{total}</span>
        <span className="quiz-result__pct">{pct}% correct</span>
        <span className="quiz-result__xp">+{points} XP</span>
      </div>
      <div className="quiz-result__actions">
        <button className="result-btn result-btn--primary" onClick={() => navigate('/quiz')}>Try Again</button>
        <button className="result-btn" onClick={() => navigate('/')}>Back Home</button>
      </div>
    </div>
  );
}
