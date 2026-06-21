import { useNavigate } from 'react-router-dom';
import { useWordStore } from '../../store/useWordStore';
import './BrowsePage.css';

export default function BrowsePage() {
  const navigate = useNavigate();
  const categories = useWordStore((s) => s.categories);

  return (
    <div className="browse animate-fadeIn">
      <h2 className="browse__title">Word Categories</h2>
      <div className="browse__grid">
        {categories.map((cat) => (
          <button key={cat.id} className="browse__card" onClick={() => navigate(`/browse/${cat.id}`)}>
            <span className="browse__card-emoji">{cat.emoji}</span>
            <span className="browse__card-name">{cat.nameZh}</span>
            <span className="browse__card-en">{cat.name}</span>
            <span className="browse__card-count">{cat.count} words</span>
            <div className="browse__card-bar" style={{ background: cat.color }} />
          </button>
        ))}
      </div>
    </div>
  );
}
