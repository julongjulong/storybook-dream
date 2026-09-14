# 탐정 동화 v4 아트 제작·검수 기록

담당: 에이미. 제작 도구: 내장 imagegen. 12개 사건의 6컷 시트와 가족 장면 2장. 기존 v3 자산은 보존했다. 모든 새 자산은 assets/detective 안에 저장한다.

## 네트워크 재시도 및 최종 교정 지시 보충

ending-morning과 troy 각각 첫 편집 요청에 네트워크/연결 오류가 발생하여 동일한 편집 요청으로 재시도했다. 최종 자산만 게임 경로에 유지한다.

### wind 모자 중복과 턱끈 교정

Edit this six-panel comic preserving layout, artwork, rabbit exact two ears, all characters, and all six story beats. ONLY correct these continuity details: In top-right panel the traveler currently wears a duplicate hat while holding the same hat. REMOVE hat from his HEAD only and paint his normal hair, keeping the hat held in hands to inspect its empty attachment loops. In bottom-left and bottom-right ensure the recovered short wide blue fabric hat strap is visibly attached to hat brim sides and curves LOOSELY under the chin, with comfortable air gap, NOT merely a ribbon around the crown. Do not add another hat. No text. Everything else unchanged.

### troy 발견 전 손잡이 제거

Edit this six-panel story comic preserving its exact layout and all characters/artwork. The round doorknob is LOST until middle-right discovery. In TOP-LEFT panel and MIDDLE-LEFT panel ONLY, REMOVE the visible golden round knob on the wooden duck-cart door and replace it with a tiny EMPTY dark circular mounting hole. Keep both doors closed. Top-right already correctly shows empty mounting hole; keep it. Middle-right finding the knob, bottom-left installed knob and opened door, bottom-right celebration remain unchanged. No other edits.


## 규격과 표시

- 시트는 2열 × 3행, 읽는 순서 0~5. 요청 규격은 1536×1536이었으나 도구의 실제 반환은 모두 1254×1254였다. 확대·재표본화하지 않았다.
- 가족 두 장은 1536×1024 전체 그림이다.
- PNG 원본과 같은 픽셀 크기의 JPEG 품질 86을 제공한다. System.Drawing으로 단순 형식 변환만 했으며 패널 추출·재구성은 하지 않았다.
- 패널 경계는 균등 분할에서 조금 벗어난다. 실측한 세로·가로 구분선과 ant의 흰 여백을 제외한 사각형을 frames.json에 기록했다. JPEG 경계 번짐을 피하려고 내용 쪽으로 2~4px 추가 여유를 두었다. 좌표는 [x,y,width,height]이다.
- 패널 3은 발견 배경, 0~2는 수사 전개, 4~5는 해결과 유머다. 실제 표시와 게임 연결은 메인 담당자가 처리한다.

## 전 장면 검수와 교정

| 사건 | 발견 물건·전개 검수 | 교정·허용 사항 |
|---|---|---|
| race | 풀숲에서 등껍질 발견 → 돌려받은 거북이 경주 → 결승선/토끼 윙크 | 귀는 두 개. 발견 클로즈업의 귀 끝 일부가 패널 상단에서 잘리는 구도는 메인 직접 검수 후 허용했다. |
| duck | 장화 한 켤레에 작은 오리 두 마리 → 회색 오리가 착용 → 물놀이 | 메인 직접 검수 통과. |
| pigs | 비정상 문 → 집 선 그림 설계도 → 바른 문 → 세 돼지와 입장 | 발견 컷 네 번째 돼지 중복 제거. 펼친 설계도와 중복된 종이 모자 제거. 최종 세 마리 확인. |
| redhood | 화분의 열쇠 → 할머니 문 열기 → 빵 나눔 | 메인 직접 검수 통과. |
| beans | 빈 종 자리 → 구름의 종 모자 → 종 울리기 → 거인 쿠키 | 안전한 넓은 잎, 친절한 거인. 발견 이전 종 노출 없음. |
| ant | 빈 문 구멍 → 곡식 사이 둥근 손잡이 → 열린 창고 → 잔치 | 2·3패널이 잠긴 창고 안이던 인과 오류를 창고 밖 눈 쌓인 처마 아래로 수정. 발견까지 닫힌 문 유지. |
| lion | 잎 아래 둥근 공예 가위 → 몸과 떨어진 여분 줄 자르기 → 낮잠 | 가위는 닫힌 채 발견. 마지막 ZZZ 효과를 제거하여 최종 문자 없음. |
| fox | 새 두 마리의 낮은 사다리 → 토끼가 지지 → 포도 나눔 | 눕힌 긴 사다리 대신 낮은 A형 사다리/발판. 메인이 낮고 튼튼한 소품으로 허용. |
| wind | 빈 고리 → 파란 끈 → 모자 턱끈으로 사용 | 질문 컷 중복 모자 제거. 발견 끈을 길고 좁게 교정. 해결 두 컷에서 턱 아래를 지나는 형태로 통일. |
| ax | 물풀의 회색 도끼 → 반환 → 금 장식 도끼 문진 | 도구 위협이나 공격 없음. 메인 직접 검수 통과. |
| piper | 피리 마개 → 다시 끼움 → 자유로운 동물 행진 | 작은 음표·물음표는 만화 효과이며 문장·UI 없음. 메인 직접 검수 통과. |
| troy | 빈 손잡이 자리 → 색종이 속 손잡이 → 열린 오리 수레 | 첫·세 번째 컷에 미리 보이던 손잡이를 빈 구멍으로 교정. 군인·무기·전쟁 없음. |

