export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getLevelFromPoints(points: number): number {
  const d = 1 + points * 0.08;
  return Math.max(1, Math.floor((Math.sqrt(d) - 1) / 2) + 1);
}

export function getPointsForNextLevel(points: number): number {
  const L = getLevelFromPoints(points);
  return L * (L + 1) * 50 - points;
}
