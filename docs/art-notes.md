# 동화 배경 아트 제작·검수

에이미 · 2026-09-14 · built-in ImageGen 사용

8개 복원 장면을 개별 생성했습니다. 모든 최종 원본은 `assets/<stage-id>.png`, 1536×1024 (3:2)이며 원본을 보존합니다. 인게임용 JPEG 재인코딩과 data URL 묶기는 메인 담당이 수행합니다.

## 검수 결과

- 8장 모두 직접 이미지 확인: 성인 요소·무서운 장면·텍스트·UI·콜라주 없음.
- 따뜻한 구아슈 질감, 둥근 동화책 실루엣, 가로 3:2로 통일. 중앙 핵심 주제가 게임판에 들어감.
- 토끼와 거북이: 깨어난 토끼와 결승선 앞 거북이, 피자 없이 경주 복원.
- 신데렐라: 호박마차와 유리구두가 무도회 출발을 기다리는 장면. 등장인물 대신 대표 소품으로 준비 분위기 표현.
- 미운 아기 오리: 백조 세 마리의 연못과 물풀 고리. 몸을 잘못으로 표현하지 않음.
- 아기 돼지: 튼튼한 벽돌집과 세 형제, 벤치에서 쉬는 늑대.
- 빨간 모자: 할머니에게 바구니를 건네는 안전하고 밝은 숲길.
- 잭과 콩나무: 넓은 잎 위의 잭과 구름 속 성, 황금 알.
- 잠자는 숲속의 공주: 아침 창문을 여는 공주와 장미 정원.
- 백설공주: 사과 간식이 놓인 소풍 식탁과 일곱 개의 모자, 거울. 친구들이 함께 나눌 준비를 상징 소품으로 표현.

## 생성 조정 내역

신데렐라와 백설공주의 초기 인물 중심 출력은 생성 도구 안전 필터에서 거절되었습니다(구체 분류 `other`). 새 구도는 인물 없이 마차·구두, 사과 소풍·일곱 모자로 변경했고 정상 생성됐습니다. 메인 기획자가 이 구도를 승인했습니다. CLI/API 우회는 사용하지 않았습니다.

## 최종 프롬프트와 원본 경로

### race

파일: `assets/race.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-37f1d93b-1c1c-4024-baa2-0d7cad47910c.png by default.

Use case: illustration-story. Asset type: restored scene background for a gentle children's territory-capture game. Generate ONE standalone 1536x1024 landscape picture. Restored Rabbit and Turtle fairy tale moment. A cheerful small turtle steadily approaches a plain ribbon finish line on a curving woodland path, a friendly rabbit wakes beneath a leafy tree nearby, tiny woodland friends gently cheer. Turtle has no pizza. Warm morning meadow, pastel mint and sunshine yellow, clear spacious composition with main figures near center. Whimsical hand-painted gouache storybook illustration for a seven-year-old child, soft paper grain, rounded expressive shapes, bright reassuring tone. Horizontal 3:2 image, no text, letters, logos, frames, user interface, frightening imagery, or weapons. Keep important content in central 70%; hand-painted matte gouache, simple rounded silhouettes, soft colored outlines. No collage or panel layout.

### cinderella

파일: `assets/cinderella.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-10ef245c-7d81-4100-847a-2f74516e99e5.png by default.

Use case: illustration-story. Create one 1536x1024 horizontal hand-painted matte gouache children's fairy tale background for Cinderella. A beautiful round orange pumpkin carriage is parked in the center of a peaceful twilight garden, its door invitingly open. A pair of sparkling glass slippers rests on a small velvet footstool beside the carriage. A friendly little castle with warmly glowing windows stands beyond the garden path. No people. Pastel lavender and peach with warm amber light, rounded storybook shapes, soft paper grain, reassuring and magical, same traditional gouache children's book appearance as a warm woodland fairy tale picture. Keep carriage and slippers in central 70 percent with breathing room. No lettering, logos, borders, UI, collage or panels.

### duck

파일: `assets/duck.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-dbf46d3e-2148-4de6-a7ff-a7169b865783.png by default.

Use case: illustration-story. Asset type: restored scene background for a gentle children's territory-capture game. Generate ONE standalone 1536x1024 landscape picture. Restored Ugly Duckling fairy tale moment, belonging and friendship. A confident elegant young white swan with gently strong wings happily swims together with two friendly swans in a tranquil lily pond, small ducks smile from a grassy bank. A tiny harmless ring made of water reeds rests near the bank as an exercise keepsake. Pastel turquoise water, warm pink lilies, sunlit reeds, central swans reflected softly. Whimsical hand-painted gouache storybook illustration for a seven-year-old child, soft paper grain, rounded expressive shapes, bright reassuring tone. Horizontal 3:2 image, no text, letters, logos, frames, user interface, frightening imagery, or weapons. Keep important content in central 70%; hand-painted matte gouache, simple rounded silhouettes, soft colored outlines. No collage or panel layout.

### pigs

파일: `assets/pigs.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-12ec694c-1382-4474-b8e0-995344bcc8c0.png by default.

