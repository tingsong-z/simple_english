import { Achievement } from '../types';

export const achievements: Achievement[] = [
  { id: 'first-words', name: 'First Words', description: 'Learn 5 words', emoji: '🌱' },
  { id: 'getting-started', name: 'Getting Started', description: 'Learn 20 words', emoji: '📚' },
  { id: 'word-collector', name: 'Word Collector', description: 'Learn 50 words', emoji: '📝' },
  { id: 'perfect-quiz', name: 'Perfect Score', description: 'Score 100% on a quiz', emoji: '💯' },
  { id: 'streak-3', name: '3-Day Streak', description: '3 days in a row', emoji: '🔥' },
  { id: 'streak-7', name: 'Week Warrior', description: '7 days in a row', emoji: '⚡' },
  { id: 'spell-master', name: 'Spelling Master', description: 'Spell 10 words correctly in a row', emoji: '✍️' },
  { id: 'night-owl', name: 'Night Owl', description: 'Study after 10 PM', emoji: '🦉' },
  { id: 'review-10', name: 'Revisionist', description: 'Review 10 words in one session', emoji: '🔄' },
  { id: 'level-5', name: 'Rising Star', description: 'Reach level 5', emoji: '⭐' },
];

export function checkAchievements(state: {
  learnedWords: Record<string, unknown>;
  quizHistory: { correctCount: number; totalQuestions: number }[];
  spellHistory: { correctCount: number; totalWords: number }[];
  streak: number;
  totalPoints: number;
  unlockedBadges: string[];
}): string[] {
  const newlyUnlocked: string[] = [];
  const learned = Object.keys(state.learnedWords).length;
  const has = (id: string) => state.unlockedBadges.includes(id);

  if (!has('first-words') && learned >= 5) newlyUnlocked.push('first-words');
  if (!has('getting-started') && learned >= 20) newlyUnlocked.push('getting-started');
  if (!has('word-collector') && learned >= 50) newlyUnlocked.push('word-collector');
  if (!has('perfect-quiz') && state.quizHistory.some((r) => r.correctCount === r.totalQuestions && r.totalQuestions > 0)) newlyUnlocked.push('perfect-quiz');
  if (!has('streak-3') && state.streak >= 3) newlyUnlocked.push('streak-3');
  if (!has('streak-7') && state.streak >= 7) newlyUnlocked.push('streak-7');
  if (!has('spell-master') && state.spellHistory.some((r) => r.correctCount === r.totalWords && r.totalWords >= 10)) newlyUnlocked.push('spell-master');
  if (!has('review-10') && learned >= 10) newlyUnlocked.push('review-10');
  if (!has('level-5') && getLevelFromPointsNoImport(state.totalPoints) >= 5) newlyUnlocked.push('level-5');

  const hour = new Date().getHours();
  if (!has('night-owl') && (hour >= 22 || hour < 5)) newlyUnlocked.push('night-owl');

  return newlyUnlocked;
}

function getLevelFromPointsNoImport(points: number): number {
  const d = 1 + points * 0.08;
  return Math.max(1, Math.floor((Math.sqrt(d) - 1) / 2) + 1);
}