토끼는 전체적으로 따뜻한 갈색, 크림 배, 청록 목수건, 긴 귀 두 개로 통일했다. 별도 흰 토끼/가방 설정 대신 메인 확정 캐릭터를 사용했다. 보조 인물의 마릿수, 팔·다리, 단서의 발견 전 노출, 해결 행동을 각 시트에서 직접 확인했다.

가족 오프닝은 책 속 자전거를 탐정 토끼·거북이로, 아침은 책의 정상 경주/윙크와 침대 옆 장난감 돋보기로 바꾸었다. 자전거 벨은 제거했다. 엄마·아빠·아이·고양이와 기존 따뜻한 화풍을 유지했다. ending-morning 최초 편집은 연결 오류로 실패해 같은 내장 도구로 재시도했다. 거절 우회나 외부 API는 사용하지 않았다.

## 패널 좌표

```json
{
  "race": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "duck": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "pigs": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "redhood": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "beans": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "ant": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        613,
        402
      ],
      [
        634,
        0,
        620,
        402
      ],
      [
        0,
        421,
        613,
        381
      ],
      [
        634,
        421,
        620,
        381
      ],
      [
        0,
        820,
        613,
        434
      ],
      [
        634,
        820,
        620,
        434
      ]
    ]
  },
  "lion": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "fox": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        620,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        620,
        389
      ],
      [
        632,
        423,
        622,
        389
      ],
      [
        0,
        823,
        620,
        431
      ],
      [
        632,
        823,
        622,
        431
      ]
    ]
  },
  "wind": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "ax": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "piper": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        414
      ],
      [
        632,
        0,
        622,
        414
      ],
      [
        0,
        423,
        622,
        393
      ],
      [
        632,
        423,
        622,
        393
      ],
      [
        0,
        825,
        622,
        429
      ],
      [
        632,
        825,
        622,
        429
      ]
    ]
  },
  "troy": {
    "width": 1254,
    "height": 1254,
    "panels": [
      [
        0,
        0,
        622,
        415
      ],
      [
        632,
        0,
        622,
        415
      ],
      [
        0,
        423,
        622,
        395
      ],
      [
        632,
        423,
        622,
        395
      ],
      [
        0,
        826,
        622,
        428
      ],
      [
        632,
        826,
        622,
        428
      ]
    ]
  }
}
```

## 제작 프롬프트

공통 지시(일부 개별 프롬프트에 이미 포함됨):

프롬프트 기록은 읽기 쉽게 정리했다. beans·ant·lion·fox 최초 호출에는 공통 문자열 연결 오류로 앞에 undefined 문자열이 붙었다. 아래는 해당 무의미한 접두어를 제외한 본문이다. 네 장 모두 race 시트를 참조했고, 생성된 6컷 구성·캐릭터·서사를 직접 검수했다.

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. 

### race

