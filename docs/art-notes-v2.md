# 그림책 장면 v2 — 아트 제작·검수 기록

에이미 · 2026-09-14 · built-in ImageGen 사용

11장 모두 개별 생성했으며 직접 시각 검수했습니다. 원본 1536×1024 PNG는 `assets/story/`에 보존합니다. 기존 8장의 복원 그림은 수정하지 않았습니다. JPG 최적화와 `STORY_ART` 연결은 메인 담당이 수행합니다.

## 시각 검수

- 오프닝 침실: 아이가 피자 배달 거북이 책그림을 가리키고 양옆 부모가 웃음. 검은 단발·노란 별 머리핀·연보라 잠옷이 명확함.
- 꿈 입장: 동일한 아이가 넓은 책길 위에서 반짝 책갈피를 따라감. 초안에 등장한 부모는 삭제 수정하여 꿈의 단독 모험 흐름을 맞춤.
- 아침 엔딩: 동일한 침실·가족이 햇살 속에서 복원된 책과 거북이/피자 그림 쿠폰을 함께 봄. 실제 글자는 없음.
- 경주 반전: 피자 상자 든 거북이, 잠든 토끼, 굴러가는 결승 리본이 복원 장면과 뚜렷하게 대비됨.
- 신데렐라 반전: 호박마차 내부의 구두·양말 진열대와 지붕 확성기. 기존 소품 중심 복원 그림과 연결됨.
- 오리 반전: 튜브 역기를 든 튼튼한 회색 아기 새와 운동 매트. 연못 체육관이라는 농담이 분명함.
- 돼지 반전: 같은 세 형제·늑대·들판, 집은 투명한 딸기 젤리 벽돌. 파괴나 위험 장면 없음.
- 빨간 모자 반전: 기존과 같은 빨간 모자 인물·숲·집, 발 달린 바구니와 빙글 도는 빵가루 길.
- 콩나무 반전: 기존 잭·콩잎·성 구도, 표정 있는 구름들이 줄을 서고 물뿌리개가 비눗방울을 뿌림.
- 잠자는 공주 반전: 기존 공주·방·분홍 의상, 잠자는 의자와 컵, 숫자 없는 시계와 별무늬 베개.
- 백설공주 반전: 기존 식탁의 빈 접시, 일곱 모자·빨간 리본, 거울 앞에 줄 선 발 달린 사과들이 간식 지연을 표현함.

모든 그림은 가로 3:2 단일 장면, 따뜻한 구아슈 질감이며 텍스트·UI·콜라주·성인 요소·공포 장면이 없습니다. 그림만으로 각 반전 소품을 알아볼 수 있음을 확인했습니다.

## 생성 조정

신데렐라·백설공주의 인물 중심 출력은 안전 필터에서 거절되어(`other`), 기존 복원 그림과 같은 소품 중심 장면으로 새롭게 구성했습니다. 임의 CLI/API 우회는 사용하지 않았습니다. 꿈 입장 초안은 부모가 함께 나오는 기획 불일치를 발견해 부모만 제거하는 단일 수정 후 다시 검수했습니다.

## 최종 파일과 프롬프트

기본 확정 브리프는 `docs/art-brief-v2.md`입니다. 기존 배경을 참조한 요청은 해당 원본을 스타일·인물·소품 참고로 지정했고, 새로운 반전 장면임을 명시했습니다.

### opening-bedroom

최종 파일: `assets/story/opening-bedroom.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-cae85785-73d4-4ae1-8511-2b0f511b41af.png`

최종 요청:

A warm intimate bedtime picture-book scene in a cozy child's bedroom. A seven-year-old East Asian girl with a black bob haircut and a tiny yellow star hair clip wears lilac long-sleeve pajamas and yellow socks, sitting comfortably in bed beneath a soft quilt. Her mother with shoulder-length dark brown hair in a mint top and father with short black hair in a peach top sit close on either side, sharing a large open illustrated fairy-tale book. The girl points at a tiny clearly visible illustration of a turtle carrying a pizza box, her eyebrows raised in amused surprise; both parents smile warmly as if telling a playful joke. Small bedside lamp, paper stars and moonlit window, affection expressed through relaxed closeness. Book contains pictures only, absolutely no writing. Main family and open book centrally composed. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, warm amber and lavender palette, gentle cinematic lighting, horizontal 3:2, single full-bleed scene. No text, numbers, letters, dialogue balloons, logos, UI, borders, copied franchise characters or frightening content.

### opening-dream

최종 파일: `assets/story/opening-dream.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-75d6fa32-f8b0-4c6d-ba54-e38199ae4580.png`

