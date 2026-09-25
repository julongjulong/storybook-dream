// The v4 attack order per case. Older tests use it to pick a specific shared pattern
// (aimed, spread, ring, beam, dash) now that v5 bosses choose their moves themselves.
export const V4_PATTERNS = {
  1: [],
  2: ['aimed'],
  3: ['spread'],
  4: ['dash', 'aimed'],
  5: ['ring', 'aimed'],
  6: ['beam', 'spread'],
  7: ['aimed', 'dash', 'beam'],
  8: ['ring', 'beam', 'spread'],
  9: ['spread', 'dash', 'ring'],
  10: ['aimed', 'beam', 'ring'],
  11: ['ring', 'spread', 'aimed', 'dash'],
  12: ['beam', 'ring', 'dash', 'spread'],
};
// Start the tell the v4 boss would have shown for attack number `index`.
export function warnV4(g, index = g.attackIndex) {
  const list = V4_PATTERNS[g.stageNumber];
  g.attackIndex = index;
  g.beginWarning(list[index % list.length]);
}
