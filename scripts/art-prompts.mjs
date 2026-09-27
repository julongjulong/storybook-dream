// Builds docs/art-prompts-v5.md: one complete, copy-paste prompt per picture.
// A picture counts as done when its file exists under assets/v5 (any of png/jpg/jpeg/webp).
// Run: node scripts/art-prompts.mjs
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const exists = path =>
  ['png', 'jpg', 'jpeg', 'webp'].some(ext => fs.existsSync(new URL(`assets/v5/${path}.${ext}`, root)));

const STYLE =
  "Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old.";
const RABBIT =
  'The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat.';
const TTORONG =
  'Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing.';
const AVOID =
  'Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.';
const BOARD =
  'Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details.';
const FEATHER = 'IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object.';
const SPRITE =
  'Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024.';
const BOSS =
  'A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024.';
const STORY_CUT = 'Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger.';

const join = (...parts) => parts.filter(Boolean).join(' ');
const items = [];
const add = (section, file, title, prompt, note = '') => items.push({ section, file, title, prompt, note });

// 1. Play boards
const boards = [
  [
    'race',
    '1판 토끼와 거북이',
    'A meadow race track in autumn with fallen leaves. The detective rabbit lifts a pile of leaves and reveals a whole round tortoise shell, glossy and intact, large in the center. Finish-line flags in the distance.',
  ],
  [
    'duck',
    '2판 아기 오리의 연못',
    'A lily pond on a sunny day. Behind big lily pads, exactly one pair of yellow webbed rain boots floats like tiny boats, and two little ducklings ride in them, one in each boot. The detective rabbit peeks from a wide leaf at the shore, surprised.',
    '(선택) 깃털이 빠졌어요. 다시 뽑으면 깃털이 들어가게 해 주세요.',
  ],
  [
    'pigs',
    '3판 아기 돼지 삼 형제',
    'A cheerful brick house construction site. The detective rabbit and the youngest of three pigs look together at an unfolded house blueprint drawing (simple line drawing of a house, no text). Bricks, planks and a wheelbarrow around them.',
  ],
  [
    'redhood',
    '4판 빨간 모자의 심부름',
    "Grandmother's cottage garden full of flower pots. In one flower pot in the center of the picture, a small round house key stands upright like a plant label, its metal silhouette clear. The detective rabbit points at it with delight. The cottage door is in the background.",
    '지난번 4번 그림은 돼지 삼 형제가 다시 나왔어요. 빨간 모자 장면이 필요해요.',
  ],
  [
    'beans',
    '5판 잭과 콩나무',
    "Above the clouds at the top of a giant beanstalk. In the center of the picture, a small fluffy cloud wears a little brass bell on its head like a hat. The detective rabbit stands on a broad bean leaf reaching toward it. A giant's cloud house with a round door in the background.",
    '(선택) 지금 그림은 종이 맨 위에 있어요. 다시 뽑으면 종을 가운데로.',
  ],
  [
    'ant',
    '6판 개미와 베짱이',
    "Inside a cozy ant winter storehouse yard. Next to baskets of grain, a small hula hoop turns out to be a round storehouse door handle with a visible mounting peg. The detective rabbit holds it up, discovering it. A grasshopper's fiddle leans nearby.",
  ],
  [
    'lion',
    '7판 사자와 생쥐',
    'A grassy savanna clearing with a big hammock-like rope net between two trees. The detective rabbit lifts a single large leaf and finds small round-tipped craft scissors lying closed on the ground.',
  ],
  [
    'fox',
    '8판 여우와 포도',
    'A grape vineyard with hanging purple grapes. Under the vines, a low wooden ladder lies on its side and two little birds sit on it like a bench. The detective rabbit parts the leaves and discovers it.',
  ],
  [
    'wind',
    '9판 해와 바람',
    'A windy hillside meadow of tall wildflowers. A short, wide, soft hat ribbon is caught between flower stems, fluttering. The detective rabbit reaches for it. Sun and a round friendly cloud in the sky.',
  ],
  [
    'ax',
    '10판 금도끼 은도끼',
    'The edge of a calm forest pond. On a mat of water plants rests a gray iron axe with a short wooden handle, rounded storybook shape, blade facing away. The detective rabbit crouches to pick it up. A gold and a silver axe glint far in the background.',
  ],
  [
    'piper',
    '11판 피리 부는 사나이',
    'A small town square with bunting. A little mouse uses a round pipe stopper as a stand for a drumstick. The detective rabbit spots it; the mouse looks sorry and giggly. A drum and a flute nearby.',
  ],
  [
    'troy',
    '12판 트로이의 오리',
    'A festival square with a big wooden duck on a wheeled cart, wide open windows on its side. Next to a cart wheel, under colorful confetti, the round wooden door handle of the duck is revealed. The detective rabbit holds it up, smiling.',
  ],
];
for (const [id, title, scene, note] of boards)
  add('boards', `boards/${id}`, title, join(STYLE, RABBIT, scene, BOARD, FEATHER, AVOID), note);

