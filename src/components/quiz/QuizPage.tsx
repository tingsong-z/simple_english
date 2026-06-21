import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore';
import type { QuizMode } from '../../types';
import './QuizPage.css';

export default function QuizPage() {
  const navigate = useNavigate();
  const categories = useWordStore((s) => s.categories);
  const [categoryId, setCategoryId] = useState('all');
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<QuizMode>('en2cn');

  const start = () => {
    navigate('/quiz/session', { state: { categoryId, count, mode } });
  };

  return (
    <div className="quiz-page animate-fadeIn">
      <h2 className="quiz-page__title">🎯 选择题测验 / Quiz</h2>

      <div className="quiz-page__section">
        <label className="quiz-page__label">模式 / Mode</label>
        <div className="quiz-page__toggle">
          <button className={`toggle-btn ${mode === 'en2cn' ? 'toggle-btn--active' : ''}`} onClick={() => setMode('en2cn')}>英 → 中</button>
          <button className={`toggle-btn ${mode === 'cn2en' ? 'toggle-btn--active' : ''}`} onClick={() => setMode('cn2en')}>中 → 英</button>
        </div>
      </div>

      <div className="quiz-page__section">
        <label className="quiz-page__label">题目数量 / Questions</label>
        <div className="quiz-page__chips">
          {[5, 10, 20].map((n) => (
            <button key={n} className={`chip ${count === n ? 'chip--active' : ''}`} onClick={() => setCount(n)}>{n}</button>
          ))}
        </div>
      </div>

      <div className="quiz-page__section">
        <label className="quiz-page__label">分类 / Category</label>
        <div className="quiz-page__chips">
          <button className={`chip ${categoryId === 'all' ? 'chip--active' : ''}`} onClick={() => setCategoryId('all')}>全部</button>
          {categories.map((c) => (
            <button key={c.id} className={`chip ${categoryId === c.id ? 'chip--active' : ''}`} onClick={() => setCategoryId(c.id)}>{c.nameZh}</button>
          ))}
        </div>
      </div>

      <button className="quiz-page__start" onClick={start}>开始测验</button>
    </div>
  );
}
