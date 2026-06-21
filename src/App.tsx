import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/home/HomePage';
import BrowsePage from './components/browse/BrowsePage';
import WordListPage from './components/browse/WordListPage';
import QuizPage from './components/quiz/QuizPage';
import QuizSession from './components/quiz/QuizSession';
import QuizResultPage from './components/quiz/QuizResultPage';
import SpellPage from './components/spell/SpellPage';
import ReviewPage from './components/review/ReviewPage';
import FavoritesPage from './components/favorites/FavoritesPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
