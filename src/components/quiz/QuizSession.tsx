import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore';
import { useProgressStore } from '../../store/useProgressStore';
import { shuffle } from '../../utils/scoring';
import type { Word, QuizMode } from '../../types';
import './QuizSession.css';

interface Answer {
  wordId: string;
  correct: boolean;
}

export default function QuizSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { categoryId: string; count: number; mode: QuizMode } | null;
  const getWordsByCategory = useWordStore((s) => s.getWordsByCategory);
  const getRandomWords = useWordStore((s) => s.getRandomWords);
  const { addQuizRecord, addPoints, incrementDailyCount } = useProgressStore();

  const [questions, setQuestions] = useState<Word[]>([]);
  const [options, setOptions] = useState<Word[][]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (!state) { navigate('/quiz'); return; }
    const pool = state.categoryId === 'all'
      ? getRandomWords(state.count)
      : shuffle(getWordsByCategory(state.categoryId)).slice(0, state.count);
    if (pool.length === 0) { navigate('/quiz'); return; }
    setQuestions(pool);
    const opts = pool.map((word) => {
      const distractors = getRandomWords(3, [word.id]);
      return shuffle([word, ...distractors]);
    });
    setOptions(opts);
  }, []);

  const handleSelect = useCallback((word: Word, optId: string) => {
    if (selected) return;
    setSelected(optId);
    const correct = word.id === optId;
    setFeedback(correct ? 'correct' : 'wrong');
    setAnswers((a) => [...a, { wordId: word.id, correct }]);
    const points = correct ? 10 : 0;
    if (correct) addPoints(points);
    incrementDailyCount();

    setTimeout(() => {
      const quizMode = state?.mode ?? 'en2cn';
      if (current + 1 >= questions.length) {
        const totalCorrect = answers.filter((a) => a.correct).length + (correct ? 1 : 0);
        const totalPoints = totalCorrect * 10;
        addPoints(totalPoints - (correct ? 10 : 0));
        addQuizRecord({ date: new Date().toISOString().split('T')[0], mode: quizMode, totalQuestions: questions.length, correctCount: totalCorrect, pointsEarned: totalPoints });
        navigate('/quiz/result', { state: { total: questions.length, correct: totalCorrect, points: totalPoints, answers: [...answers, { wordId: word.id, correct }], questions, mode: quizMode } });
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, 800);
  }, [selected, current, questions, answers]);

  if (questions.length === 0) return null;
  const word = questions[current];
  const opts = options[current];
  const mode = state?.mode ?? 'en2cn';

  return (
    <div className="quiz-session animate-fadeIn">
      <div className="quiz-session__progress">
        <div className="quiz-session__bar">
          <div className="quiz-session__fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <span>{current + 1}/{questions.length}</span>
      </div>

      <div className={`quiz-session__prompt ${feedback ? `quiz-session__prompt--${feedback}` : ''}`}>
        <span className="quiz-session__emoji">{word.emoji}</span>
        <span className="quiz-session__question">{mode === 'en2cn' ? word.word : word.translation}</span>
      </div>

      <div className="quiz-session__options">
        {opts.map((w) => {
          const label = mode === 'en2cn' ? w.translation : w.word;
          const isSelected = selected === w.id;
          const isCorrect = w.id === word.id;
          let cls = 'quiz-opt';
          if (isSelected && feedback === 'correct') cls += ' quiz-opt--correct';
          else if (isSelected && feedback === 'wrong') cls += ' quiz-opt--wrong';
          else if (feedback && isCorrect) cls += ' quiz-opt--reveal';
          return (
            <button key={w.id} className={cls} onClick={() => handleSelect(word, w.id)} disabled={!!selected}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