최종 요청:

Edit this image only as follows: remove both adult parents from the upper-left area and replace that area naturally with matching lavender dream clouds, soft forest and open sky. The dream story shows ONLY the child and the friendly bookmark entering the magical book. Keep the girl's exact face, star hair clip, black bob, purple pajamas, pose, full body, and every other story prop unchanged. Keep the book, all eight tale motifs, landscape3:2 composition, gouache texture and friendly mood unchanged. No people other than the single girl, no text.

### ending-morning

최종 파일: `assets/story/ending-morning.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-49205b00-8653-4a44-af71-d320c32d1541.png`

최종 요청:

Warm morning in the exact same cozy child's bedroom as the bedtime scene. The same seven-year-old East Asian girl with a black bob, small yellow star hair clip, lilac pajamas and yellow socks sits safely on her bed with her mint-clad mother and peach-clad father close beside her. Soft golden sunlight enters the window. They laugh gently together over an open picture book that visibly shows a little turtle walking along a race path and a pumpkin carriage near a castle, restored normal fairy-tale illustrations with no writing. The girl holds up a small cream bookmark coupon bearing only a cute turtle and a pizza-slice drawing, absolutely no text; parents notice it with affectionate amused surprise. A tender sense that the child's effort mattered, cozy family closeness, no tears required. Central family, book and coupon clearly readable. Consistent original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, sunshine cream and gentle lilac palette, horizontal 3:2, single full-bleed scene. No text, numbers, letters, dialogue balloons, logos, UI, borders, copied franchise characters or frightening content.

### race-twist

최종 파일: `assets/story/race-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-3b2bc6e1-aa4d-4b41-8da3-8587f01972df.png`

최종 요청:

Funny scrambled Rabbit and Turtle fairy tale in the same sunlit woodland meadow as the existing restored race illustration. A cheerful little turtle wears a harmless delivery satchel and balances a closed pizza box with only a pizza picture, looking puzzled as a loose finish-line ribbon rolled into a friendly round wheel bounces away in front of it. Nearby a rabbit peacefully naps under a leafy tree with a plain blank toy medal beside it. No race urgency or threatening chase; the turtle seems to ask the runaway finish line for directions. Central turtle, ribbon and pizza box are clearly readable. Match existing restored illustration's animals and palette. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, pastel mint and sunshine yellow, horizontal 3:2, single full-bleed scene. No text, numbers, letters, dialogue balloons, logos, UI, borders or frightening content.

### cinderella-twist

최종 파일: `assets/story/cinderella-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-e600cea8-4dc4-49d0-b36d-f00ef01fb359.png`

최종 요청:

Use this input as a reference for the carriage, garden, palette and hand-painted gouache illustration style. Create one new 1536x1024 full scene: the orange Cinderella pumpkin carriage has become a funny traveling shoe shop. Its side is wide open with three glass-slipper display shelves and colorful socks on tiny hangers. A toy megaphone sits on the roof. The friendly curved wheels are mismatched sizes and slightly tilted playfully. The same twilight garden and little warmly lit castle stand behind. A small snack basket on a nearby stool shows the family has prepared a kind send-off. No people. Clearly humorous wrong function, no danger. No text, sale labels, writing, logos, UI or frames. Keep the composition centered and visually readable like the original.

### duck-twist

최종 파일: `assets/story/duck-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-602552b9-3daa-40b7-9078-d9f881e4b10b.png`

최종 요청:

Funny scrambled Ugly Duckling fairy tale at a sunny turquoise lily pond turned into a friendly exercise club. A confident cute young gray duckling has comically strong rounded wings and proudly lifts a very light playful barbell made from a reed stem connecting two colorful swimming rings. Nearby little ducks cheer and copy gentle exercise poses while a free-standing animated reed-and-swim-ring barbell bounces by. A few broad floating exercise mats cover part of the water, explaining why the duckling is searching for a swimming spot. Strength and every body shape are celebrated, never mocked; humor comes from an entire pond acting like a gym. Match existing restored duck artwork's pond and visual style. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, pastel turquoise and warm pink lilies, horizontal 3:2, single full-bleed scene. No text, letters, numbers, dialogue balloons, logos, UI, borders, realistic bodybuilding anatomy or frightening content.

### pigs-twist

최종 파일: `assets/story/pigs-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-729b89a5-27a0-4f34-bf45-27d5cd4a328c.png`

최종 요청:

