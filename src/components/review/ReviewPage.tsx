import { useState, useEffect } from 'react';
import { useWordStore } from '../../store/useWordStore';
import { useProgressStore } from '../../store/useProgressStore';
import { speak } from '../../utils/speech';
import type { Word } from '../../types';
import './ReviewPage.css';

export default function ReviewPage() {
  const words = useWordStore((s) => s.words);
  const { learnedWords, markLearned, addPoints, incrementDailyCount } = useProgressStore();
  const [queue, setQueue] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const dueIds = useProgressStore.getState().getDueWords(words.map((w) => w.id));
    let due: Word[];
    if (dueIds.length > 0) {
      due = words.filter((w) => dueIds.includes(w.id));
    } else {
      due = words.filter((w) => !learnedWords[w.id]).slice(0, 10);
    }
    setQueue(due);
    if (due.length === 0) setDone(true);
  }, [words]);

  const handleRate = (quality: number) => {
    const word = queue[index];
    markLearned(word.id, quality);
    addPoints(quality >= 4 ? 8 : quality >= 3 ? 5 : 0);
    incrementDailyCount();
    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (done || queue.length === 0) {
    return (
      <div className="review-page animate-fadeIn">
        <div className="review-page__empty">
          <span className="review-page__empty-emoji">🎉</span>
          <h3>全部完成！</h3>
          <p>暂时没有需要复习的单词。明天再来，或者开始学习新单词。</p>
        </div>
      </div>
    );
  }

  const word = queue[index];
  return (
    <div className="review-page animate-fadeIn">
      <div className="review-page__header">
        <h2>🔄 间隔复习 / Review</h2>
        <span className="review-page__count">{index + 1}/{queue.length}</span>
      </div>

      <div className="review-card" onClick={() => setFlipped(!flipped)}>
        <div className={`review-card__inner ${flipped ? 'review-card__inner--flipped' : ''}`}>
          <div className="review-card__front">
            <span className="review-card__emoji">{word.emoji}</span>
            <h3 className="review-card__word">{word.word}</h3>
            <button className="review-card__speak" onClick={(e) => { e.stopPropagation(); speak(word.word); }}>🔊</button>
          </div>
          <div className="review-card__back">
            <p className="review-card__zh">{word.translation}</p>
            <p className="review-card__ex">{word.exampleEn}</p>
            <p className="review-card__ex-zh">{word.exampleZh}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="review-card__rating animate-slideUp">
          <p className="review-card__rating-label">你记得怎么样？</p>
          <div className="review-card__buttons">
            <button onClick={() => handleRate(0)}>😫<span>忘了</span></button>
            <button onClick={() => handleRate(2)}>😐<span>困难</span></button>
            <button onClick={() => handleRate(3)}>🙂<span>一般</span></button>
            <button onClick={() => handleRate(4)}>😊<span>不错</span></button>
            <button onClick={() => handleRate(5)}>🎯<span>简单</span></button>
          </div>
        </div>
      )}
    </div>
  );
}
