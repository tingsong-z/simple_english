import { create } from 'zustand';
import { LearnedEntry, QuizRecord, SpellRecord } from '../types';

interface ProgressData {
  learnedWords: Record<string, LearnedEntry>;
  favorites: string[];
  quizHistory: QuizRecord[];
  spellHistory: SpellRecord[];
  totalPoints: number;
  streak: number;
  lastActiveDate: string | null;
  dailyWordCount: Record<string, number>;
  unlockedBadges: string[];
}

interface ProgressState extends ProgressData {
  _userId: string | null;
  _initForUser: (userId: string) => void;
  _clear: () => void;

  markLearned: (wordId: string, quality: number) => void;
  toggleFavorite: (wordId: string) => void;
  addQuizRecord: (record: QuizRecord) => void;
  addSpellRecord: (record: SpellRecord) => void;
  addPoints: (points: number) => void;
  checkIn: () => void;
  incrementDailyCount: () => void;
  getDueWords: (wordIds: string[]) => string[];
  getTodayCount: () => number;
  unlockBadge: (badgeId: string) => void;
}

const today = () => new Date().toISOString().split('T')[0];

function storageKey(userId: string) {
  return `ogden-progress-${userId}`;
}

function loadFromStorage(userId: string): ProgressData {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted data, use defaults */ }
  return {
    learnedWords: {},
    favorites: [],
    quizHistory: [],
    spellHistory: [],
    totalPoints: 0,
    streak: 0,
    lastActiveDate: null,
    dailyWordCount: {},
    unlockedBadges: [],
  };
}

let _saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave(userId: string, data: ProgressData) {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    localStorage.setItem(storageKey(userId), JSON.stringify(data));
  }, 200);
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  learnedWords: {},
  favorites: [],
  quizHistory: [],
  spellHistory: [],
  totalPoints: 0,
  streak: 0,
  lastActiveDate: null,
  dailyWordCount: {},
  unlockedBadges: [],
  _userId: null,

  _initForUser: (userId: string) => {
    const data = loadFromStorage(userId);
    set({ ...data, _userId: userId });
  },

  _clear: () => {
    set({
      learnedWords: {},
      favorites: [],
      quizHistory: [],
      spellHistory: [],
      totalPoints: 0,
      streak: 0,
      lastActiveDate: null,
      dailyWordCount: {},
      unlockedBadges: [],
      _userId: null,
    });
  },

  markLearned: (wordId: string, quality: number) => {
    const state = get();
    const prev = state.learnedWords[wordId];
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

    const newLearned = {
      ...state.learnedWords,
      [wordId]: {
        wordId,
        quality,
        repetitions,
        ef,
        interval,
        nextReview: nextReview.toISOString().split('T')[0],
        lastReview: today(),
      },
    };
    set({ learnedWords: newLearned });
    if (state._userId) scheduleSave(state._userId, { ...state, learnedWords: newLearned });
  },

  toggleFavorite: (wordId: string) => {
    const state = get();
    const newFavs = state.favorites.includes(wordId)
      ? state.favorites.filter((id) => id !== wordId)
      : [...state.favorites, wordId];
    set({ favorites: newFavs });
    if (state._userId) scheduleSave(state._userId, { ...state, favorites: newFavs });
  },

  addQuizRecord: (record: QuizRecord) => {
    const state = get();
    const newHistory = [...state.quizHistory, record];
    set({ quizHistory: newHistory });
    if (state._userId) scheduleSave(state._userId, { ...state, quizHistory: newHistory });
  },

  addSpellRecord: (record: SpellRecord) => {
    const state = get();
    const newHistory = [...state.spellHistory, record];
    set({ spellHistory: newHistory });
    if (state._userId) scheduleSave(state._userId, { ...state, spellHistory: newHistory });
  },

  addPoints: (points: number) => {
    const state = get();
    const newPoints = state.totalPoints + points;
    set({ totalPoints: newPoints });
    if (state._userId) scheduleSave(state._userId, { ...state, totalPoints: newPoints });
  },

  checkIn: () => {
    const state = get();
    const cur = today();
    const last = state.lastActiveDate;
    let newStreak = state.streak;
    if (!last) {
      newStreak = 1;
    } else if (last === cur) {
      return; // already checked in today
    } else {
      const d1 = new Date(last);
      const d2 = new Date(cur);
      const diff = Math.floor((d2.getTime() - d1.getTime()) / 86400000);
      newStreak = diff === 1 ? state.streak + 1 : 1;
    }
    set({ streak: newStreak, lastActiveDate: cur });
    if (state._userId) scheduleSave(state._userId, { ...state, streak: newStreak, lastActiveDate: cur });
  },

  incrementDailyCount: () => {
    const state = get();
    const key = today();
    const newCount = { ...state.dailyWordCount, [key]: (state.dailyWordCount[key] || 0) + 1 };
    set({ dailyWordCount: newCount });
    if (state._userId) scheduleSave(state._userId, { ...state, dailyWordCount: newCount });
  },

  getDueWords: (wordIds: string[]) => {
    const cur = today();
    const learned = get().learnedWords;
    return wordIds.filter((id) => {
      const entry = learned[id];
      return entry && entry.nextReview <= cur;
    });
  },

  getTodayCount: () => {
    return get().dailyWordCount[today()] || 0;
  },

  unlockBadge: (badgeId: string) => {
    const state = get();
    if (state.unlockedBadges.includes(badgeId)) return;
    const newBadges = [...state.unlockedBadges, badgeId];
    set({ unlockedBadges: newBadges });
    if (state._userId) scheduleSave(state._userId, { ...state, unlockedBadges: newBadges });
  },
}));