Funny scrambled Three Little Pigs fairy tale in the same sunny green meadow as the existing restored pigs illustration. Three friendly little pigs look in amused astonishment at their little cottage built of translucent strawberry-jelly bricks, the entire soft rounded cottage gently bouncing just above its safe grassy foundation with a few squash-and-stretch jelly cubes below. A gentle cartoon wolf sits safely on a nearby garden bench looking comically dizzy, holding a small cup of water, not threatening anyone. No collapse, dangerous debris or distress. A smiling jelly-brick stack bounces at center foreground. Match the existing pigs, wolf and cottage proportions. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, pastel strawberry coral and grass green, horizontal 3:2, single full-bleed scene. No text, letters, numbers, dialogue balloons, logos, UI, borders or frightening content.

### redhood-twist

최종 파일: `assets/story/redhood-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-a6564136-a277-49c5-bc0f-9aa9293ba767.png`

최종 요청:

Funny scrambled Little Red Riding Hood fairy tale on the same welcoming flower-lined forest path as the existing restored redhood illustration. The same cheerful little girl fully clothed in a red hooded cape and comfortable dress watches her wicker picnic basket walking away on two tiny round feet. The basket wears a red checked cloth, carries fresh bread, and sneezes a harmless tiny puff of bread crumbs into a silly looping trail that circles back to itself. The girl points gently toward the clearly visible cozy grandmother's cottage in the opposite direction, smiling at the mistake. Bright safe forest with sunbeams, no wolf or threat. Main basket, crumb loop and girl's gesture clearly readable. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, pastel reds and soft greens, horizontal 3:2, single full-bleed scene. No text, letters, numbers, map labels, dialogue balloons, logos, UI, borders or frightening content.

### beans-twist

최종 파일: `assets/story/beans-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-02c279b4-22ce-4790-a548-88ca8e3f643d.png`

최종 요청:

Funny scrambled Jack and the Beanstalk fairy tale high among welcoming pastel clouds. The same fully clothed child Jack stands securely in the center of an enormous broad bean leaf protected by curling vines, gazing in amused wonder at a tiny cloud-washing station: a friendly sky-blue watering can floats gently and sprays soft rainbow soap bubbles onto a smiling fluffy cloud. Other clean clouds wait in a short orderly line as if at a car wash, with no machinery or written signs. A small castle is partly hidden behind bubbles in the distance. No height peril, falling or dangerous water jet. Match the existing restored beans artwork's Jack and broad leaves. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, pastel sky blue, green and gold, horizontal 3:2, single full-bleed scene. No text, letters, numbers, dialogue balloons, logos, UI, borders or frightening content.

### sleeping-twist

최종 파일: `assets/story/sleeping-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-3a6564f8-f85e-4190-97e3-b9de2b808bcc.png`

최종 요청:

Funny scrambled Sleeping Beauty fairy tale inside the same warm rose-colored castle room as the existing restored sleeping illustration. The same young adult princess, fully clothed in a modest rose-pink day dress, is awake and gently stretching with a cheerful puzzled expression. All the furniture seems asleep: a rounded chair has closed sleepy eyes and a small blanket, a teacup dozes on the table. At center foreground a soft star-pattern pillow cuddles a round alarm clock underneath its edge, both looking comically sleepy. Clock face contains simple dots only, no numbers or letters. Open window reveals a bright rose garden. No curses, thorns, kisses or scary imagery; visual joke is furniture refusing to wake. Original hand-painted gouache children's storybook illustration, soft paper grain, rounded expressive shapes, pastel rose, cream and gold, horizontal 3:2, single full-bleed scene. No text, letters, numbers, dialogue balloons, logos, UI or borders.

### snowwhite-twist

최종 파일: `assets/story/snowwhite-twist.png`

생성 원본: `C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-3b7a09de-ea7b-4911-9dd3-aa8c6cc626d2.png`

최종 요청:

Use the input as a reference for the cozy cottage, garden, table, seven colorful hats and gouache style. Generate a NEW funny scrambled Snow White story scene: the same eight-chair picnic table is empty of snacks because the red apples have stepped off their plates to join a comical apple-shine audition line in front of a little golden hand mirror. The golden mirror has a friendly face and an apple decoration, acting like a harmless silly judge. Several cheerful red apples on tiny round feet stand in a clear queue, with a curved trail showing one apple has looped back to join it again. Seven colorful hats still hang on the cottage wall and a large red ribbon remains tied to the eighth chair. No people. The joke is that snack time is delayed by the apples themselves. A warm humorous garden afternoon; no danger. Match the input's hand-painted gouache texture and cherry red, green, warm gold colors. One standalone 1536x1024 landscape scene. No writing, scorecards, letters, numbers, labels, UI, collage or frames.


