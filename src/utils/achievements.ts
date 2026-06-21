import { Achievement } from '../types';

export const achievements: Achievement[] = [
  { id: 'first-words', name: '初识英语', description: '学习 5 个单词', emoji: '🌱' },
  { id: 'getting-started', name: '入门学习', description: '学习 20 个单词', emoji: '📚' },
  { id: 'word-collector', name: '单词收藏家', description: '学习 50 个单词', emoji: '📝' },
  { id: 'perfect-quiz', name: '满分选手', description: '一次测验全部正确', emoji: '💯' },
  { id: 'streak-3', name: '三天打鱼', description: '连续 3 天学习', emoji: '🔥' },
  { id: 'streak-7', name: '一周战士', description: '连续 7 天学习', emoji: '⚡' },
  { id: 'spell-master', name: '拼写大师', description: '连续拼对 10 个单词', emoji: '✍️' },
  { id: 'night-owl', name: '夜猫子', description: '在晚上10点后学习', emoji: '🦉' },
  { id: 'review-10', name: '复习达人', description: '一次复习 10 个单词', emoji: '🔄' },
  { id: 'level-5', name: '后起之秀', description: '达到等级 5', emoji: '⭐' },
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
