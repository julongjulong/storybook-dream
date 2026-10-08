# v5 AI 그림 프롬프트 — 한 장에 하나씩

**만드는 법**: 각 그림 아래 회색 상자 안의 글을 **통째로 복사**해서 이미지 생성기(ChatGPT 등)에 붙여 넣으세요. 다른 걸 덧붙일 필요 없어요.
토끼가 나오는 그림은 기존 그림(`assets/detective/race.png`)을, 보스의 2~4번째 상태는 먼저 만든 "평소" 그림을 **참조 이미지로 함께 올리면** 캐릭터가 한결같아요.
만든 그림은 제목 아래 적힌 **저장 위치와 이름** 그대로 저장하세요. 배경·스토리 그림은 `assets/v5/…`, 캐릭터·탄·스티커 원본은 `assets/v5-source/…` (배경 지우기는 자동).

**진행: 60 / 105장 완료** — ✅ 완료 · ⬜ 아직. 이 문서는 `node scripts/art-prompts.mjs`로 다시 만들면 완료 표시가 자동으로 갱신돼요.

추천 순서: 게임판 배경 → 4판 빵 바구니 보스 4장 → 토끼 → 또롱 스토리 → 나머지 보스 → 졸병·탄 → 스티커.


---

## 1. 게임판 배경 — 12 / 12

`assets/v5/boards/`에 넣으면 바로 게임에 나와요. 크기 1536×1024 이상, 가로 3:2.

### ✅ 1판 토끼와 거북이

저장: `assets/v5/boards/race.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A meadow race track in autumn with fallen leaves. The detective rabbit lifts a pile of leaves and reveals a whole round tortoise shell, glossy and intact, large in the center. Finish-line flags in the distance. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 2판 아기 오리의 연못

저장: `assets/v5/boards/duck.png`  
참고: (선택) 깃털이 빠졌어요. 다시 뽑으면 깃털이 들어가게 해 주세요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A lily pond on a sunny day. Behind big lily pads, exactly one pair of yellow webbed rain boots floats like tiny boats, and two little ducklings ride in them, one in each boot. The detective rabbit peeks from a wide leaf at the shore, surprised. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 3판 아기 돼지 삼 형제

저장: `assets/v5/boards/pigs.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A cheerful brick house construction site. The detective rabbit and the youngest of three pigs look together at an unfolded house blueprint drawing (simple line drawing of a house, no text). Bricks, planks and a wheelbarrow around them. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 4판 빨간 모자의 심부름

저장: `assets/v5/boards/redhood.png`  
참고: 지난번 4번 그림은 돼지 삼 형제가 다시 나왔어요. 빨간 모자 장면이 필요해요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Grandmother's cottage garden full of flower pots. In one flower pot in the center of the picture, a small round house key stands upright like a plant label, its metal silhouette clear. The detective rabbit points at it with delight. The cottage door is in the background. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 5판 잭과 콩나무

저장: `assets/v5/boards/beans.png`  
참고: (선택) 지금 그림은 종이 맨 위에 있어요. 다시 뽑으면 종을 가운데로.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Above the clouds at the top of a giant beanstalk. In the center of the picture, a small fluffy cloud wears a little brass bell on its head like a hat. The detective rabbit stands on a broad bean leaf reaching toward it. A giant's cloud house with a round door in the background. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 6판 개미와 베짱이

저장: `assets/v5/boards/ant.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Inside a cozy ant winter storehouse yard. Next to baskets of grain, a small hula hoop turns out to be a round storehouse door handle with a visible mounting peg. The detective rabbit holds it up, discovering it. A grasshopper's fiddle leans nearby. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 7판 사자와 생쥐

저장: `assets/v5/boards/lion.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A grassy savanna clearing with a big hammock-like rope net between two trees. The detective rabbit lifts a single large leaf and finds small round-tipped craft scissors lying closed on the ground. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 8판 여우와 포도

