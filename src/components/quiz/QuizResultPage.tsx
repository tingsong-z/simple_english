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
        <span className="quiz-result__pct">{pct}% 正确率</span>
        <span className="quiz-result__xp">+{points} 经验</span>
      </div>
      <div className="quiz-result__actions">
        <button className="result-btn result-btn--primary" onClick={() => navigate('/quiz')}>再来一次</button>
        <button className="result-btn" onClick={() => navigate('/')}>返回首页</button>
      </div>
    </div>
  );
}