Use case illustration-story. Create a square 1536x1536 sprite sheet of SIX children's comic story illustrations arranged EXACTLY TWO COLUMNS x THREE ROWS. Every panel exactly 768x512 pixels (landscape3:2). Vertical boundary exactly x768; horizontal boundaries y512 and y1024. Tiny thin dark separators only, NO outer margin or gutters, no panel spills, no text/captions/labels/numbers/speech bubbles. Six separate clear scenes, reading order top left,top right,middle left,middle right,bottom left,bottom right. Use reference watercolor-gouache forest art and rabbit design. Recurring detective rabbit is warm brown with cream belly, EXACTLY TWO long ears, TWO arms TWO legs, small TEAL SCARF, NO hat or glasses. Same rabbit in ALL six panels. Same friendly green tortoise. Story: (top-left) rabbit meets a sad tortoise at race starting path; tortoise has LOST ITS SHELL, so back is smooth light green covered by a simple light-green tunic, clearly no brown shell, slumped shoulders but child-friendly fully clothed. (top-right) rabbit kindly asks and listens while shell-less tortoise points toward shady bushes; no shell visible. (middle-left) rabbit approaches mysterious leafy shrubs with magnifying glass, a safe curious woodland search scene; shell still entirely hidden, no brown shell in this panel. (middle-right) rabbit parts leaves and finds ONE clear brown tortoise shell under bush, shell is central large readable clue; NO other lost object, rabbit delighted. (bottom-left) tortoise now wears its recovered brown shell and smiles beside rabbit, both jog on foot along race trail. (bottom-right) tortoise crosses red finish ribbon on feet; rabbit rests under tree with paws on belly and winks ONE eye toward viewer as friendly joke. No bikes, pizzas, weapons, scary imagery. Rabbit ears always clearly exactly TWO, no arm behind head that resembles third ear. Keep each panel's main action well within its own central area.



### duck

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING sunny lily pond. Recurring friend grey fluffy duckling, dark bill, two wings two webbed feet. Panel0: grey duckling sits sadly barefoot at water edge while yellow duckling friends splash; rabbit notices. Panel1: rabbit asks grey duckling while inspecting little muddy footprint trails leading to water lilies; NO boots visible. Panel2: rabbit with magnifier searches dense water lilies, grey duckling waits on bank; lost object completely hidden. Panel3 DISCOVERY: rabbit parts water lilies and finds exactly ONE PAIR of bright YELLOW RAIN BOOTS floating together, each boot is used as tiny boat by one yellow duckling. Both boots big clear central clue. Panel4: grey duckling wears recovered yellow boots and shares happy splashing with friends, rabbit smiles. Panel5: rabbit dips one paw foot into water, little funny splash and smiles directly to viewer; grey booted duckling and two yellow friends laugh, friendly inclusive moment.



### pigs

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING sunny construction meadow, EXACTLY THREE pig brothers with blue,green,ochre overalls. Panel0: unfinished brick house has a silly doorway opening incorrectly HIGH near roof; three pigs puzzled, rabbit looks up. Panel1: rabbit gently asks pigs and notices tiny blank paper scraps between bricks, missing blueprint NOT shown; youngest ochre pig off in background, no visible paper hat yet. Panel2: rabbit searches stacked red bricks with magnifier, no plan or paper hat visible, safe construction scene. Panel3 DISCOVERY: youngest ochre pig is wearing a folded PAPER HAT made from BLUEPRINT, rabbit lifts/unfolds it enough so a large simple drawn HOUSE DIAGRAM is clearly visible without letters or dimensions. This plan is central clear clue. Panel4: all three pigs and rabbit use unfolded house-diagram blueprint to make doorway at normal ground level. Panel5: they walk happily through correct doorway, rabbit pretends to jump a tiny bit then winks at viewer, no need to jump now. Normal tools, no injuries. Each pig exactly two ears two arms two legs.

최종 교정:

Precise comic edit. Preserve full square six-panel sheet dimensions, divider positions, all FIVE other panels exactly. Change ONLY MIDDLE-RIGHT discovery panel. Currently FOUR pigs appear there. Remove the extra green-overall pig at upper-right behind the lower-right green-overall pig, replacing with matching simple background. Final that panel has EXACTLY THREE pigs: blue left, ochre center, green lower-right. Remove the folded paper hat from ochre pig's head entirely because it has been unfolded. Rabbit holds exactly ONE unfolded sheet showing simple house diagram, no writing, this is the former hat and the only blueprint. Keep rabbit exactly two ears, correct two arms and same teal scarf. Do not alter any other panel or add text.

