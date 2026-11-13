// Deterministic color per accord name: not Fragrantica's real palette
// (which isn't public), but it guarantees the same accord always gets the
// same color across the app, without hand-maintaining a map for each of
// the ~98 accords in the DB. Muted saturation so it sits well on the dark
// theme, and dark enough to keep white text readable.
export function colorForAccord(name: string): string {
  let hash = 0;
  const normalized = name.toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 35%, 38%)`;
}
