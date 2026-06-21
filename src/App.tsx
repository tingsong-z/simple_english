import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './components/home/HomePage';
import BrowsePage from './components/browse/BrowsePage';
import WordListPage from './components/browse/WordListPage';
import QuizPage from './components/quiz/QuizPage';
import QuizSession from './components/quiz/QuizSession';
import QuizResultPage from './components/quiz/QuizResultPage';
import SpellPage from './components/spell/SpellPage';
import ReviewPage from './components/review/ReviewPage';
import FavoritesPage from './components/favorites/FavoritesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="browse/:categoryId" element={<WordListPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="quiz/session" element={<QuizSession />} />
          <Route path="quiz/result" element={<QuizResultPage />} />
          <Route path="spell" element={<SpellPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