저장: `assets/v5/boards/fox.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A grape vineyard with hanging purple grapes. Under the vines, a low wooden ladder lies on its side and two little birds sit on it like a bench. The detective rabbit parts the leaves and discovers it. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 9판 해와 바람

저장: `assets/v5/boards/wind.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A windy hillside meadow of tall wildflowers. A short, wide, soft hat ribbon is caught between flower stems, fluttering. The detective rabbit reaches for it. Sun and a round friendly cloud in the sky. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 10판 금도끼 은도끼

저장: `assets/v5/boards/ax.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. The edge of a calm forest pond. On a mat of water plants rests a gray iron axe with a short wooden handle, rounded storybook shape, blade facing away. The detective rabbit crouches to pick it up. A gold and a silver axe glint far in the background. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 11판 피리 부는 사나이

저장: `assets/v5/boards/piper.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A small town square with bunting. A little mouse uses a round pipe stopper as a stand for a drumstick. The detective rabbit spots it; the mouse looks sorry and giggly. A drum and a flute nearby. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 12판 트로이의 오리

저장: `assets/v5/boards/troy.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A festival square with a big wooden duck on a wheeled cart, wide open windows on its side. Next to a cart wheel, under colorful confetti, the round wooden door handle of the duck is revealed. The detective rabbit holds it up, smiling. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger, high detail across the whole image because the player uncovers it piece by piece. The key object sits clearly near the center of the picture and is large and easy to recognize. Keep the outer 5% free of important details. IMPORTANT: one small black-and-white magpie feather lies on the ground near the key object. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

---

## 2. 또롱 스토리 그림 — 1 / 11

`assets/v5/story/`에 넣으면 바로 게임에 나와요. `ttorong-final-3`은 마지막 장의 게임판이기도 해요.

### ✅ 흔적 · 깃털 (1~3판 뒤)

저장: `assets/v5/story/ttorong-clue-feather.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. The detective rabbit holds up a single black-and-white magpie feather, looking at it with a puzzled face. Soft meadow background. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 흔적 · 목격 (4~6판 뒤)

저장: `assets/v5/story/ttorong-clue-sighting.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Far away on a tree branch, a small black-and-white bird flies off holding something shiny. In the foreground, the rabbit and a friendly squirrel point toward it. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 흔적 · 발자국 (7~9판 뒤)

저장: `assets/v5/story/ttorong-clue-map.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. The rabbit lays out collected feathers on the ground in a line that points toward a glowing path leading to the back pages of a giant storybook. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 흔적 · 쓸쓸한 또롱 (10~12판 뒤)

저장: `assets/v5/story/ttorong-clue-watch.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Ttorong peeks shyly from behind a big storybook page, watching the rabbit and friends celebrate. It looks lonely. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 마지막 장 0 · 하얀 마지막 장

저장: `assets/v5/story/ttorong-final-0.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. The rabbit walks along a path made of turning book pages toward the very last page of the storybook, which is almost blank, only faint pencil sketches. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 마지막 장 1 · 깃털 길

저장: `assets/v5/story/ttorong-final-1.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. A trail of magpie feathers leads to a big twig nest on the edge of the last page. The rabbit follows it with a magnifying glass. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 마지막 장 2 · 반짝이 둥지

저장: `assets/v5/story/ttorong-final-2.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. The nest is filled with little shiny things (buttons, foil, a spoon, a marble, ribbons), glowing softly on the dim page. The rabbit steps closer carefully. Ttorong is not visible yet. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 마지막 장 3 · 또롱의 이야기 (게임판)

저장: `assets/v5/story/ttorong-final-3.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. The full picture of Ttorong's own story: Ttorong sits alone on the last page holding a small wrapped gift, waiting for a reader, surrounded by gentle sketch lines turning into color. Ttorong in the center, large and clear. This is also a play board: high detail across the whole image. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 마지막 장 4 · 목수건 선물

저장: `assets/v5/story/ttorong-final-4.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Ttorong gives the shiny collection back to the rabbit, and the rabbit gently offers Ttorong a teal neckerchief. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 마지막 장 5 · 새 짝꿍

