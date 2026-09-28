# 에이미 그림 제작·직접 검수 기록 — v3

2026-09-14. 공식 내장 imagegen 사용. CLI/API 우회나 외부 소스 다운로드를 사용하지 않았다. 모든 결과는 프로젝트 assets/story에 PNG로 저장했고 JPG는 prepare-art.ps1로 품질 86, 원래 1536×1024 크기를 유지해 생성한다.

## 최종 구성과 출처

소개 24개 그림 키, 복원 8개 키, 가족 3개 키로 총 35개 키다. snowwhite-before는 snowwhite 복원 그림을 복사해 사용하므로 서로 다른 그림은 34종이다. 신규 소개 그림은 16장이고 가족 기존 2장을 수정했다. 기존 twist 7장, opening-dream, 복원 8장은 재사용한다. 같은 동화의 소개 3컷은 서로 다른 장면이다.

| 세계 | before | twist | challenge |
|---|---|---|---|
| race | 신규 출발선 경주 약속 | 신규 실제 페달 자전거 경주 | 신규 빠진 바퀴 혼자 결승선으로 |
| cinderella | 신규 정상 마차 탑승 준비 | 기존 구두 가게 마차 재사용 | 신규 지그재그 마차와 떨어진 구두 |
| duck | 신규 회색 아기 오리와 가족 수영 | 기존 연못 운동장 재사용 | 신규 역기와 큰 물방울 세 개 |
| pigs | 신규 세 형제 집 짓기 | 기존 젤리집 재사용 | 신규 젤리 세 덩이 직선 튀기 |
| redhood | 신규 바구니를 들고 걷기 | 기존 걷는 바구니 재사용 | 신규 C자 빵가루 고리와 열린 길 |
| beans | 신규 땅에서 올려다보는 콩나무 | 기존 구름 세차장 재사용 | 신규 물뿌리개 한 줄 물줄기 |
| sleeping | 신규 잠든 공주 | 기존 잠든 가구 재사용 | 신규 떠 있는 베개·시계·종 빛 |
| snowwhite | 기존 정상 식탁·일곱 모자·거울·사과 재사용 | 기존 사과 줄·거울 재사용 | 신규 되돌아오는 사과와 빛 고리 |

opening-bedroom은 책 속 피자 장면을 자전거 경주로 교체했다. ending-morning은 피자 쿠폰을 제거하고 정상 도보 경주 책, 침대 옆 자전거 벨 하나로 바꿨다. assets/race.png 원본 복원 컷은 직접 확인 결과 귀 두 개로 정상이라 유지했다.

## 직접 검수와 수정

- 기존 race-twist의 토끼 귀가 실제 세 개임을 확인했다. 새로운 그림은 귀 두 개, 팔 두 개, 다리 두 개, 각 자전거 바퀴 두 개를 확인했다.
- race-twist 첫 생성은 발을 땅에 대고 자전거를 잡고 있었다. 메인 피드백대로 실제 안장에 앉아 발로 페달을 밟는 주행 장면으로 수정했다. 부모와 아이가 자전거에 탑승한 그림을 구별할 수 있도록 회전선과 작은 먼지도 넣었다.
- ending-morning 첫 수정은 책 속 토끼의 머리 뒤 팔이 세 번째 귀처럼 읽혔다. 양팔을 배 앞에 둔 자세와 두 수직 귀로 다시 그려 착시를 제거했다. 메인 재검수 승인을 받았다.
- race-challenge는 빨간 자전거 앞바퀴가 빠진 빈 포크와 혼자 굴러가는 바퀴 한 개가 연결된다. 동물은 자전거에서 내린 상태다.
- duck-challenge의 큰 방울 세 개, pigs의 세 형제와 젤리 세 덩이, sleeping의 베개·시계, snowwhite의 살아있는 사과 세 개를 직접 확인했다.
- redhood-challenge 첫 출력의 고리 틈이 불명확해 오른쪽 구간을 제거하는 단일 편집을 했다. 최종 그림에는 할머니 집으로 이어지는 큰 열린 구간과 C자 빵가루가 보인다.
- cinderella-challenge 바닥 구두는 요청의 약 세 개보다 하나 많은 네 개다. 지그재그 경로와 떨어진 구두라는 장면 핵심은 유지된다.
- 재사용 cinderella-twist에는 구두 외 양말·빵 소품이, pigs-twist에는 배경 늑대가 있다. 핵심 반전은 일치하지만 새 브리프의 생략 조건과 완전히 같지는 않음을 메인에게 알렸다. 최종 서사 연결은 메인이 조정한다.
- 모든 신규 결과와 재사용 twist 7장을 원본 출력/직접 view_image로 눈으로 확인했다. 최종 인게임 크기와 화면 연결 검수는 메인 담당이다.

