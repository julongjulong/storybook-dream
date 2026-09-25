import { STORY } from './story-data.js';
import { SHEET_FRAMES } from './sheet-frames.js';

// Each original sheet has two columns and three rows. Display a panel at runtime;
// the source illustration stays intact in the portable game and source archive.
export function artFrame(id) {
  if (id === 'opening-dream') id = 'race-twist';
  for (const world of STORY.worlds) {
    const n =
      id === world.id
        ? 3
        : ['before', 'twist', 'challenge', 'found', 'solved', 'wink'].findIndex(
            s => id === `${world.id}-${s}`,
          );
    if (n >= 0) {
      const sheet = SHEET_FRAMES[world.id],
        rect = sheet?.panels[n];
      if (rect)
        return {
          x: rect[0] / sheet.width,
          y: rect[1] / sheet.height,
          width: rect[2] / sheet.width,
          height: rect[3] / sheet.height,
          aspect: rect[2] / rect[3],
        };
      return { x: (n % 2) / 2, y: Math.floor(n / 2) / 3, width: 0.5, height: 1 / 3, aspect: 1.5 };
    }
  }
  return null;
}