저장: `assets/v5/story/ttorong-final-5.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Ttorong wearing a teal neckerchief, laughing, flying above the rabbit and friends from twelve fairy tales who are waving together. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 엔딩 · 아침

저장: `assets/v5/story/ending-morning-v5.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Morning in a cozy child's bedroom. An open storybook on the bed shows the rabbit and a black-and-white magpie together on the last page. On the pillow lies a small black-and-white feather next to a toy magnifying glass. Soft sunlight, no child's face visible, only a small hand reaching for the feather. Wide landscape composition, 3:2 aspect ratio, 1536x1024 or larger. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

---

## 3. 보스 (판마다 4장) — 24 / 48

원본을 `assets/v5-source/…`에 저장하고 알려 주세요. **배경은 흰색·종이색이어도 돼요** — 배경 지우기와 크기 줄이기는 자동으로 해요.

### ✅ 1판 낙엽 뭉치 · 평소

저장: `assets/v5-source/sprites/boss-race-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a rolling ball of autumn leaves with two little eyes peeking out. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 1판 낙엽 뭉치 · 예고 준비

저장: `assets/v5-source/sprites/boss-race-windup.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a rolling ball of autumn leaves with two little eyes peeking out. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 1판 낙엽 뭉치 · 공격

저장: `assets/v5-source/sprites/boss-race-attack.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a rolling ball of autumn leaves with two little eyes peeking out. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 1판 낙엽 뭉치 · 2단계

저장: `assets/v5-source/sprites/boss-race-phase2.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a rolling ball of autumn leaves with two little eyes peeking out. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 2판 수련 방울 · 평소

저장: `assets/v5-source/sprites/boss-duck-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a lily pad with a round water bubble on top, the bubble has the face. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 2판 수련 방울 · 예고 준비

저장: `assets/v5-source/sprites/boss-duck-windup.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a lily pad with a round water bubble on top, the bubble has the face. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 2판 수련 방울 · 공격

저장: `assets/v5-source/sprites/boss-duck-attack.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a lily pad with a round water bubble on top, the bubble has the face. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 2판 수련 방울 · 2단계

저장: `assets/v5-source/sprites/boss-duck-phase2.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a lily pad with a round water bubble on top, the bubble has the face. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 3판 벽돌 바람개비 · 평소

저장: `assets/v5-source/sprites/boss-pigs-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a pinwheel made of pink bricks, face in the center hub. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 3판 벽돌 바람개비 · 예고 준비

저장: `assets/v5-source/sprites/boss-pigs-windup.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a pinwheel made of pink bricks, face in the center hub. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 3판 벽돌 바람개비 · 공격

저장: `assets/v5-source/sprites/boss-pigs-attack.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a pinwheel made of pink bricks, face in the center hub. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 3판 벽돌 바람개비 · 2단계

저장: `assets/v5-source/sprites/boss-pigs-phase2.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a pinwheel made of pink bricks, face in the center hub. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 4판 빵 바구니 · 평소

저장: `assets/v5-source/sprites/boss-redhood-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round wicker bread basket with a checkered cloth, rolling on its side, crumbs flying. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 4판 빵 바구니 · 예고 준비

저장: `assets/v5-source/sprites/boss-redhood-windup.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round wicker bread basket with a checkered cloth, rolling on its side, crumbs flying. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 4판 빵 바구니 · 공격

저장: `assets/v5-source/sprites/boss-redhood-attack.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round wicker bread basket with a checkered cloth, rolling on its side, crumbs flying. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 4판 빵 바구니 · 2단계

저장: `assets/v5-source/sprites/boss-redhood-phase2.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round wicker bread basket with a checkered cloth, rolling on its side, crumbs flying. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 5판 구름 물뿌리개 · 평소

저장: `assets/v5-source/sprites/boss-beans-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small gray rain cloud holding a watering can. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 5판 구름 물뿌리개 · 예고 준비

저장: `assets/v5-source/sprites/boss-beans-windup.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small gray rain cloud holding a watering can. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 5판 구름 물뿌리개 · 공격