// 2. Rabbit and 또롱 sprites
const rabbitPoses = [
  ['rabbit-idle', '토끼 · 가만히', 'standing relaxed, ears up, gentle smile'],
  ['rabbit-walk-1', '토끼 · 걷기 1', 'mid-hop walking to the right, front foot forward'],
  ['rabbit-walk-2', '토끼 · 걷기 2', 'mid-hop walking to the right, back foot pushing off'],
  [
    'rabbit-draw',
    '토끼 · 선 긋기',
    'leaning forward and tiptoeing carefully, holding a glowing golden thread behind it, focused expression',
  ],
  ['rabbit-hit', '토끼 · 맞음', 'startled, ears flopped, tiny stars around head, not hurt'],
  ['rabbit-cheer', '토끼 · 기뻐함', 'jumping with both arms up, very happy'],
];
for (const [id, title, pose] of rabbitPoses)
  add('sprites', `sprites/${id}`, title, join(STYLE, RABBIT, `Pose: ${pose}.`, SPRITE, AVOID));
const ttorongPoses = [
  ['ttorong-peek', '또롱 · 빼꼼', 'peeking out from behind something, only half visible, curious'],
  ['ttorong-fly', '또롱 · 날아감', 'flying away quickly holding a small shiny object in its beak'],
  ['ttorong-shy', '또롱 · 부끄러움', 'standing, one wing covering its face, embarrassed'],
  ['ttorong-sad', '또롱 · 쓸쓸함', 'sitting alone, looking down'],
  ['ttorong-happy', '또롱 · 웃음', 'wings open wide, laughing'],
  [
    'ttorong-detective',
    '또롱 · 탐정',
    "wearing a tiny teal neckerchief like the rabbit's, proudly saluting with a wing",
  ],
];
for (const [id, title, pose] of ttorongPoses)
  add('sprites', `sprites/${id}`, title, join(STYLE, TTORONG, `Pose: ${pose}.`, SPRITE, AVOID));

// 3. Bosses, four states each
const bosses = [
  ['race', '1판 낙엽 뭉치', 'a rolling ball of autumn leaves with two little eyes peeking out'],
  ['duck', '2판 수련 방울', 'a lily pad with a round water bubble on top, the bubble has the face'],
  ['pigs', '3판 벽돌 바람개비', 'a pinwheel made of pink bricks, face in the center hub'],
  [
    'redhood',
    '4판 빵 바구니',
    'a round wicker bread basket with a checkered cloth, rolling on its side, crumbs flying',
  ],
  ['beans', '5판 구름 물뿌리개', 'a small gray rain cloud holding a watering can'],
  ['ant', '6판 도토리 북', 'a small drum shaped like an acorn, with two drumsticks for arms'],
  ['lion', '7판 매듭 공', 'a bouncy ball made of tangled rope knots'],
  ['fox', '8판 포도 방울', 'a bunch of purple grapes with a leaf hat, each grape slightly wobbly'],
  ['wind', '9판 바람 구름', 'a swirling puff of wind cloud with a curly tail, cheeks puffed'],
  ['ax', '10판 연못 돌림판', 'a round spinning pond disk like a lily-pad turntable, glinting'],
  ['piper', '11판 박자 북', 'a marching drum with a feather plume and little legs'],
  ['troy', '12판 나무 오리', 'a small wooden duck on wheels with a hinged door on its chest'],
];
const states = [
  ['idle', '평소', 'calm floating pose, slight smile'],
  [
    'windup',
    '예고 준비',
    'squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline',
  ],
  ['attack', '공격', 'stretched and bursting with motion, mouth open in a cheerful shout, motion lines'],
  [
    'phase2',
    '2단계',
    'the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around',
  ],
];
for (const [id, title, look] of bosses)
  for (const [state, stateName, pose] of states)
    add(
      'bosses',
      `sprites/boss-${id}-${state}`,
      `${title} · ${stateName}`,
      join(
        STYLE,
        `The character: ${look}.`,
        `State: ${pose}.`,
        'Keep the same character design in all four states.',
        BOSS,
        AVOID,
      ),
      state === 'idle' ? '' : '먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.',
    );