## 생성 도구 제한과 대체

cinderella/duck/pigs 신규 twist 세 요청을 함께 실행하던 중 출력 안전검사 other 분류의 400 오류가 반환됐다(요청 ID f9c36e2a-dd7c-4b77-9071-a29ede44298d). 개별 실패 요청은 반환 정보에서 특정되지 않았고 해당 실행의 신규 파일은 완성되지 않았다. 동일 요청을 우회 재시도하지 않고, 메인이 직접 승인한 기존 적합 twist 그림을 재사용했다.

snowwhite-before의 백설공주와 일곱 성인 친구가 탁자를 차리는 신규 생성도 출력 안전검사 other 분류로 거절됐다(요청 ID 4f406147-3ce4-48a4-8c7a-afe175c1068e). 동일 요청을 재시도하지 않았다. 메인은 기존 정상 식탁·일곱 모자·사과·거울 소품 그림을 before로 재사용하고 내레이션을 맞추기로 결정했다. 사람을 새로 그렸다고 보고하지 않는다.

## 최종 프롬프트 세트

아래는 최종 작업 프롬프트다. 초기 세 컷과 침실은 의미를 보존한 제작 기록이며, 나머지는 도구에 전달한 문구를 기록했다. 각 작업은 직전 장면 또는 기존 복원 그림을 참조해 연속성을 유지했다.

### race-before

Same forest and character designs as assets/race.png. Brown rabbit with exactly two ears and green tortoise stand at chalk start line and agree to friendly footrace. No bicycle or pizza. 1536x1024, warm gouache, no text.

### race-twist

Precise illustration edit. Preserve same brown rabbit, green tortoise, blue rabbit bicycle, red tortoise bicycle, sunny forest and gouache art style. Change their pose so they are REALLY CYCLING and racing side by side down the path, no longer standing holding bikes. BOTH animals sit on their bicycle saddles, BOTH feet on the two pedals (none on ground), both paws on handlebars. Show bikes in readable side profiles with exactly TWO wheels each, coherent bicycle anatomy, circular motion strokes and a few tiny dust puffs. Rabbit has exactly TWO ears total, exactly TWO arms and TWO legs, white belly, no duplicated hands or appendages. Tortoise one shell, two arms and two legs with pedals under feet. Full body and entire bicycles, spaced apart. They smile playfully at each other while actively cycling. No text, letters, numbers, speech balloons or watermark. 1536x1024.

### race-challenge

Same animals and blue/red bicycles as race-twist. Animals dismounted safely behind; red bicycle front fork empty, blue bicycle has two wheels. One detached wheel rolls alone toward finish ribbon. Rabbit exactly two ears, two arms, two legs. 1536x1024, no text.

### cinderella-before

Use case illustration-story. Create a NEW full single scene, landscape 1536x1024 3:2. Match reference's warm handpainted gouache and watercolor textures, family fairy-tale art. Main action within middle 80%, natural correct anatomy and clear silhouettes. NO text, letters, logos, speech bubbles, UI or watermark. At the SAME twilight rose garden and orange pumpkin coach with distant glowing castle, Cinderella in an original simple pale blue dress and brown hair tied back prepares to step into the open NORMAL coach for a ball. She wears a pair of glass slippers. Show one complete human figure, two arms, two legs. Inside coach normal upholstered seat; absolutely no shoe shop displays yet. Warm anticipation, not a movie character design.

### cinderella-challenge

Use case illustration-story. Create a NEW third sequential storybook scene, 1536x1024 landscape 3:2. Same warm painterly gouache style and setting as reference. One readable action, game boss object centered, cheerful humorous mild challenge. No text, letters, numbers, speech bubbles, logos, UI or watermark. The same orange pumpkin SHOE SHOP coach from reference rolls by itself along the twilight garden path in a wobbly ZIGZAG. Show it in three-quarter view slightly tilted with small dusty curved wheel tracks showing zigzag path, no crash. Exactly THREE separate sparkling glass slippers have tumbled onto the path behind it as little obstacles, clearly separated from coach. Distant glowing castle ahead, roses. Focus on the rolling coach and its glass-shoe shelves; no human characters. It wants to sell shoes instead of going to the ball. Keep motion playful, round shapes, no dangerous debris.

### duck-before