저장: `assets/v5-source/sprites/boss-beans-attack.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small gray rain cloud holding a watering can. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 5판 구름 물뿌리개 · 2단계

저장: `assets/v5-source/sprites/boss-beans-phase2.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small gray rain cloud holding a watering can. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 6판 도토리 북 · 평소

저장: `assets/v5-source/sprites/boss-ant-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small drum shaped like an acorn, with two drumsticks for arms. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 6판 도토리 북 · 예고 준비

저장: `assets/v5-source/sprites/boss-ant-windup.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small drum shaped like an acorn, with two drumsticks for arms. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 6판 도토리 북 · 공격

저장: `assets/v5-source/sprites/boss-ant-attack.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small drum shaped like an acorn, with two drumsticks for arms. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 6판 도토리 북 · 2단계

저장: `assets/v5-source/sprites/boss-ant-phase2.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small drum shaped like an acorn, with two drumsticks for arms. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 7판 매듭 공 · 평소

저장: `assets/v5-source/sprites/boss-lion-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bouncy ball made of tangled rope knots. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 7판 매듭 공 · 예고 준비

저장: `assets/v5-source/sprites/boss-lion-windup.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bouncy ball made of tangled rope knots. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 7판 매듭 공 · 공격

저장: `assets/v5-source/sprites/boss-lion-attack.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bouncy ball made of tangled rope knots. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 7판 매듭 공 · 2단계

저장: `assets/v5-source/sprites/boss-lion-phase2.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bouncy ball made of tangled rope knots. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 8판 포도 방울 · 평소

저장: `assets/v5-source/sprites/boss-fox-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bunch of purple grapes with a leaf hat, each grape slightly wobbly. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 8판 포도 방울 · 예고 준비

저장: `assets/v5-source/sprites/boss-fox-windup.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bunch of purple grapes with a leaf hat, each grape slightly wobbly. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 8판 포도 방울 · 공격

저장: `assets/v5-source/sprites/boss-fox-attack.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bunch of purple grapes with a leaf hat, each grape slightly wobbly. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 8판 포도 방울 · 2단계

저장: `assets/v5-source/sprites/boss-fox-phase2.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a bunch of purple grapes with a leaf hat, each grape slightly wobbly. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 9판 바람 구름 · 평소

저장: `assets/v5-source/sprites/boss-wind-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a swirling puff of wind cloud with a curly tail, cheeks puffed. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 9판 바람 구름 · 예고 준비

저장: `assets/v5-source/sprites/boss-wind-windup.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a swirling puff of wind cloud with a curly tail, cheeks puffed. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 9판 바람 구름 · 공격

저장: `assets/v5-source/sprites/boss-wind-attack.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a swirling puff of wind cloud with a curly tail, cheeks puffed. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 9판 바람 구름 · 2단계

저장: `assets/v5-source/sprites/boss-wind-phase2.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a swirling puff of wind cloud with a curly tail, cheeks puffed. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 10판 연못 돌림판 · 평소

저장: `assets/v5-source/sprites/boss-ax-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round spinning pond disk like a lily-pad turntable, glinting. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 10판 연못 돌림판 · 예고 준비

저장: `assets/v5-source/sprites/boss-ax-windup.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round spinning pond disk like a lily-pad turntable, glinting. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 10판 연못 돌림판 · 공격

저장: `assets/v5-source/sprites/boss-ax-attack.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round spinning pond disk like a lily-pad turntable, glinting. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 10판 연못 돌림판 · 2단계

저장: `assets/v5-source/sprites/boss-ax-phase2.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a round spinning pond disk like a lily-pad turntable, glinting. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 11판 박자 북 · 평소

저장: `assets/v5-source/sprites/boss-piper-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a marching drum with a feather plume and little legs. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 11판 박자 북 · 예고 준비

저장: `assets/v5-source/sprites/boss-piper-windup.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a marching drum with a feather plume and little legs. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 11판 박자 북 · 공격