### redhood

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING woodland cottage and flower garden. Same red-hood girl with brown hair, modest white dress, bread basket; friendly silver-haired grandmother indoors. Panel0: red-hood girl waits at closed front door holding bread; grandmother peers from window unable to open door, rabbit notices their puzzled faces. Panel1: rabbit asks grandmother at window and observes little glint-shaped indentation beside a flowerpot, no key visible. Panel2: rabbit and girl search shadowed flowerpots with magnifier; key completely hidden, grandmother window background. Panel3 DISCOVERY: rabbit finds ONE small brass KEY stuck in soil of a flowering pot like plant label, large clear key centered. Panel4: rabbit gives key to grandmother who opens door, red-hood girl happy. Panel5: all enjoy bread at little table in cozy cottage; rabbit's two ears peek over an oversized bread roll while rabbit smiles at viewer, warm harmless joke.



### beans

SETTING giant beanstalk with broad safe leaf paths and cozy house among clouds. Boy Jack brown hair cream shirt brown vest olive trousers, kind giant adult host. Panel0: Jack and rabbit stand on broad leaf knocking at closed house door, no answer, warm cookies visible through window. Panel1: rabbit examines EMPTY hanging cord beside door where doorbell is missing; no bell visible. Panel2: rabbit and Jack investigate fluffy clouds along broad safe leaf path, no bell yet, no falling danger. Panel3 DISCOVERY: a small smiling cloud wears ONE golden BELL as a funny hat, large clearly identifiable rounded bell centered, rabbit reaches with delighted expression. Panel4: restored bell hangs by door and rabbit rings it, kindly giant opens door to greet Jack. Panel5: friendly giant offers cookie larger than rabbit's ears, rabbit holds two ears upright beside huge cookie to compare size and smiles at viewer. No fear, no theft.



### ant

SETTING tiny friendly winter harvest feast by grain storehouse, gentle snowy distance but all warm cozy. Rabbit interacts with friendly anthropomorphic red ants and one green grasshopper, cute simplified anatomically consistent insects. Panel0: ants hold empty plates outside closed storehouse door which has no handle, grasshopper and rabbit wait puzzled. Panel1: rabbit examines EMPTY round door-handle mounting hole with magnifier, no actual handle. Panel2: rabbit searches grain baskets and acorn piles, grasshopper not showing any hoop, hidden answer. Panel3 DISCOVERY: grasshopper has used a metal ROUND RING DOOR HANDLE as small hula hoop beside grain pile; rabbit discovers it. Large brass ring with mounting stem clearly visible, grasshopper offering it back. Panel4: handle reattached and door OPEN, ants bring baskets of food while grasshopper readies a small fiddle. Panel5: everyone shares feast, grasshopper plays fiddle and rabbit's two long ears sway to rhythm, direct cheerful smile to viewer. No punishment or hunger suffering.

최종 교정:

Precise comic continuity correction. Preserve full SIX-panel layout, all characters, rabbit with two ears teal scarf, their exact actions and props, and the four top/bottom panels. Change ONLY BACKGROUNDS of MIDDLE LEFT search and MIDDLE RIGHT discovery panels: they must be OUTDOORS under storehouse exterior porch roof, with snowy courtyard, daylight blue sky glimpses, CLOSED wooden storehouse door in background, a few grain sacks/acorn baskets STORED OUTSIDE beneath eaves. NO interior warehouse walls or ceiling enclosing these middle panels. Rabbit still searches outside sacks on middle-left; grasshopper still holds clear brass ring door handle with mounting stem in middle-right. No handle visible before discovery. Thin grid dividers unchanged. No text.

### lion

SETTING sunny meadow with ONE friendly golden lion and tiny grey mouse. Panel0: lion trying to get up from LOW hammock near ground, one loose rope loop around ankle hinders stretch; rabbit and mouse approach calmly. No hunting trap, no neck rope, no danger. Panel1: mouse shows empty tool pouch as rabbit inspects scissors-shaped impression in grass, scissors NOT visible. Panel2: rabbit searches beneath broad leaves and grass with magnifier, lost scissors hidden. Panel3 DISCOVERY: rabbit lifts ONE leaf to reveal a small CLOSED pair of round-ended craft SCISSORS resting on grass, clear large focal clue, handles obvious. Panel4: mouse uses scissors to cut a loose dangling rope end ON GROUND away from lion's body, rabbit holds loose rope; lion stands up comfortably. Panel5: lion now already asleep on flat grass, rabbit and mouse grin together, rabbit smiles toward viewer with one paw gently near mouth like quiet chuckle. Scissors put away, no sharp threats.

최종 교정:

