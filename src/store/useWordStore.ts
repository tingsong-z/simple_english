import { create } from 'zustand';
import { Word, Category } from '../types';
import { words as allWords, categories as allCategories } from '../data/words';

interface WordStore {
  words: Word[];
  categories: Category[];

  getWordsByCategory: (categoryId: string) => Word[];
  getWordById: (id: string) => Word | undefined;
  getRandomWords: (count: number, excludeIds?: string[]) => Word[];
  searchWords: (query: string) => Word[];
}

export const useWordStore = create<WordStore>(() => ({
  words: allWords,
  categories: allCategories,

  getWordsByCategory: (categoryId: string) =>
    allWords.filter((w) => w.categoryId === categoryId),

  getWordById: (id: string) =>
    allWords.find((w) => w.id === id),

  getRandomWords: (count: number, excludeIds: string[] = []) => {
    const pool = allWords.filter((w) => !excludeIds.includes(w.id));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  searchWords: (query: string) => {
    const q = query.toLowerCase();
    return allWords.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation.includes(q) ||
        w.exampleEn.toLowerCase().includes(q)
    );
  },
}));