저장: `assets/v5-source/sprites/boss-piper-attack.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a marching drum with a feather plume and little legs. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 11판 박자 북 · 2단계

저장: `assets/v5-source/sprites/boss-piper-phase2.png`  
메모: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a marching drum with a feather plume and little legs. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 12판 나무 오리 · 평소

저장: `assets/v5-source/sprites/boss-troy-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small wooden duck on wheels with a hinged door on its chest. State: calm floating pose, slight smile. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 12판 나무 오리 · 예고 준비

저장: `assets/v5-source/sprites/boss-troy-windup.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small wooden duck on wheels with a hinged door on its chest. State: squashed down and puffed up, cheeks bulging, eyes squinting, about to do something, glowing faint yellow outline. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 12판 나무 오리 · 공격

저장: `assets/v5-source/sprites/boss-troy-attack.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small wooden duck on wheels with a hinged door on its chest. State: stretched and bursting with motion, mouth open in a cheerful shout, motion lines. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 12판 나무 오리 · 2단계

저장: `assets/v5-source/sprites/boss-troy-phase2.png`  
참고: 먼저 만든 "평소" 그림을 참조 이미지로 올리면 같은 캐릭터로 나와요.

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The character: a small wooden duck on wheels with a hinged door on its chest. State: the same character with a more excited expression, rosy cheeks, colors slightly warmer and brighter, small sparkles around. Keep the same character design in all four states. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

---

## 4. 토끼 · 또롱 캐릭터 — 1 / 12

원본을 `assets/v5-source/…`에 저장하고 알려 주세요. **배경은 흰색·종이색이어도 돼요** — 배경 지우기와 크기 줄이기는 자동으로 해요.

### ✅ 토끼 · 가만히

저장: `assets/v5-source/sprites/rabbit-idle.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Pose: standing relaxed, ears up, gentle smile. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 토끼 · 걷기 1

저장: `assets/v5-source/sprites/rabbit-walk-1.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Pose: mid-hop walking to the right, front foot forward. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 토끼 · 걷기 2

저장: `assets/v5-source/sprites/rabbit-walk-2.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Pose: mid-hop walking to the right, back foot pushing off. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 토끼 · 선 긋기

저장: `assets/v5-source/sprites/rabbit-draw.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Pose: leaning forward and tiptoeing carefully, holding a glowing golden thread behind it, focused expression. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 토끼 · 맞음

저장: `assets/v5-source/sprites/rabbit-hit.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Pose: startled, ears flopped, tiny stars around head, not hurt. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 토끼 · 기뻐함

저장: `assets/v5-source/sprites/rabbit-cheer.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. The detective is a small brown rabbit with exactly two long ears and a teal neckerchief, no bag, no hat. Pose: jumping with both arms up, very happy. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 또롱 · 빼꼼

저장: `assets/v5-source/sprites/ttorong-peek.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Pose: peeking out from behind something, only half visible, curious. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 또롱 · 날아감

저장: `assets/v5-source/sprites/ttorong-fly.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Pose: flying away quickly holding a small shiny object in its beak. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 또롱 · 부끄러움

저장: `assets/v5-source/sprites/ttorong-shy.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Pose: standing, one wing covering its face, embarrassed. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 또롱 · 쓸쓸함

저장: `assets/v5-source/sprites/ttorong-sad.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Pose: sitting alone, looking down. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 또롱 · 웃음

저장: `assets/v5-source/sprites/ttorong-happy.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Pose: wings open wide, laughing. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ⬜ 또롱 · 탐정

저장: `assets/v5-source/sprites/ttorong-detective.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. Ttorong is a small round young magpie with glossy black and white feathers, a slightly too-big head, big shy eyes, short legs, and a tiny shiny button tied around its neck with string. Cute, lonely but kind, never menacing. Pose: wearing a tiny teal neckerchief like the rabbit's, proudly saluting with a wing. Single character sprite, centered, full body visible, slightly top-down three-quarter view, bold clean outline, simple shapes that read at small size, isolated on a plain white background, no shadow on the ground, no scenery. Square image, 1024x1024. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