Use case illustration-story. Create a NEW full single scene, landscape 1536x1024 3:2. Match reference's warm handpainted gouache and watercolor textures, family fairy-tale art. Main action within middle 80%, natural correct anatomy and clear silhouettes. NO text, letters, logos, speech bubbles, UI or watermark. Use reference's pond environment and soft water painting ONLY. Scene BEFORE absurd events: ONE fluffy GREY duckling with dark grey beak and short neck calmly swims behind a normal white mother duck and exactly THREE little YELLOW ducklings in a pond with reeds and water lilies. Clear distinct separate four ducklings plus mother, all swimming naturally. Curious hopeful grey duckling, no bullying, no tears. NO exercise objects, mats, tubes, barbells or swan adult characters.

### duck-challenge

Use case illustration-story. Create a NEW third sequential storybook scene, 1536x1024 landscape 3:2. Same warm painterly gouache style and setting as reference. One readable action, game boss object centered, cheerful humorous mild challenge. No text, letters, numbers, speech bubbles, logos, UI or watermark. The ONE green water-plant barbell with one blue swim ring and one pink swim ring now bobs up by itself over the middle of the pond, WITHOUT a duck holding it. It splashes EXACTLY THREE prominent round water droplets outward in a clear FAN shape, connected visually to barbell splashes. Grey fluffy duckling and exactly three yellow ducklings stand safely at far bank looking surprised toward barbell; grey has two wings and two feet. No other barbell or exercise tools. Large clear central barbell, blue left pink right, bright lily pond; comic absurd object takes over swimming lesson. No muscular human arms.

### pigs-before

Use case illustration-story. Create a NEW full single scene, landscape 1536x1024 3:2. Match reference's warm handpainted gouache and watercolor textures, family fairy-tale art. Main action within middle 80%, natural correct anatomy and clear silhouettes. NO text, letters, logos, speech bubbles, UI or watermark. SAME three pink pig brothers in blue, green, ochre overalls in sunny meadow. They are in the process of building three DIFFERENT little houses: straw house left, wooden house middle-left, unfinished red brick house right. Foreground green-overall pig carefully stacks normal rectangular solid red bricks, blue pig carries straw bundle, ochre pig holds a wooden plank. EXACTLY THREE pigs, each two ears two arms two legs. No wolf, no jelly yet. Familiar original fairy tale beginning, all houses distinct.

### pigs-challenge

Use case illustration-story. Create a NEW third sequential storybook scene, 1536x1024 landscape 3:2. Same warm painterly gouache style and setting as reference. One readable action, game boss object centered, cheerful humorous mild challenge. No text, letters, numbers, speech bubbles, logos, UI or watermark. A small cluster of THREE translucent red strawberry JELLY bricks squashes together and bounces LOW in one STRAIGHT direction across a sunny meadow path, little curved bounce marks and soft jelly deformation. Central foreground cluster has a friendly simple face, no arms. SAME exactly THREE pink pig brothers in blue/green/ochre overalls stand safely together in background watching with amused surprise. Their three houses straw/wood/jelly remain behind, with a small empty building patch visible. No wolf, no explosion or falling house. Main action is the straight bouncing jelly-brick boss.

### redhood-before

Use case illustration-story. NEW full single storybook scene in landscape 1536x1024 3:2, same warm painterly gouache textures, character designs and colors as reference. Familiar original fairy tale BEFORE any silly magic. Natural anatomy, clear silhouettes, central 80% main action. No text, letters, speech bubbles, UI, logos or watermark. Same little red hood girl with brown hair, white floral dress and brown boots walks happily along forest path toward grandmother's cottage visible in the distance. She holds ONE normal wicker basket of bread with red checked cloth by its handle. Basket has NO legs or face and is being carried. Grandmother is not visible yet. Full girl, exactly two arms and two legs, gentle dappled sun.

### redhood-challenge

Precise local illustration edit. Preserve every detail of the girl, cottage, forest, spinning basket and painterly style. ONLY change breadcrumb ring on the ground: REMOVE the entire RIGHT-HAND QUARTER of the breadcrumb oval, from approximately 1 o'clock through 4 o'clock as seen in the image, leaving a very obvious broad empty passage of clean path leading from the spinning basket diagonally upper-right toward cottage. Ring must form a clear C shape, NOT a closed circle. Leave remaining three quarters of crumbs unchanged. No new text or objects. 1536x1024.

### beans-before

