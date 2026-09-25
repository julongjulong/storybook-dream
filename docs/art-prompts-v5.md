# v5 AI 그림 생성 프롬프트

2026-09-25. 로드맵 P3(보스), P5(또롱 스토리), P6(고해상도 배경)에 필요한 그림을 AI 이미지 생성기로 만들기 위한 프롬프트 모음이다.
프롬프트는 영어로 쓴다(대부분의 생성기가 영어를 더 정확히 따른다). 설명과 확인 사항은 한국어다.

---

## 0. 사용법

### 도구
- 어떤 생성기든 쓸 수 있다(ChatGPT 이미지, Midjourney, Stable Diffusion 등).
- **참조 이미지 기능이 있으면 반드시 쓴다.** 토끼가 나오는 그림은 기존 `assets/detective/race.png`(6컷 시트)를 캐릭터 참조로 올린다. 화풍 일관성이 가장 크게 좋아진다.
- 한 항목당 3~4장 뽑아 아래 확인 사항에 맞는 것을 고른다.

### 공통 화풍 블록 — 모든 프롬프트 앞에 붙인다
```
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old.
```

### 토끼 탐정 고정 설명 — 토끼가 나오는 그림에 붙인다
```
The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat.
```

### 공통 제외 블록 — 네거티브 프롬프트 칸이 있으면 거기에, 없으면 끝에 "Avoid:"로 붙인다
```
text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs
```

### 파일 이름과 넣을 곳
생성한 그림은 아래 경로와 이름으로 저장하면 된다. 연결은 Claude가 한다.

| 종류 | 폴더 | 이름 예 | 크기 |
|---|---|---|---|
| 게임판 배경 | `assets/v5/boards/` | `redhood.png` | 가로 3:2, 최소 1920×1280 |
| 캐릭터·보스 스프라이트 | `assets/v5/sprites/` | `boss-redhood.png` | 정사각형, 최소 1024×1024, **투명 배경** |
| 스토리 컷 | `assets/v5/story/` | `ttorong-final-3.png` | 가로 3:2, 최소 1536×1024 |
| 스티커 | `assets/v5/stickers/` | `sticker-duck.png` | 정사각형 512 이상, 투명 배경 |

