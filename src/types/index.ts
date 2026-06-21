export interface Word {
  id: string;
  word: string;
  emoji: string;
  translation: string;
  partOfSpeech: string;
  frequency: number;
  exampleEn: string;
  exampleZh: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  nameZh: string;
  count: number;
  color: string;
  emoji: string;
}

export interface LearnedEntry {
  wordId: string;
  quality: number;
  repetitions: number;
  ef: number;
  interval: number;
  nextReview: string;
  lastReview: string;
}

export interface QuizRecord {
  date: string;
  mode: 'en2cn' | 'cn2en';
  totalQuestions: number;
  correctCount: number;
  pointsEarned: number;
}

export interface SpellRecord {
  date: string;
  totalWords: number;
  correctCount: number;
  pointsEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export type QuizMode = 'en2cn' | 'cn2en';