Use case illustration-story. NEW full single storybook scene in landscape 1536x1024 3:2, same warm painterly gouache textures, character designs and colors as reference. Familiar original fairy tale BEFORE any silly magic. Natural anatomy, clear silhouettes, central 80% main action. No text, letters, speech bubbles, UI, logos or watermark. Same brown-haired boy Jack, cream shirt, brown vest, olive trousers and satchel, now stands safely on GROUND at base of huge beanstalk, gazing upward as enormous leaves spiral toward a castle barely visible above clouds. Low viewpoint emphasizing height, boy full body with two arms two legs central-left. No watering can, no washing clouds, no faces on clouds. Beginning of adventure.

### beans-challenge

Use case illustration-story. NEW third sequential storybook scene, 1536x1024 landscape 3:2. Match SAME characters, clothing, objects, environment and warm handpainted gouache style from reference. Game-boss object centered, one clear playful action. No text, letters, digits, speech bubbles, UI, logos or watermark. The same smiling BLUE WATERING CAN is centered over the beanstalk leaves and sends out ONE narrow continuous curved-ended water stream HORIZONTALLY to the right, with a few soft soap bubbles trailing behind it. Can is stopped, one spout, one handle, one gentle face. Same brown-haired Jack in brown vest cream shirt olive trousers stands safely on a broad separate leaf at left, watching and pointing toward distant cloud castle. Exactly two arms two legs. Single line of water visually clear, no washing queue this time. All safe whimsical clouds, no falling characters.

### sleeping-before

Use case illustration-story. NEW full single storybook scene in landscape 1536x1024 3:2, same warm painterly gouache textures, character designs and colors as reference. Familiar original fairy tale BEFORE any silly magic. Natural anatomy, clear silhouettes, central 80% main action. No text, letters, speech bubbles, UI, logos or watermark. Same blonde fairy-tale princess wearing modest pink gown sleeps peacefully in a cozy bed in the SAME rose-framed castle bedroom, face eyes gently closed, head on a pillow with pink stars. Normal chair and ordinary teacup beside bed, no faces on objects. Open window shows rose castle garden. Calm warm morning light, sleeping rather than distressed. No other people.

### sleeping-challenge

Use case illustration-story. NEW third sequential storybook scene, 1536x1024 landscape 3:2. Match SAME characters, clothing, objects, environment and warm handpainted gouache style from reference. Game-boss object centered, one clear playful action. No text, letters, digits, speech bubbles, UI, logos or watermark. The SAME cream pillow with PINK STARS now FLOATS in central foreground, loosely wrapped around the SAME small golden ALARM CLOCK with plain dot hour marks, no numerals. Pillow stretches upward like yawning and sends TWO gentle concentric golden round sound-wave rings into air, with tiny bell-shaped light accents. Same princess in pink dress stands in background at left pointing to open castle window with amused determination, exactly two arms. Same sleeping chair and teacup remain background. Main pillow-clock large readable, soft and friendly, no explosions or frightening faces.

### snowwhite-challenge

Use case illustration-story. NEW third sequential storybook scene, 1536x1024 landscape 3:2. Match SAME characters, clothing, objects, environment and warm handpainted gouache style from reference. Game-boss object centered, one clear playful action. No text, letters, digits, speech bubbles, UI, logos or watermark. Focus on the SAME round GOLD MIRROR with friendly face and little apple ornament, now centered prominently beside woodland cottage garden. Exactly THREE lively red apples with tiny feet around it: one apple curls away from mirror back toward the back of the queue on a curved dusty track, creating a funny endless counting loop. Mirror emits soft apple-shaped light orbs in a WIDE OPEN circular arc and a short fan, gaps clearly visible. Normal empty snack table visible left background. No humans, no new characters. Main mirror and three apples separate, playful readable composition, no numbers.

### opening-bedroom

Preserve original family identities, clothing, bedroom, hands, night light. Replace book picture with brown two-eared rabbit on blue bicycle and green tortoise on red bicycle, two wheels each. Remove all pizza. 1536x1024, no text.

### ending-morning

Precise correction edit. KEEP the whole family scene, warm morning light, cat, all people faces hands and clothing, tortoise and finish scene on right book page, and small bicycle bell on left bedside table EXACTLY unchanged. Fix ONLY the small brown rabbit printed on LEFT page of open book. Redraw that small rabbit sitting upright against tree with both front paws folded on its white belly, both feet forward. Its silhouette above head must have EXACTLY TWO upright long ears total with pink insides, no third ear, no horizontal ear, no arm behind head, no horizontal projection at head height. Clearly separate the two ears against the tree background. Rabbit happy relaxed eyes. Preserve painterly storybook texture. No pizza, no card. No text. Full image 1536x1024.
