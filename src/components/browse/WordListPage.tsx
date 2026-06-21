import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useWordStore } from '../../store/useWordStore';
import { useProgressStore } from '../../store/useProgressStore';
import { speak } from '../../utils/speech';
import './WordListPage.css';

export default function WordListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const getWordsByCategory = useWordStore((s) => s.getWordsByCategory);
  const categories = useWordStore((s) => s.categories);
  const { favorites, toggleFavorite, incrementDailyCount } = useProgressStore();

  const category = categories.find((c) => c.id === categoryId);
  const words = categoryId ? getWordsByCategory(categoryId) : [];
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!category) return null;

  const word = words[currentIndex];

  const handleFlip = (id: string) => {
    setFlipped((f) => ({ ...f, [id]: !f[id] }));
    incrementDailyCount();
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speak(text);
  };

  return (
    <div className="word-list animate-fadeIn">
      <div className="word-list__header">
        <button className="word-list__back" onClick={() => navigate('/browse')}>← 返回</button>
        <h2 className="word-list__title">{category.emoji} {category.nameZh}</h2>
        <span className="word-list__progress">{currentIndex + 1} / {words.length}</span>
      </div>

      <div className="word-list__card-container" onClick={() => handleFlip(word.id)}>
        <div className={`word-card ${flipped[word.id] ? 'word-card--flipped' : ''}`}>
          <div className="word-card__inner">
            <div className="word-card__front">
              <span className="word-card__emoji">{word.emoji}</span>
              <h3 className="word-card__word">{word.word}</h3>
              <span className="word-card__freq">{'★'.repeat(word.frequency)}</span>
              <button className="word-card__speak" onClick={(e) => handleSpeak(e, word.word)}>🔊</button>
            </div>
            <div className="word-card__back">
              <p className="word-card__zh">{word.translation}</p>
              <p className="word-card__pos">{word.partOfSpeech}</p>
              <p className="word-card__ex-en">{word.exampleEn}</p>
              <p className="word-card__ex-zh">{word.exampleZh}</p>
              <button
                className={`word-card__fav ${favorites.includes(word.id) ? 'word-card__fav--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(word.id); }}
              >
                {favorites.includes(word.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="word-list__nav">
        <button disabled={currentIndex === 0} onClick={() => { setCurrentIndex((i) => i - 1); setFlipped({}); }}>← 上一个</button>
        <button className="word-list__fav-btn" onClick={() => navigate('/favorites')}>❤️ 收藏 ({favorites.length})</button>
        <button disabled={currentIndex === words.length - 1} onClick={() => { setCurrentIndex((i) => i + 1); setFlipped({}); }}>下一个 →</button>
      </div>
    </div>
  );
}