// 4. Helpers and shots
const small = [
  ['minion-wander', '졸병 · 배회', 'a tiny round dust bunny with dot eyes, fluffy, pale blue'],
  [
    'minion-wander-red',
    '졸병 · 빨개짐',
    'the same tiny dust bunny glowing red and puffed up, spiky fur like an exclamation',
  ],
  ['minion-chaser', '졸병 · 추적(종이배)', 'a tiny paper boat with eyes that sails forward, pointy front'],
  ['minion-fuse', '불씨', 'a small warm spark shaped like a firefly, soft orange glow, friendly face'],
  ['shot-crumb', '탄 · 빵가루', 'a single round bread crumb, golden'],
  ['shot-raindrop', '탄 · 빗방울', 'a single fat cartoon raindrop'],
  ['shot-note', '탄 · 음표', 'a single round music note'],
  ['shot-grape', '탄 · 포도알', 'a single purple grape with a tiny highlight'],
  ['shot-leaf', '탄 · 나뭇잎', 'a single small green leaf'],
  ['shot-bubble', '탄 · 방울', 'a single soap bubble with a highlight'],
];
for (const [id, title, look] of small)
  add(
    'small',
    `sprites/${id}`,
    title,
    join(STYLE, `A tiny game piece: ${look}.`, BOSS.replace('1024x1024', '512x512'), AVOID),
  );

// 5. 또롱 story pictures
const story = [
  [
    'ttorong-clue-feather',
    '흔적 · 깃털 (1~3판 뒤)',
    'The detective rabbit holds up a single black-and-white magpie feather, looking at it with a puzzled face. Soft meadow background.',
    RABBIT,
  ],
  [
    'ttorong-clue-sighting',
    '흔적 · 목격 (4~6판 뒤)',
    'Far away on a tree branch, a small black-and-white bird flies off holding something shiny. In the foreground, the rabbit and a friendly squirrel point toward it.',
    RABBIT,
  ],
  [
    'ttorong-clue-map',
    '흔적 · 발자국 (7~9판 뒤)',
    'The rabbit lays out collected feathers on the ground in a line that points toward a glowing path leading to the back pages of a giant storybook.',
    RABBIT,
  ],
  [
    'ttorong-clue-watch',
    '흔적 · 쓸쓸한 또롱 (10~12판 뒤)',
    'Ttorong peeks shyly from behind a big storybook page, watching the rabbit and friends celebrate. It looks lonely.',
    `${RABBIT} ${TTORONG}`,
  ],
  [
    'ttorong-final-0',
    '마지막 장 0 · 하얀 마지막 장',
    'The rabbit walks along a path made of turning book pages toward the very last page of the storybook, which is almost blank, only faint pencil sketches.',
    RABBIT,
  ],
  [
    'ttorong-final-1',
    '마지막 장 1 · 깃털 길',
    'A trail of magpie feathers leads to a big twig nest on the edge of the last page. The rabbit follows it with a magnifying glass.',
    RABBIT,
  ],
  [
    'ttorong-final-2',
    '마지막 장 2 · 반짝이 둥지',
    'The nest is filled with little shiny things (buttons, foil, a spoon, a marble, ribbons), glowing softly on the dim page. The rabbit steps closer carefully. Ttorong is not visible yet.',
    RABBIT,
  ],
  [
    'ttorong-final-3',
    '마지막 장 3 · 또롱의 이야기 (게임판)',
    "The full picture of Ttorong's own story: Ttorong sits alone on the last page holding a small wrapped gift, waiting for a reader, surrounded by gentle sketch lines turning into color. Ttorong in the center, large and clear. This is also a play board: high detail across the whole image.",
    TTORONG,
  ],
  [
    'ttorong-final-4',
    '마지막 장 4 · 목수건 선물',
    'Ttorong gives the shiny collection back to the rabbit, and the rabbit gently offers Ttorong a teal neckerchief.',
    `${RABBIT} ${TTORONG}`,
  ],
  [
    'ttorong-final-5',
    '마지막 장 5 · 새 짝꿍',
    'Ttorong wearing a teal neckerchief, laughing, flying above the rabbit and friends from twelve fairy tales who are waving together.',
    `${RABBIT} ${TTORONG}`,
  ],
  [
    'ending-morning-v5',
    '엔딩 · 아침',
    "Morning in a cozy child's bedroom. An open storybook on the bed shows the rabbit and a black-and-white magpie together on the last page. On the pillow lies a small black-and-white feather next to a toy magnifying glass. Soft sunlight, no child's face visible, only a small hand reaching for the feather.",
    '',
  ],
];
for (const [id, title, scene, cast] of story)
  add('story', `story/${id}`, title, join(STYLE, cast, scene, STORY_CUT, AVOID));

