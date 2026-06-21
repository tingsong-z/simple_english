import { useState, useCallback } from 'react';
import { useWordStore } from '../../store/useWordStore';
import { useProgressStore } from '../../store/useProgressStore';
import { shuffle } from '../../utils/scoring';
import { speak } from '../../utils/speech';
import type { Word } from '../../types';
import './SpellPage.css';

export default function SpellPage() {
  const categories = useWordStore((s) => s.categories);
  const getRandomWords = useWordStore((s) => s.getRandomWords);
  const { addPoints, incrementDailyCount, addSpellRecord } = useProgressStore();

  const [state, setState] = useState<'config' | 'playing' | 'done'>('config');
  const [categoryId, setCategoryId] = useState('all');
  const [count, setCount] = useState(10);
  const [words, setWords] = useState<Word[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const start = () => {
    const pool = categoryId === 'all'
      ? getRandomWords(count)
      : shuffle(useWordStore.getState().getWordsByCategory(categoryId)).slice(0, count);
    setWords(pool);
    setCurrent(0);
    setScore(0);
    setInput('');
    setFeedback(null);
    setState('playing');
  };

  const check = useCallback(() => {
    const word = words[current];
    const ans = input.trim().toLowerCase();
    const correct = ans === word.word.toLowerCase();
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      const pts = 20;
      addPoints(pts);
      setScore((s) => s + pts);
    }
    incrementDailyCount();

    setTimeout(() => {
      if (current + 1 >= words.length) {
        addSpellRecord({ date: new Date().toISOString().split('T')[0], totalWords: words.length, correctCount: score / 20 + (correct ? 1 : 0), pointsEarned: score + (correct ? 20 : 0) });
        setState('done');
      } else {
        setCurrent((c) => c + 1);
        setInput('');
        setFeedback(null);
      }
    }, 1200);
  }, [input, current, words, score]);

  if (state === 'config') {
    return (
      <div className="spell-page animate-fadeIn">
        <h2 className="spell-page__title">✍️ 拼写练习 / Spell</h2>
        <div className="spell-page__section">
          <label className="spell-page__label">题目数量 / Questions</label>
          <div className="spell-page__chips">
            {[5, 10, 20].map((n) => <button key={n} className={`chip ${count === n ? 'chip--active' : ''}`} onClick={() => setCount(n)}>{n}</button>)}
          </div>
        </div>
        <div className="spell-page__section">
          <label className="spell-page__label">分类 / Category</label>
          <div className="spell-page__chips">
            <button className={`chip ${categoryId === 'all' ? 'chip--active' : ''}`} onClick={() => setCategoryId('all')}>全部</button>
            {categories.map((c) => <button key={c.id} className={`chip ${categoryId === c.id ? 'chip--active' : ''}`} onClick={() => setCategoryId(c.id)}>{c.nameZh}</button>)}
          </div>
        </div>
        <button className="spell-page__start" onClick={start}>开始拼写</button>
      </div>
    );
  }

  if (state === 'done') {
    return (
      <div className="spell-page animate-slideUp">
        <div className="spell-page__result">
          <span className="spell-page__result-emoji">{score === words.length * 20 ? '🎉' : '🌟'}</span>
          <span className="spell-page__result-score">{score / 20}/{words.length} 正确</span>
          <span className="spell-page__result-xp">+{score} 经验</span>
        </div>
        <button className="spell-page__start" onClick={() => setState('config')}>再来一次</button>
        <button className="result-btn" style={{ marginTop: 10 }} onClick={() => setState('config')}>返回设置</button>
      </div>
    );
  }

  const word = words[current];
  return (
    <div className="spell-page animate-fadeIn">
      <div className="spell-page__progress">
        <span>{current + 1}/{words.length}</span>
        <span className="spell-page__score">得分: {score}</span>
      </div>

      <div className={`spell-page__prompt ${feedback ? `spell-page__prompt--${feedback}` : ''}`}>
        <span className="spell-page__emoji">{word.emoji}</span>
        <span className="spell-page__zh">{word.translation}</span>
        <span className="spell-page__pos">{word.partOfSpeech}</span>
        <button className="spell-page__speak" onClick={() => speak(word.word)}>🔊 听发音</button>
      </div>

      <div className="spell-page__input-area">
        <input
          className="spell-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) check(); }}
          placeholder="输入英文单词..."
          autoFocus
          disabled={!!feedback}
        />
        {feedback && (
          <p className={`spell-feedback ${feedback === 'wrong' ? 'spell-feedback--wrong' : ''}`}>
            {feedback === 'correct' ? '✅ 正确！' : `❌ 正确答案是: ${word.word}`}
          </p>
        )}
        <button className="spell-check-btn" onClick={check} disabled={!input.trim() || !!feedback}>检查</button>
      </div>
    </div>
  );
}