---

## 5. 졸병 · 탄 — 10 / 10

원본을 `assets/v5-source/…`에 저장하고 알려 주세요. **배경은 흰색·종이색이어도 돼요** — 배경 지우기와 크기 줄이기는 자동으로 해요.

### ✅ 졸병 · 배회

저장: `assets/v5-source/sprites/minion-wander.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a tiny round dust bunny with dot eyes, fluffy, pale blue. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 졸병 · 빨개짐

저장: `assets/v5-source/sprites/minion-wander-red.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: the same tiny dust bunny glowing red and puffed up, spiky fur like an exclamation. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 졸병 · 추적(종이배)

저장: `assets/v5-source/sprites/minion-chaser.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a tiny paper boat with eyes that sails forward, pointy front. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 불씨

저장: `assets/v5-source/sprites/minion-fuse.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a small warm spark shaped like a firefly, soft orange glow, friendly face. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 탄 · 빵가루

저장: `assets/v5-source/sprites/shot-crumb.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a single round bread crumb, golden. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 탄 · 빗방울

저장: `assets/v5-source/sprites/shot-raindrop.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a single fat cartoon raindrop. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 탄 · 음표

저장: `assets/v5-source/sprites/shot-note.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a single round music note. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 탄 · 포도알

저장: `assets/v5-source/sprites/shot-grape.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a single purple grape with a tiny highlight. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 탄 · 나뭇잎

저장: `assets/v5-source/sprites/shot-leaf.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a single small green leaf. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 탄 · 방울

저장: `assets/v5-source/sprites/shot-bubble.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A tiny game piece: a single soap bubble with a highlight. A living storybook prop character, playful and mischievous but friendly, big simple cartoon eyes, round chunky shape, bold clean outline, reads clearly at small size, isolated on a plain white background, no scenery. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

---

## 6. 스티커 — 12 / 12

원본을 `assets/v5-source/…`에 저장하고 알려 주세요. **배경은 흰색·종이색이어도 돼요** — 배경 지우기와 크기 줄이기는 자동으로 해요.

### ✅ 스티커 · race

저장: `assets/v5-source/stickers/sticker-race.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a tortoise shell with a tiny ribbon, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · duck

저장: `assets/v5-source/stickers/sticker-duck.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a yellow rain boot, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · pigs

저장: `assets/v5-source/stickers/sticker-pigs.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a small brick with a heart, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · redhood

저장: `assets/v5-source/stickers/sticker-redhood.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a loaf of bread in a basket, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · beans

저장: `assets/v5-source/stickers/sticker-beans.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a little brass bell, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · ant

저장: `assets/v5-source/stickers/sticker-ant.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a grain of wheat and a tiny fiddle, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · lion

저장: `assets/v5-source/stickers/sticker-lion.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a small mouse with a big smile, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · fox

저장: `assets/v5-source/stickers/sticker-fox.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a bunch of grapes, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · wind

저장: `assets/v5-source/stickers/sticker-wind.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a hat with a ribbon, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · ax

저장: `assets/v5-source/stickers/sticker-ax.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a shiny golden axe, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · piper

저장: `assets/v5-source/stickers/sticker-piper.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a flute with music notes, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```

### ✅ 스티커 · troy

저장: `assets/v5-source/stickers/sticker-troy.png`

```text
Children's picture book illustration, warm gouache painting on soft textured paper, rounded friendly characters, gentle cool color fields with warm highlights, clear readable silhouettes, soft even lighting, cozy and safe mood, for a 7-year-old. A cute die-cut sticker with a thick white border, flat colors, simple icon of a wooden duck on wheels, isolated on a plain white background. Square image, 512x512. Avoid: text, letters, numbers, speech bubbles, logo, watermark, UI, frame border, panel grid, scary, sharp teeth, weapons pointed at anyone, injury, dark horror lighting, photorealistic, 3D render, extra ears, extra limbs.
```