Precise tiny edit. Preserve entire six-panel comic sheet exactly including all grid borders and every character and object. In BOTTOM RIGHT panel ONLY remove the three floating white Z sleep letters above sleeping lion and replace with matching plain distant forest. Leave all other details unchanged. No letters, no numbers, no text added.

### fox

SETTING sunny grape arbor. Friendly orange fox white muzzle, same size as rabbit. Panel0: fox turns nose up at grapes hanging just out of reach, one paw on tummy, rabbit looks curiously between fox and grapes. Panel1: rabbit examines TWO long parallel ground marks beneath grapevine where short ladder was, ladder NOT visible. Panel2: rabbit and fox search leafy grapevine shadows, no ladder or bird bench exposed. Panel3 DISCOVERY: a LOW sturdy three-rung wooden LADDER lies sideways beneath vines and exactly TWO small birds use it as a bench. Rabbit discovers it, ladder large clear central clue. Panel4: rabbit steadies low ladder on flat ground while fox on lowest rung picks one low bunch of grapes, not high or dangerous. Panel5: rabbit and fox share grapes sitting side by side, fox sheepish smile, rabbit winks directly to viewer. Warm gentle humor, no mockery.



### wind

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING flowered meadow road, friendly round WIND CLOUD and smiling sun in sky; one modestly clothed adult traveler with round brown hat and blue jacket. Panel0: traveler has to hold hat with both hands as friendly cloud blows a little too strongly, rabbit notices. Panel1: rabbit examines EMPTY chin-strap attachment loops on hat and long ribbon impression in ground, no strap visible. Panel2: rabbit searches among meadow flowers while cloud now blows very gently, lost strap hidden. Panel3 DISCOVERY: ONE SHORT WIDE soft BLUE HAT STRAP caught between flower stems, rabbit lifts it, large clear ribbon clue. No string around bodies. Panel4: rabbit reattaches short loose strap to traveler's hat, happy relieved traveler lowers hands. Panel5: sun shines and wind gently breezes as traveler waves freely with both hands; rabbit, sun and cloud smile warmly at viewer. No undressing, no competition.

최종 교정:

Edit this six-panel comic preserving layout, artwork, rabbit exact two ears, all characters, and all six story beats. ONLY correct these continuity details: In top-right panel the traveler currently wears a duplicate hat while holding the same hat. REMOVE hat from his HEAD only and paint his normal hair, keeping the hat held in hands to inspect its empty attachment loops. In bottom-left and bottom-right ensure the recovered short wide blue fabric hat strap is visibly attached to hat brim sides and curves LOOSELY under the chin, with comfortable air gap, NOT merely a ribbon around the crown. Do not add another hat. No text. Everything else unchanged.
추가 발견 컷 교정:

Precise single-panel continuity correction to this six-panel comic. Change ONLY MIDDLE-RIGHT discovery panel: the blue object held by rabbit is the lost HAT CHIN STRAP. Make it a LONG, NARROW, soft BLUE FABRIC STRAP, width around 1.5cm, hanging in a loose U between the rabbit two hands, small attachment loops at both ends. It must visually MATCH the narrow blue chin strap already correctly attached under the travelers chin in bottom-left and bottom-right. Remove the current wide short belt shape entirely. Keep rabbit exactly TWO ears, same hands/anatomy, flowers, panel geometry. ALL OTHER FIVE PANELS unchanged. No letters/text.

### ax

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING shallow sunny pond, kind adult woodcutter in plaid shirt, friendly round blue pond sprite. Tools all blunt cartoon rounded shapes, no weapons or threat. Panel0: woodcutter puzzled by TWO oversized decorative axes, one gold one silver, both lying flat on ground too heavy to use; rabbit listens. Panel1: rabbit examines short wooden-handle impression in soft mud, original grey axe absent. Panel2: rabbit safely searches water plants from pond BANK, no diving, lost tool entirely hidden. Panel3 DISCOVERY: ONE small grey IRON AXE with short WOODEN HANDLE rests safely on lily leaves, rounded axe head pointing away from rabbit, large clear tool clue. Panel4: rabbit offers tool handle-first to smiling woodcutter, sprite happy. Panel5: oversized GOLD decorative axe lies flat holding down a blank detective sketch paper against breeze as PAPERWEIGHT, rabbit gives thumbs-up to viewer and friends chuckle. No chopping or sharp menace, no letters on paper.



