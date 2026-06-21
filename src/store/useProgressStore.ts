import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LearnedEntry, QuizRecord, SpellRecord } from '../types';

interface ProgressState {
  learnedWords: Record<string, LearnedEntry>;
  favorites: string[];
  quizHistory: QuizRecord[];
  spellHistory: SpellRecord[];
  totalPoints: number;
  streak: number;
  lastActiveDate: string | null;
  dailyWordCount: Record<string, number>;
  unlockedBadges: string[];

  markLearned: (wordId: string, quality: number) => void;
  toggleFavorite: (wordId: string) => void;
  addQuizRecord: (record: QuizRecord) => void;
  addSpellRecord: (record: SpellRecord) => void;
  addPoints: (points: number) => void;
  checkIn: () => void;
  incrementDailyCount: () => void;
  getDueWords: (wordIds: string[]) => string[];
  getFavorites: () => string[];
  getTodayCount: () => number;
  unlockBadge: (badgeId: string) => void;
}

const today = () => new Date().toISOString().split('T')[0];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      learnedWords: {},
      favorites: [],
      quizHistory: [],
      spellHistory: [],
      totalPoints: 0,
      streak: 0,
      lastActiveDate: null,
      dailyWordCount: {},
      unlockedBadges: [],

      markLearned: (wordId: string, quality: number) => {
        const prev = get().learnedWords[wordId];
        let ef = prev?.ef ?? 2.5;
        let repetitions: number;
        let interval: number;

        if (quality >= 3) {
          repetitions = (prev?.repetitions ?? 0) + 1;
          if (repetitions === 1) interval = 1;
          else if (repetitions === 2) interval = 6;
          else interval = Math.round((prev?.interval ?? 0) * ef);
          ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        } else {
          repetitions = 0;
          interval = 1;
        }

        ef = Math.max(ef, 1.3);
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        set((s) => ({
          learnedWords: {
            ...s.learnedWords,
            [wordId]: {
              wordId,
              quality,
              repetitions,
              ef,
              interval,
              nextReview: nextReview.toISOString().split('T')[0],
              lastReview: today(),
            },
          },
        }));
      },

      toggleFavorite: (wordId: string) =>
        set((s) => ({
          favorites: s.favorites.includes(wordId)
            ? s.favorites.filter((id) => id !== wordId)
            : [...s.favorites, wordId],
        })),

      addQuizRecord: (record: QuizRecord) =>
        set((s) => ({ quizHistory: [...s.quizHistory, record] })),

      addSpellRecord: (record: SpellRecord) =>
        set((s) => ({ spellHistory: [...s.spellHistory, record] })),

      addPoints: (points: number) =>
        set((s) => ({ totalPoints: s.totalPoints + points })),

      checkIn: () => {
        const cur = today();
        const last = get().lastActiveDate;
        if (!last) {
          set({ streak: 1, lastActiveDate: cur });
          return;
        }
        if (last === cur) return;
        const d1 = new Date(last);
        const d2 = new Date(cur);
        const diff = Math.floor((d2.getTime() - d1.getTime()) / 86400000);
        if (diff === 1) {
          set((s) => ({ streak: s.streak + 1, lastActiveDate: cur }));
        } else {
          set({ streak: 1, lastActiveDate: cur });
        }
      },

      incrementDailyCount: () => {
        const key = today();
        set((s) => ({
          dailyWordCount: {
            ...s.dailyWordCount,
            [key]: (s.dailyWordCount[key] || 0) + 1,
          },
        }));
      },

      getDueWords: (wordIds: string[]) => {
        const cur = today();
        const learned = get().learnedWords;
        return wordIds.filter((id) => {
          const entry = learned[id];
          return entry && entry.nextReview <= cur;
        });
      },

      getFavorites: () => get().favorites,

      getTodayCount: () => {
        return get().dailyWordCount[today()] || 0;
      },

      unlockBadge: (badgeId: string) =>
        set((s) => ({
          unlockedBadges: s.unlockedBadges.includes(badgeId)
            ? s.unlockedBadges
            : [...s.unlockedBadges, badgeId],
        })),
    }),
    { name: 'ogden-850-progress' }
  )
);
