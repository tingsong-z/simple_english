import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore';
import { useProgressStore } from '../../store/useProgressStore';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const getWordById = useWordStore((s) => s.getWordById);
  const { favorites, toggleFavorite } = useProgressStore();

  const words = favorites.map((id) => getWordById(id)).filter(Boolean);

  return (
    <div className="fav-page animate-fadeIn">
      <div className="fav-page__header">
        <button className="fav-page__back" onClick={() => navigate(-1)}>← Back</button>
        <h2>❤️ Favorites</h2>
        <span className="fav-page__count">{words.length} words</span>
      </div>

      {words.length === 0 ? (
        <div className="fav-page__empty">
          <span>💔</span>
          <p>No favorites yet. Tap the heart on any word card to save it here.</p>
        </div>
      ) : (
        <div className="fav-page__grid">
          {words.map((w) => w && (
            <div key={w.id} className="fav-word">
              <button className="fav-word__remove" onClick={() => toggleFavorite(w.id)}>❤️</button>
              <span className="fav-word__emoji">{w.emoji}</span>
              <span className="fav-word__en">{w.word}</span>
              <span className="fav-word__zh">{w.translation}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