투명 배경을 직접 못 만드는 생성기는 **단색(흰색 또는 연두색 #00FF00) 배경**으로 뽑고 배경 제거 도구(remove.bg, 포토샵, Windows 그림판 3D 등)로 지운다.

---

## 1. 게임판 배경 12장 — 가장 먼저 (P6)

지금 게임판 배경은 6컷 시트의 한 칸(약 622×393)을 전체 화면으로 확대해서 흐리다. 발견 장면만 고해상도로 새로 만든다.

**게임판 전용 조건** — 모든 배경 프롬프트 끝에 붙인다:
```
Wide landscape composition, 3:2 aspect ratio, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center and is large and easy to recognize. Keep the outer 5% free of important details. A single small black-and-white magpie feather lies somewhere near the key object.
```

마지막 문장(까치 깃털)은 또롱 스토리의 단서다. 12장 모두 넣는다.

| # | 파일 | 장면 프롬프트 |
|---|---|---|
| 1 | `race.png` | A meadow race track in autumn with fallen leaves. The detective rabbit lifts a pile of leaves and reveals a whole round tortoise shell, glossy and intact, large in the center. Finish-line flags in the distance. |
| 2 | `duck.png` | A lily pond on a sunny day. Behind big lily pads, exactly one pair of yellow webbed rain boots floats like tiny boats, and two little ducklings ride in them, one in each boot. The detective rabbit peeks from a wide leaf at the shore, surprised. |
| 3 | `pigs.png` | A cheerful brick house construction site. The detective rabbit and the youngest of three pigs look together at an unfolded house blueprint drawing (simple line drawing of a house, no text). Bricks, planks and a wheelbarrow around them. |
| 4 | `redhood.png` | Grandmother's cottage garden full of flower pots. In one flower pot a small round house key stands upright like a plant label, its metal silhouette clear. The detective rabbit points at it with delight. Cottage door in the background. |
| 5 | `beans.png` | Above the clouds at the top of a giant beanstalk. A small fluffy cloud wears a little brass bell on its head like a hat. The detective rabbit stands on a broad bean leaf reaching toward it. A giant's cloud house with a round door behind. |
| 6 | `ant.png` | Inside a cozy ant winter storehouse yard. Next to baskets of grain, a small hula hoop turns out to be a round storehouse door handle with a visible mounting peg. The detective rabbit holds it up, discovering it. A grasshopper's fiddle leans nearby. |
| 7 | `lion.png` | A grassy savanna clearing with a big hammock-like rope net between two trees. The detective rabbit lifts a single large leaf and finds small round-tipped craft scissors lying closed on the ground. |
| 8 | `fox.png` | A grape vineyard with hanging purple grapes. Under the vines, a low wooden ladder lies on its side and two little birds sit on it like a bench. The detective rabbit parts the leaves and discovers it. |
| 9 | `wind.png` | A windy hillside meadow of tall wildflowers. A short, wide, soft hat ribbon is caught between flower stems, fluttering. The detective rabbit reaches for it. Sun and a round friendly cloud in the sky. |
| 10 | `ax.png` | The edge of a calm forest pond. On a mat of water plants rests a gray iron axe with a short wooden handle, rounded storybook shape, blade facing away. The detective rabbit crouches to pick it up. A gold and a silver axe glint far in the background. |
| 11 | `piper.png` | A small town square with bunting. A little mouse uses a round pipe stopper as a stand for a drumstick. The detective rabbit spots it; the mouse looks sorry and giggly. A drum and a flute nearby. |
| 12 | `troy.png` | A festival square with a big wooden duck on a wheeled cart, wide open windows on its side. Next to a cart wheel, under colorful confetti, the round wooden door handle of the duck is revealed. The detective rabbit holds it up, smiling. |

**확인 사항**
- 핵심 물건이 중앙 가까이에 크고 분명한가? (게임에서 단서 위치가 그림 중앙 부근이다)
- 토끼 귀가 정확히 두 개, 청록색 목수건, 가방 없음.
- 글자·숫자가 없는가? (설계도·간판에 가짜 글자가 잘 생긴다)
- 까치 깃털이 너무 크지 않은가? 알아볼 수는 있되 주인공이 아니어야 한다.

---

## 2. 캐릭터 스프라이트 (P1·P3)

모두 **투명 배경, 약간 위에서 본 3/4 시점, 한 장에 한 포즈**. 게임에서 작게(화면 높이의 5~8%) 보이므로 실루엣이 단순하고 윤곽선이 또렷해야 한다.

**스프라이트 공통 조건** — 캐릭터 프롬프트 끝에 붙인다:
```
Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery.
```

### 2-1. 토끼 탐정 (`rabbit-*.png`)
| 파일 | 포즈 |
|---|---|
| `rabbit-idle.png` | standing relaxed, ears up, gentle smile |
| `rabbit-walk-1.png` / `rabbit-walk-2.png` | mid-hop walking to the right, two alternating frames |
| `rabbit-draw.png` | leaning forward and tiptoeing carefully, holding a glowing golden thread behind it, focused expression |
| `rabbit-hit.png` | startled, ears flopped, tiny stars around head, not hurt |
| `rabbit-cheer.png` | jumping with both arms up, very happy |

걷기는 오른쪽 방향만 만든다. 왼쪽은 코드에서 뒤집는다.

### 2-2. 꼬마 까치 또롱 (`ttorong-*.png`)
또롱 설명 — 또롱 프롬프트마다 붙인다:
```
Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing.
```
| 파일 | 포즈 |
|---|---|
| `ttorong-peek.png` | peeking out from behind something, only half visible, curious |
| `ttorong-fly.png` | flying away quickly holding a small shiny object in its beak |
| `ttorong-shy.png` | standing, wing covering face, embarrassed |
| `ttorong-sad.png` | sitting alone, looking down |
| `ttorong-happy.png` | wings open wide, laughing |
| `ttorong-detective.png` | wearing a tiny teal neckerchief like the rabbit's, proudly saluting with a wing |

**확인 사항**: 무섭거나 교활해 보이면 안 된다. 여섯 장에서 같은 새로 보여야 한다(목에 단추 목걸이가 식별점).

---

## 3. 보스 12종 (P3)

각 보스는 **4장**: 평소(`-idle`), 예고 준비(`-windup`), 공격(`-attack`), 2단계(`-phase2`). 보스는 사건 현장의 **장난감이 된 소품**이다. 얼굴은 귀엽고 장난스럽게, 위협적이지 않게.

**보스 공통 조건** — 보스 프롬프트 끝에 붙인다:
```
A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery.
```

**상태별 문구** — 보스 설명 뒤에 하나를 붙여 4장을 만든다:
- idle: `calm floating pose, slight smile`
- windup: `squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline`
- attack: `stretched and bursting with motion, mouth open in a cheerful shout, motion lines`
- phase2: `same character with a more excited expression, rosy cheeks, color slightly warmer and brighter, small sparkles around`

| 판 | 파일 접두 | 보스 설명 |
|---|---|---|
| 1 | `boss-race` | a rolling ball of autumn leaves with two little eyes peeking out |
| 2 | `boss-duck` | a lily pad with a round water bubble on top, the bubble has the face |
| 3 | `boss-pigs` | a pinwheel made of pink bricks, spinning, face in the center hub |
| 4 | `boss-redhood` | a round wicker bread basket with a checkered cloth, rolling on its side, crumbs flying |
| 5 | `boss-beans` | a small gray rain cloud holding a watering can |
| 6 | `boss-ant` | a small drum shaped like an acorn, with two drumsticks for arms |
| 7 | `boss-lion` | a bouncy ball made of tangled rope knots |
| 8 | `boss-fox` | a bunch of purple grapes with a leaf hat, each grape slightly wobbly |
| 9 | `boss-wind` | a swirling puff of wind cloud with a curly tail, cheeks puffed |
| 10 | `boss-ax` | a round spinning pond disk like a lily-pad turntable, glinting |
| 11 | `boss-piper` | a marching drum with a feather plume, little legs |
| 12 | `boss-troy` | a small wooden duck on wheels with a hinged door on its chest |

**확인 사항**: 4장이 같은 캐릭터로 보이는가? idle과 windup의 차이가 작은 크기에서도 보이는가?(예고를 몸짓으로 알리는 것이 v5 보스 설계의 핵심이다)

---

## 4. 졸병·탄 (P3)

`minion-*.png`, `shot-*.png`. 작게 쓰이므로 256×256 이상이면 충분하다. 공통 조건은 보스와 같다.

| 파일 | 설명 |
|---|---|
| `minion-wander.png` | a tiny round dust bunny with dot eyes, fluffy, pale blue |
| `minion-wander-red.png` | the same dust bunny glowing red and puffed up, exclamation-like spikes of fur |
| `minion-chaser.png` | a tiny paper boat with eyes that sails forward, pointy front |
| `minion-fuse.png` | a small warm spark shaped like a firefly, soft orange glow, friendly face |
| `minion-patrol.png` | a little ink blot beetle that walks along edges |
| `shot-crumb.png` | a single round bread crumb, golden |
| `shot-raindrop.png` | a single fat cartoon raindrop |
| `shot-note.png` | a single round music note |
| `shot-grape.png` | a single purple grape with a tiny highlight |
| `shot-leaf.png` | a single small green leaf spinning |
| `shot-bubble.png` | a single soap bubble with a highlight |

---

## 5. 또롱 스토리 컷 (P5)

형식은 기존 사건 컷과 같다: 가로 3:2 한 장씩(6컷 시트가 아니라 **한 컷씩 따로** 생성).
공통 화풍 + 토끼 고정 설명 + 또롱 설명을 붙인다. 컷 안에 글자 없음.

### 5-1. 사건 사이에 끼우는 단서 컷
| 파일 | 들어갈 곳 | 장면 |
|---|---|---|
| `ttorong-clue-feather.png` | 1~3판 해결 뒤 | The detective rabbit holds up a single black-and-white magpie feather, looking at it with a puzzled face. Soft meadow background. |
| `ttorong-clue-sighting.png` | 4~6판 해결 뒤 | Far away on a tree branch, a small black-and-white bird flies off holding something shiny. In the foreground, the rabbit and a friendly squirrel point toward it. |
| `ttorong-clue-map.png` | 7~9판 해결 뒤 | The rabbit lays out collected feathers on the ground in a line that points toward a glowing path leading to the back pages of a giant storybook. |
| `ttorong-clue-watch.png` | 10~12판 해결 뒤 | Ttorong peeks shyly from behind a big storybook page, watching the rabbit and friends celebrate. It looks lonely. |

### 5-2. 최종장 "마지막 장의 둥지" 6컷
| 파일 | 장면 |
|---|---|
| `ttorong-final-0.png` | The rabbit walks along a path made of turning book pages toward the very last page of the storybook, which is almost blank, only faint pencil sketches. |
| `ttorong-final-1.png` | A trail of magpie feathers leads to a big twig nest on the edge of the last page. The rabbit follows it with a magnifying glass. |
| `ttorong-final-2.png` | The nest is filled with little shiny things (buttons, foil, a spoon, a marble, ribbons), glowing softly in the dim page. The rabbit steps closer carefully. Ttorong is not visible yet. |
| `ttorong-final-3.png` (게임판, 1920×1280 이상) | The full picture of Ttorong's own story: Ttorong sits alone on the last page holding a small wrapped gift, waiting for a reader, surrounded by gentle sketch lines turning into color. Ttorong in the center, large and clear. |
| `ttorong-final-4.png` | Ttorong gives the shiny collection back to the rabbit, and the rabbit gently offers Ttorong a teal neckerchief. |
| `ttorong-final-5.png` | Ttorong wearing the teal neckerchief, laughing, flying above the rabbit and friends from all twelve stories who are waving together. |

### 5-3. 엔딩 교체 1컷
| 파일 | 장면 |
|---|---|
| `ending-morning-v5.png` | Morning in a cozy child's bedroom. An open storybook on the bed shows the rabbit and the magpie together on the last page. On the pillow lies a small black-and-white feather next to a toy magnifying glass. Soft sunlight, no child's face visible, only a small hand reaching for the feather. |

---

## 6. 사건 수첩 스티커 12장 (P4)

`sticker-<사건ID>.png`. 판마다 숨은 스티커 하나. 흰 테두리가 있는 다이컷 스티커 모양.
```
A cute die-cut sticker with a thick white border, flat colors, simple icon of [대상], isolated on plain white background.
```
| 사건 | [대상] |
|---|---|
| race | a tortoise shell with a tiny ribbon |
| duck | a yellow rain boot |
| pigs | a small brick with a heart |
| redhood | a loaf of bread in a basket |
| beans | a little brass bell |
| ant | a grain of wheat and a tiny fiddle |
| lion | a small mouse with a big smile |
| fox | a bunch of grapes |
| wind | a hat with a ribbon |
| ax | a shiny golden axe as a paperweight |
| piper | a flute with music notes |
| troy | a wooden duck on wheels |

---

## 7. 만드는 순서 (추천)

1. **게임판 배경 1장**(4판 `redhood.png`)과 **보스 4장**(`boss-redhood-*`) → 4판 버티컬 슬라이스에 먼저 쓴다.
2. 토끼 스프라이트 → 조작감(P1) 완성 후 적용.
3. 나머지 배경 11장, 보스 44장.
4. 또롱 캐릭터 → 단서 컷 → 최종장.
5. 졸병·탄, 스티커.

만든 그림은 폴더에 넣고 알려 주면, 크기 확인·배경 제거 확인·게임 연결을 Claude가 진행한다.