### piper

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING cheerful village square, adult musician in green vest holds simple wooden fipple FLUTE, two tiny friendly mice with drum/fiddle. Panel0: musician blows cheeks but flute has no music, mice stop playing puzzled, rabbit watches. Panel1: rabbit examines EMPTY socket at end of flute where round cap is missing, simple line-pattern music paper no writing, cap NOT visible. Panel2: rabbit searches around instrument cases and paving stones, lost cap completely hidden. Panel3 DISCOVERY: ONE small ROUND wooden FLUTE CAP rests underneath tiny drumsticks like their stand, little mouse offers it to delighted rabbit. Make cap visibly a separate rounded plug with insertion stem, central close-up clue. Panel4: rabbit returns cap, musician fits it into flute, mice ready instruments, happy success. Panel5: musician and WILLING friends make joyful village parade, rabbit's two ears sway to rhythm and smile at viewer. No coercion, kidnapping, hypnotism or extermination; no children following away.



### troy

Use case illustration-story. A SIX-PANEL story comic sprite sheet, square1536x1536, exactly TWO columns by THREE rows of equal landscape3:2 panels. Thin straight divider lines, NO gutters, NO outside margins. Every panel is separate and figures stay fully inside panel with generous safe internal composition space around ears and feet; no border overlap. No text, lettering, numbers, captions or speech bubbles. Reading order top-left,top-right,middle-left,middle-right,bottom-left,bottom-right. Warm watercolor-gouache picturebook for age7. Reference establishes recurring detective: SAME warm brown rabbit, cream belly, small teal scarf, EXACTLY TWO long ears, two arms two legs, NO hat or glasses. Rabbit appears in ALL six panels and same identity each time. Gentle humorous mystery with clear object recovery, never scary. SETTING sunny friendly festival courtyard with colorful blank bunting and paper confetti; giant WOODEN DUCK on FOUR cart wheels is a party playhouse, NEVER military. Panel0: side door closed, several familiar animal friends smile comfortably from BIG OPEN WINDOWS, rabbit tilts ears to listen. Panel1: rabbit examines EMPTY round door-handle mounting hole and circular mark near cart wheel, handle absent. Panel2: rabbit searches confetti on courtyard ground, lost handle completely hidden; animals waiting happily in open windows. Panel3 DISCOVERY: rabbit lifts confetti beside ONE cart wheel and finds ONE ROUND WOODEN DOOR HANDLE with short mounting stem, clear large central clue. Panel4: handle attached to side door which now opens wide, cheerful animal friends come out voluntarily waving confetti, rabbit welcomes. Panel5: rabbit faces viewer closely, one paw over heart and one eye WINK as thanks; behind him wooden duck's beak is comically open once, happy friends laugh. No soldiers, weapons, battle, trapped distress or text.

최종 교정:

Edit this six-panel story comic preserving its exact layout and all characters/artwork. The round doorknob is LOST until middle-right discovery. In TOP-LEFT panel and MIDDLE-LEFT panel ONLY, REMOVE the visible golden round knob on the wooden duck-cart door and replace it with a tiny EMPTY dark circular mounting hole. Keep both doors closed. Top-right already correctly shows empty mounting hole; keep it. Middle-right finding the knob, bottom-left installed knob and opened door, bottom-right celebration remain unchanged. No other edits.

### opening-bedroom 편집

Precise illustration edit. First image is target family bedtime scene. Preserve all family's faces, clothes, hands, cat, bedroom, warm nighttime lighting and style. Change ONLY the book illustration: replace bicycles entirely with the rabbit detective from reference2, brown with exactly TWO long ears and small teal scarf holding a magnifying glass, kindly talking to green tortoise without its shell, tortoise wears simple light green tunic. Sunny forest picture across pages, no bikes, no princesses, no pizza. Rabbit detective no hat/glasses, two arms two legs. No text/captions. Landscape target dimensions preserved.

### ending-morning 편집

Precise illustration edit. First image target family morning scene; preserve family identities, clothes, hands, cat, warm sunlight and room exactly. Update book illustrations to SAME brown rabbit detective with TEAL SCARF from reference2 and exactly TWO upright ears, front paws on belly under tree, winking one eye toward viewer, while green tortoise with brown recovered shell walks across red finish ribbon on right page. No bikes, no pizza, no princess. Replace small BICYCLE BELL on LEFT bedside table with exactly ONE small toy MAGNIFYING GLASS laid there as dream souvenir. No bell remains. No text or other changes. Preserve landscape dimensions.