// 6. Stickers
const stickers = [
  ['race', 'a tortoise shell with a tiny ribbon'],
  ['duck', 'a yellow rain boot'],
  ['pigs', 'a small brick with a heart'],
  ['redhood', 'a loaf of bread in a basket'],
  ['beans', 'a little brass bell'],
  ['ant', 'a grain of wheat and a tiny fiddle'],
  ['lion', 'a small mouse with a big smile'],
  ['fox', 'a bunch of grapes'],
  ['wind', 'a hat with a ribbon'],
  ['ax', 'a shiny golden axe'],
  ['piper', 'a flute with music notes'],
  ['troy', 'a wooden duck on wheels'],
];
for (const [id, look] of stickers)
  add(
    'stickers',
    `stickers/sticker-${id}`,
    `스티커 · ${id}`,
    join(
      STYLE,
      `A cute die-cut sticker with a thick white border, flat colors, simple icon of ${look}, isolated on a plain white background. Square image, 512x512.`,
      AVOID,
    ),
  );

const sections = {
  boards: ['1. 게임판 배경', '넣으면 바로 게임에 나와요. 크기 1536×1024 이상, 가로 3:2.'],
  story: [
    '2. 또롱 스토리 그림',
    '넣으면 바로 게임에 나와요. `ttorong-final-3`은 마지막 장의 게임판이기도 해요.',
  ],
  bosses: [
    '3. 보스 (판마다 4장)',
    '넣어 주시면 Claude가 게임에 연결해요. **배경을 투명하게** (또는 흰 배경으로 뽑은 뒤 배경 제거).',
  ],
  sprites: ['4. 토끼 · 또롱 캐릭터', '넣어 주시면 Claude가 게임에 연결해요. **배경을 투명하게.**'],
  small: [
    '5. 졸병 · 탄',
    '넣어 주시면 Claude가 게임에 연결해요. **배경을 투명하게.** 작게 쓰여서 512×512면 충분해요.',
  ],
  stickers: ['6. 스티커', '넣어 주시면 Claude가 게임에 연결해요. **배경을 투명하게.**'],
};

const done = items.filter(i => exists(i.file)).length;
let md = `# v5 AI 그림 프롬프트 — 한 장에 하나씩

**만드는 법**: 각 그림 아래 회색 상자 안의 글을 **통째로 복사**해서 이미지 생성기(ChatGPT 등)에 붙여 넣으세요. 다른 걸 덧붙일 필요 없어요.
토끼가 나오는 그림은 기존 그림(\`assets/detective/race.png\`)을, 보스의 2~4번째 상태는 먼저 만든 "평소" 그림을 **참조 이미지로 함께 올리면** 캐릭터가 한결같아요.
만든 그림은 제목 아래 적힌 **저장 위치와 이름**으로 저장하세요 (\`assets/v5/…\`, png·jpg·webp 모두 가능).

**진행: ${done} / ${items.length}장 완료** — ✅ 완료 · ⬜ 아직. 이 문서는 \`node scripts/art-prompts.mjs\`로 다시 만들면 완료 표시가 자동으로 갱신돼요.

추천 순서: 게임판 배경 → 4판 빵 바구니 보스 4장 → 토끼 → 또롱 스토리 → 나머지 보스 → 졸병·탄 → 스티커.

`;
for (const [key, [title, help]] of Object.entries(sections)) {
  const list = items.filter(i => i.section === key);
  const n = list.filter(i => exists(i.file)).length;
  md += `\n---\n\n## ${title} — ${n} / ${list.length}\n\n${help}\n`;
  for (const i of list) {
    const ok = exists(i.file);
    md += `\n### ${ok ? '✅' : '⬜'} ${i.title}\n\n저장: \`assets/v5/${i.file}.png\`${i.note ? `  \n${ok ? '참고' : '메모'}: ${i.note}` : ''}\n\n\`\`\`text\n${i.prompt}\n\`\`\`\n`;
  }
}
fs.writeFileSync(new URL('docs/art-prompts-v5.md', root), md);
console.log(`docs/art-prompts-v5.md: ${done}/${items.length} done`);