Use case: illustration-story. Asset type: restored scene background for a gentle children's territory-capture game. Generate ONE standalone 1536x1024 landscape picture. Restored Three Little Pigs fairy tale moment of teamwork. Three friendly little pigs finish a cozy sturdy red-brick cottage with a round door and flower boxes; a small straw cottage and wooden cottage are distant in a sunny meadow. A gentle tired cartoon wolf rests peacefully on a garden bench outside, with no threatening action. Main pigs and brick house centered, pastel coral and grass green, warm inviting afternoon. Whimsical hand-painted gouache storybook illustration for a seven-year-old child, soft paper grain, rounded expressive shapes, bright reassuring tone. Horizontal 3:2 image, no text, letters, logos, frames, user interface, frightening imagery, or weapons. Keep important content in central 70%; hand-painted matte gouache, simple rounded silhouettes, soft colored outlines. No collage or panel layout.

### redhood

파일: `assets/redhood.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-83906269-7ffa-442f-8012-5310b3c10309.png by default.

Use case: illustration-story. Asset type: restored scene background for a gentle children's territory-capture game. Generate ONE standalone 1536x1024 landscape picture. Restored Little Red Riding Hood fairy tale moment. A cheerful fully clothed little girl in a red hooded cape over a comfortable dress arrives at her grandmother’s small welcoming woodland cottage; smiling grandmother stands in the open doorway receiving a wicker basket with fresh bread. Flower-lined winding forest path, friendly sunbeams, central girl and grandmother, pastel red accents and soft green foliage. No wolf in this scene. Whimsical hand-painted gouache storybook illustration for a seven-year-old child, soft paper grain, rounded expressive shapes, bright reassuring tone. Horizontal 3:2 image, no text, letters, logos, frames, user interface, frightening imagery, or weapons. Keep important content in central 70%; hand-painted matte gouache, simple rounded silhouettes, soft colored outlines. No collage or panel layout.

### beans

파일: `assets/beans.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-bdec8655-56af-45a4-8eba-28b8952fbea2.png by default.

Use case: illustration-story. Asset type: restored scene background for a gentle children's territory-capture game. Generate ONE standalone 1536x1024 landscape picture. Restored Jack and the Beanstalk fairy tale moment of wonder. A curious fully clothed child Jack stands securely in the middle of an enormous broad bean leaf with curling protective vines, looking toward a friendly whimsical castle floating among soft clouds. Huge leaves form a gentle staircase, a tiny nest with a golden egg sits in the distant castle garden. No falling, danger, giant, stealing or weapons. Pastel sky blue, leafy green and warm gold, Jack and castle composition centered with clear shapes. Whimsical hand-painted gouache storybook illustration for a seven-year-old child, soft paper grain, rounded expressive shapes, bright reassuring tone. Horizontal 3:2 image, no text, letters, logos, frames or user interface. Keep important content in central 70%; hand-painted matte gouache, simple rounded silhouettes, soft colored outlines. No collage or panel layout.

### sleeping

파일: `assets/sleeping.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-ff66beb4-b650-4173-8a37-abe9797e67d6.png by default.

Use case: illustration-story. Asset type: restored scene background for a gentle children's territory-capture game. Generate ONE standalone 1536x1024 landscape picture. Restored Sleeping Beauty fairy tale moment reimagined gently for a young child. A happy fully clothed young adult princess in a modest rose-pink day dress opens a wide castle window after a peaceful rest, smiling at little birds and friendly castle residents in a sunlit rose garden below. Cozy bedroom corner and warm dawn visible, healthy wakefulness, no prince, kissing, curses, thorns or danger. Pastel rose, cream and soft gold, central princess and window, clear restful composition. Whimsical hand-painted gouache storybook illustration for a seven-year-old child, soft paper grain, rounded expressive shapes, bright reassuring tone. Horizontal 3:2 image, no text, letters, logos, frames or user interface. Keep important content in central 70%; hand-painted matte gouache, simple rounded silhouettes, soft colored outlines. No collage or panel layout.

### snowwhite

파일: `assets/snowwhite.png`

Generated images are saved to C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a as C:\Users\emax\.codex\generated_images\01a09d40-b238-7133-b2ff-c8a304eb620a\exec-667aa35b-7e24-489f-be26-4404ab1fcddc.png by default.

Use case: illustration-story. Create one 1536x1024 horizontal hand-painted matte gouache children's fairy tale background for Snow White. In a welcoming woodland cottage garden, a picnic table with eight chairs is ready for Snow White and seven forest friends. Fresh apples and neatly sliced apple snacks fill small plates on a cheerful cream-and-red tablecloth. Seven small colorful sun hats hang together on pegs near the cottage door, and one larger red ribbon lies on a chair. A small round gold mirror quietly reflects warm sunlight on the cottage wall. No people. Pastel cherry red, leaf green and honey gold, rounded storybook shapes, soft paper grain, reassuring cozy warm afternoon. Keep the picnic and cottage within central 70 percent, with breathing room. No lettering, logos, borders, UI, collage or panels.


