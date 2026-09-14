// v4: rabbit detective cases. Game rules and save data live in their own modules.
export const STORY = {
  "title": "토끼 탐정과 열두 동화 사건",
  "subtitle": "한 칸씩 밝히고, 함께 찾아요",
  "mapTitle": "토끼 탐정의 사건 수첩",
  "opening": [
    {
      "speaker": "나",
      "text": "“토끼가 왜 안 달리지?” 자기 전 동화책을 펼쳤는데 토끼가 돋보기를 들고 있어요.",
      "artId": "opening-bedroom",
      "caption": "오늘 밤의 이상한 동화책",
      "emotion": "curious"
    },
    {
      "speaker": "엄마 · 아빠",
      "text": "“원래 탐정이잖아. 경주보다 먼저 도와줄 친구가 있대.” 두 분은 아주 태연해요.",
      "artId": "opening-bedroom",
      "caption": "그런 이야기였나요?",
      "emotion": "silly"
    },
    {
      "speaker": "토끼 탐정",
      "text": "꾸벅… 눈을 떠 보니 토끼 탐정 곁이에요. “내 짝꿍이 되어 줄래? 선을 이어 숨은 물건을 찾자!”",
      "artId": "opening-dream",
      "caption": "꿈속에서 만난 수사 짝꿍",
      "emotion": "wonder"
    }
  ],
  "ending": [
    {
      "speaker": "나",
      "text": "아침이에요. 책을 펼치니 친구들이 웃고 있어요. 열두 가지 문제를 토끼와 함께 풀었어요.",
      "artId": "ending-morning",
      "caption": "한 칸씩 찾아낸 열두 가지 웃음",
      "emotion": "proud"
    },
    {
      "speaker": "엄마 · 아빠",
      "text": "“이 작은 돋보기는 어디서 났지?” 책 속 토끼가 나만 알아보게 살짝 윙크했어요.",
      "artId": "ending-morning",
      "caption": "오늘도 내 곁의 수사 짝꿍",
      "emotion": "tender"
    }
  ],
  "items": [
    {
      "id": "shell",
      "key": 1,
      "name": "거북이 보호막",
      "short": "세 번 든든하게 보호",
      "description": "조금 느려지는 대신 부딪힘을 세 번 막아 줘요.",
      "requiredStages": [
        "race",
        "duck",
        "pigs"
      ]
    },
    {
      "id": "feather",
      "key": 2,
      "name": "깃털 바람",
      "short": "가까운 방울을 후우",
      "description": "가까운 작은 장난꾸러기와 방울을 바람으로 돌려보내요.",
      "requiredStages": [
        "redhood",
        "beans",
        "ant"
      ]
    },
    {
      "id": "lantern",
      "key": 3,
      "name": "숲길 등불",
      "short": "공격 준비를 잠깐 멈춤",
      "description": "준비 중인 공격을 멈추고 장난꾸러기들이 잠깐 불빛을 구경하게 해요.",
      "requiredStages": [
        "lion",
        "fox",
        "wind"
      ]
    },
    {
      "id": "clock",
      "key": 4,
      "name": "꿈꾸는 시계",
      "short": "생각할 시간을 선물",
      "description": "장난꾸러기와 방울을 멈추고 길을 이어 갈 시간을 만들어요.",
      "requiredStages": [
        "ax",
        "piper",
        "troy"
      ]
    }
  ],
  "worlds": [
    {
      "id": "race",
      "title": "토끼와 거북이",
      "subtitle": "경주하기 싫은 거북이",
      "clue": {
        "name": "거북이 등껍질",
        "x": 36,
        "y": 24
      },
      "boss": {
        "name": "데굴데굴 낙엽 뭉치",
        "symbol": "leafball",
        "description": "사라진 등껍질 주변을 덮은 가벼운 낙엽 뭉치. 천천히 굴러가며 첫 수사 구역을 가린다."
      },
      "intro": [
        {
          "speaker": "거북이",
          "text": "“오늘은 경주 안 할래.” 출발선에 앉은 거북이가 등을 꼭 가리고 있어요.",
          "artId": "race-before",
          "caption": "이상하게 조용한 출발선",
          "emotion": "tender"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“등껍질이 없잖아! 마지막으로 어디에 있었어?” 풀밭에 동그란 자국이 남았어요.",
          "artId": "race-twist",
          "caption": "경주보다 먼저 할 일",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“자국을 따라 찾아보자!” 어두운 풀밭을 선으로 감싸 밝히면 등껍질이 보일 거예요.",
          "artId": "race-challenge",
          "caption": "첫 수사 · 등껍질을 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "거북이",
          "text": "“내 등껍질이다!” 낙엽 밑에서 찾았어요. 토끼가 돌려주자 거북이가 씩 웃어요.",
          "artId": "race-solved",
          "caption": "찾았다, 다시 출발할 준비",
          "emotion": "joy"
        },
        {
          "speaker": "토끼 탐정",
          "text": "경주가 시작됐어요. 그런데 내가 꾸벅… 거북이가 먼저 도착했네요! 쉿, 너에게만 윙크!",
          "artId": "race-wink",
          "caption": "오늘의 수사는 내가 이겼지?",
          "emotion": "silly"
        }
      ],
      "restored": "토끼 탐정이 풀밭 낙엽을 살짝 걷어 온전한 거북이 등껍질을 발견한다. 등껍질은 아직 거북이에게 돌아가기 전이다.",
      "index": 1,
      "pairIndex": 0,
      "twist": "“오늘은 경주 안 할래.” 출발선에 앉은 거북이가 등을 꼭 가리고 있어요. “등껍질이 없잖아! 마지막으로 어디에 있었어?” 풀밭에 동그란 자국이 남았어요.",
      "art": {
        "filename": "race.jpg",
        "prompt": "토끼 탐정이 풀밭 낙엽을 살짝 걷어 온전한 거북이 등껍질을 발견한다. 등껍질은 아직 거북이에게 돌아가기 전이다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "duck",
      "title": "아기 오리의 연못",
      "subtitle": "물가에서 꼼짝 안 해요",
      "clue": {
        "name": "오리의 물갈퀴 장화",
        "x": 32,
        "y": 22
      },
      "boss": {
        "name": "퐁퐁 수련 방울",
        "symbol": "bubble",
        "description": "수련 사이를 맴도는 큰 비눗방울. 멈춘 뒤 작은 방울을 띄우는 전투 입문 소품."
      },
      "intro": [
        {
          "speaker": "아기 오리",
          "text": "“나도 첨벙 놀이 하고 싶은데…” 회색 아기 오리만 물가에서 발을 꼼지락거려요.",
          "artId": "duck-before",
          "caption": "혼자 남은 물가",
          "emotion": "tender"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“아끼는 장화가 없어졌구나!” 진흙 발자국이 수련 쪽에서 뚝 끊겼어요.",
          "artId": "duck-twist",
          "caption": "물에 뜬 작은 발자국",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“수련 사이부터 살펴보자.” 연못을 조금씩 밝히면 노란 장화 한 켤레를 찾을 수 있어요.",
          "artId": "duck-challenge",
          "caption": "두 번째 수사 · 장화를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "아기 오리",
          "text": "“내 장화다!” 수련 뒤에서 작은 오리들이 장화를 배처럼 타고 있었어요.",
          "artId": "duck-solved",
          "caption": "장화 배가 있었네요",
          "emotion": "silly"
        },
        {
          "speaker": "아기 오리",
          "text": "“그럼 번갈아 타자!” 장화를 돌려받은 오리가 친구들을 불러요. 토끼도 한 발 첨벙!",
          "artId": "duck-wink",
          "caption": "우리 모두의 첨벙 놀이",
          "emotion": "joy"
        }
      ],
      "restored": "토끼 탐정이 수련을 살펴 노란 물갈퀴 장화 한 켤레를 발견한다. 작은 오리 두 마리가 장화를 각각 배처럼 타고 있다.",
      "index": 2,
      "pairIndex": 0,
      "twist": "“나도 첨벙 놀이 하고 싶은데…” 회색 아기 오리만 물가에서 발을 꼼지락거려요. “아끼는 장화가 없어졌구나!” 진흙 발자국이 수련 쪽에서 뚝 끊겼어요.",
      "art": {
        "filename": "duck.jpg",
        "prompt": "토끼 탐정이 수련을 살펴 노란 물갈퀴 장화 한 켤레를 발견한다. 작은 오리 두 마리가 장화를 각각 배처럼 타고 있다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "pigs",
      "title": "아기 돼지 삼 형제",
      "subtitle": "문이 왜 천장에 있지?",
      "clue": {
        "name": "벽돌집 설계도",
        "x": 40,
        "y": 26
      },
      "boss": {
        "name": "팔랑팔랑 벽돌 바람개비",
        "symbol": "brick",
        "description": "공사장에 남은 말랑한 벽돌 모양 바람개비. 네모 방울을 일정한 방향으로 흩뿌린다."
      },
      "intro": [
        {
          "speaker": "아기 돼지",
          "text": "“문은 여기였나?” 삼 형제가 벽돌집을 짓는데 문틀이 천장을 보고 있어요.",
          "artId": "pigs-before",
          "caption": "들어가려면 폴짝 뛰어야 해?",
          "emotion": "silly"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“설계도가 없어졌구나!” 바람에 날린 종이 조각이 벽돌 사이에 보여요.",
          "artId": "pigs-twist",
          "caption": "기억만 믿고 지었더니",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“벽돌을 쌓기 전에 그림부터 찾자.” 공사장을 밝혀 집 모양 설계도를 찾아요.",
          "artId": "pigs-challenge",
          "caption": "세 번째 수사 · 설계도를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "아기 돼지",
          "text": "“설계도 찾았다!” 막내가 햇빛을 가리려고 머리에 쓰고 있었어요.",
          "artId": "pigs-solved",
          "caption": "근사한 종이 모자인 줄 알았네",
          "emotion": "silly"
        },
        {
          "speaker": "아기 돼지",
          "text": "문이 제자리에 생겼어요. “어서 와!” 토끼가 말해요. “이번엔 점프 안 해도 되네!”",
          "artId": "pigs-wink",
          "caption": "함께 들어갈 수 있는 집",
          "emotion": "joy"
        }
      ],
      "restored": "토끼 탐정과 막내 돼지가 이미 펼쳐 놓은 집 설계도를 함께 살펴본다. 설계도에는 집 그림만 있고 글자는 없다. 종이는 펼쳐진 한 장이며 별도의 종이 모자는 없다.",
      "index": 3,
      "pairIndex": 0,
      "twist": "“문은 여기였나?” 삼 형제가 벽돌집을 짓는데 문틀이 천장을 보고 있어요. “설계도가 없어졌구나!” 바람에 날린 종이 조각이 벽돌 사이에 보여요.",
      "art": {
        "filename": "pigs.jpg",
        "prompt": "토끼 탐정과 막내 돼지가 이미 펼쳐 놓은 집 설계도를 함께 살펴본다. 설계도에는 집 그림만 있고 글자는 없다. 종이는 펼쳐진 한 장이며 별도의 종이 모자는 없다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "redhood",
      "title": "빨간 모자의 심부름",
      "subtitle": "할머니도 못 여는 문",
      "clue": {
        "name": "할머니 집 열쇠",
        "x": 34,
        "y": 25
      },
      "boss": {
        "name": "빙글빙글 빵 바구니",
        "symbol": "basket",
        "description": "정원에서 돌아다니는 빵 바구니. 멈춰 예고한 뒤 짧게 직선으로 달리거나 한 방향으로 빵가루 방울을 조준해 보낸다."
      },
      "intro": [
        {
          "speaker": "빨간 모자",
          "text": "“할머니, 빵 가져왔어요!” 그런데 할머니도 창문으로만 빼꼼 내다봐요.",
          "artId": "redhood-before",
          "caption": "둘 다 문 앞에서 기다려요",
          "emotion": "silly"
        },
        {
          "speaker": "할머니",
          "text": "“꽃에 물 주고 왔더니 열쇠가 없구나.” 토끼가 화분 옆 반짝 자국을 발견했어요.",
          "artId": "redhood-twist",
          "caption": "열쇠도 정원에 놀러 갔나?",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“정원을 같이 찾아보자.” 꽃밭을 선으로 감싸 밝히면 작은 열쇠가 보일 거예요.",
          "artId": "redhood-challenge",
          "caption": "네 번째 수사 · 열쇠를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "할머니",
          "text": "“열쇠가 화분에 꽂혀 있었네!” 토끼가 건네자 문이 딸깍 열려요.",
          "artId": "redhood-solved",
          "caption": "꽃 이름표가 아니었어요",
          "emotion": "silly"
        },
        {
          "speaker": "할머니",
          "text": "“어서 들어오렴!” 토끼가 웃어요. “빵 식기 전에 수사 끝!” 함께 간식을 나눠요.",
          "artId": "redhood-wink",
          "caption": "찾고 나니 더 맛있는 빵",
          "emotion": "joy"
        }
      ],
      "restored": "토끼 탐정이 화분에서 작은 둥근 열쇠를 발견한다. 열쇠는 꽃 이름표처럼 화분 흙에 꽂혀 있다.",
      "index": 4,
      "pairIndex": 1,
      "twist": "“할머니, 빵 가져왔어요!” 그런데 할머니도 창문으로만 빼꼼 내다봐요. “꽃에 물 주고 왔더니 열쇠가 없구나.” 토끼가 화분 옆 반짝 자국을 발견했어요.",
      "art": {
        "filename": "redhood.jpg",
        "prompt": "토끼 탐정이 화분에서 작은 둥근 열쇠를 발견한다. 열쇠는 꽃 이름표처럼 화분 흙에 꽂혀 있다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "beans",
      "title": "잭과 콩나무",
      "subtitle": "구름 위에 아무도 없나요?",
      "clue": {
        "name": "콩나무 꼭대기 종",
        "x": 38,
        "y": 20
      },
      "boss": {
        "name": "둥실둥실 구름 물뿌리개",
        "symbol": "wateringcan",
        "description": "구름을 씻다가 시야를 가린 물뿌리개. 멈춰 열린 물방울 고리와 한 방향 방울을 예고한 뒤 뿌린다."
      },
      "intro": [
        {
          "speaker": "잭",
          "text": "“계세요?” 콩나무 꼭대기 집에서 아무 대답이 없어요. 안에서는 킁킁, 맛있는 냄새가 나요.",
          "artId": "beans-before",
          "caption": "분명 누가 있는 것 같은데",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“문 옆에 종을 매단 끈만 남았네.” 구름 사이에 둥근 자국이 이어져 있어요.",
          "artId": "beans-twist",
          "caption": "목소리가 너무 작았나 봐",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“집주인에게 우리가 왔다고 알려 주자.” 넓은 잎과 구름을 밝혀 사라진 종을 찾아요.",
          "artId": "beans-challenge",
          "caption": "다섯 번째 수사 · 종을 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "잭",
          "text": "“찾았다!” 작은 구름이 종을 모자로 쓰고 있었어요. 돌려받아 땡땡 울렸어요.",
          "artId": "beans-solved",
          "caption": "구름 모자를 벗겨 보니",
          "emotion": "silly"
        },
        {
          "speaker": "친절한 거인",
          "text": "“손님이 왔구나!” 커다란 쿠키가 나와요. 토끼가 속삭여요. “이건 귀보다 크네!”",
          "artId": "beans-wink",
          "caption": "우리 목소리가 닿았어요",
          "emotion": "joy"
        }
      ],
      "restored": "넓은 콩나무 잎 위 토끼 탐정이 작은 구름의 모자처럼 얹힌 종을 발견한다. 종은 아직 집의 문에 달리지 않았다.",
      "index": 5,
      "pairIndex": 1,
      "twist": "“계세요?” 콩나무 꼭대기 집에서 아무 대답이 없어요. 안에서는 킁킁, 맛있는 냄새가 나요. “문 옆에 종을 매단 끈만 남았네.” 구름 사이에 둥근 자국이 이어져 있어요.",
      "art": {
        "filename": "beans.jpg",
        "prompt": "넓은 콩나무 잎 위 토끼 탐정이 작은 구름의 모자처럼 얹힌 종을 발견한다. 종은 아직 집의 문에 달리지 않았다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "ant",
      "title": "개미와 베짱이",
      "subtitle": "문 없는 겨울 창고?",
      "clue": {
        "name": "개미 창고 손잡이",
        "x": 30,
        "y": 27
      },
      "boss": {
        "name": "또르르 도토리 북",
        "symbol": "acorn",
        "description": "창고 앞에서 굴러다니는 장난감 도토리 북. 멈춰 박자를 예고한 뒤 가느다란 빛줄기와 부채꼴 씨앗 방울을 번갈아 보낸다."
      },
      "intro": [
        {
          "speaker": "개미",
          "text": "“먹을 건 가득한데 못 열겠어!” 겨울 잔치를 앞두고 창고 문만 꼭 닫혀 있어요.",
          "artId": "ant-before",
          "caption": "배고픈 손님이 줄을 섰어요",
          "emotion": "curious"
        },
        {
          "speaker": "베짱이",
          "text": "“문에 잡을 데가 없네?” 토끼가 손잡이가 빠진 동그란 구멍을 살펴봐요.",
          "artId": "ant-twist",
          "caption": "창고 앞의 동그란 단서",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“곡식 더미 옆부터 찾아보자.” 창고 마당을 밝히면 빠진 손잡이가 나타날 거예요.",
          "artId": "ant-challenge",
          "caption": "여섯 번째 수사 · 손잡이를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "베짱이",
          "text": "곡식 바구니 옆에서 찾았어요! “이게 손잡이였어?” 베짱이가 작은 훌라후프를 건네요.",
          "artId": "ant-solved",
          "caption": "허리춤에 있었던 단서",
          "emotion": "silly"
        },
        {
          "speaker": "개미",
          "text": "“문이 열렸다! 같이 먹자!” 베짱이가 잔치 음악을 켜요. 토끼의 귀도 박자를 타요.",
          "artId": "ant-wink",
          "caption": "먹을 것과 음악을 나눠요",
          "emotion": "joy"
        }
      ],
      "restored": "토끼 탐정이 베짱이의 작은 훌라후프가 창고 손잡이임을 알아챈다. 둥근 손잡이가 곡식 바구니 옆에서 분명하게 보인다.",
      "index": 6,
      "pairIndex": 1,
      "twist": "“먹을 건 가득한데 못 열겠어!” 겨울 잔치를 앞두고 창고 문만 꼭 닫혀 있어요. “문에 잡을 데가 없네?” 토끼가 손잡이가 빠진 동그란 구멍을 살펴봐요.",
      "art": {
        "filename": "ant.jpg",
        "prompt": "토끼 탐정이 베짱이의 작은 훌라후프가 창고 손잡이임을 알아챈다. 둥근 손잡이가 곡식 바구니 옆에서 분명하게 보인다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "lion",
      "title": "사자와 생쥐",
      "subtitle": "낮잠이 너무 꽉 끼어요",
      "clue": {
        "name": "생쥐의 작은 가위",
        "x": 42,
        "y": 23
      },
      "boss": {
        "name": "통통 매듭 공",
        "symbol": "knot",
        "description": "느슨한 밧줄이 둥글게 뭉친 매듭 공. 멈춰 예고한 뒤 조준 방울, 짧은 직선 돌진, 빛줄기를 번갈아 내보낸다."
      },
      "intro": [
        {
          "speaker": "사자",
          "text": "“하암… 일어나려는데 안 되네.” 넓은 그물 침대가 사자 발에 살짝 걸렸어요.",
          "artId": "lion-before",
          "caption": "기지개가 중간에 멈췄어요",
          "emotion": "silly"
        },
        {
          "speaker": "생쥐",
          "text": "“매듭을 자를 작은 가위가 없어!” 토끼가 풀밭에 찍힌 가위 모양 자국을 봐요.",
          "artId": "lion-twist",
          "caption": "큰 친구를 도울 작은 도구",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“서두르지 말고 옆에서 기다려 줘.” 풀밭을 밝혀 둥근 끝 가위를 찾아요.",
          "artId": "lion-challenge",
          "caption": "일곱 번째 수사 · 가위를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "생쥐",
          "text": "“잎 아래 있었네!” 가위를 찾은 생쥐가 늘어진 매듭을 싹둑 잘라 줘요.",
          "artId": "lion-solved",
          "caption": "작은 도움이 큰 기지개로",
          "emotion": "proud"
        },
        {
          "speaker": "사자",
          "text": "“고마워! 이번엔 바닥에서 잘게.” 누우니 벌써 드르렁! 토끼와 생쥐가 킥 웃어요.",
          "artId": "lion-wink",
          "caption": "수사 끝, 낮잠은 계속",
          "emotion": "silly"
        }
      ],
      "restored": "토끼 탐정이 풀밭의 잎 한 장 아래에서 둥근 끝의 작은 공예 가위를 발견한다. 가위는 놓여 있으며 사자는 배경에서 편하게 기다린다.",
      "index": 7,
      "pairIndex": 2,
      "twist": "“하암… 일어나려는데 안 되네.” 넓은 그물 침대가 사자 발에 살짝 걸렸어요. “매듭을 자를 작은 가위가 없어!” 토끼가 풀밭에 찍힌 가위 모양 자국을 봐요.",
      "art": {
        "filename": "lion.jpg",
        "prompt": "토끼 탐정이 풀밭의 잎 한 장 아래에서 둥근 끝의 작은 공예 가위를 발견한다. 가위는 놓여 있으며 사자는 배경에서 편하게 기다린다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "fox",
      "title": "여우와 포도",
      "subtitle": "안 먹는 걸까, 못 먹는 걸까?",
      "clue": {
        "name": "포도밭 사다리",
        "x": 35,
        "y": 21
      },
      "boss": {
        "name": "톡톡 포도 방울",
        "symbol": "grapes",
        "description": "포도송이 모양 풍선. 멈춰 예고한 뒤 열린 방울 고리, 빛줄기, 부채꼴 열매 방울을 번갈아 내보낸다."
      },
      "intro": [
        {
          "speaker": "여우",
          "text": "“흥, 저 포도는 분명 셔!” 그런데 여우의 배에서는 꼬르륵 소리가 나요.",
          "artId": "fox-before",
          "caption": "말과 배가 다르게 말해요",
          "emotion": "silly"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“여기 사다리가 있었지?” 덩굴 밑에 길쭉한 자국이 두 줄 남아 있어요.",
          "artId": "fox-twist",
          "caption": "폴짝 뛰어도 닿지 않는 포도",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“함께 따 먹으면 되잖아.” 덩굴 아래를 밝혀 낮고 튼튼한 사다리를 찾아요.",
          "artId": "fox-challenge",
          "caption": "여덟 번째 수사 · 사다리를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "여우",
          "text": "“찾았어!” 옆으로 누운 사다리에서 새들이 벤치처럼 쉬고 있었어요.",
          "artId": "fox-solved",
          "caption": "포도밭의 긴 의자",
          "emotion": "silly"
        },
        {
          "speaker": "여우",
          "text": "한 송이 나눠 먹더니 여우가 웃어요. “음… 아까보다 달아졌네?” 토끼가 너를 보고 씩!",
          "artId": "fox-wink",
          "caption": "같이 먹으니 솔직해져요",
          "emotion": "joy"
        }
      ],
      "restored": "토끼 탐정이 포도 덩굴 밑에 옆으로 놓인 낮은 사다리를 발견한다. 작은 새 둘이 사다리를 긴 벤치로 쓰고 있다.",
      "index": 8,
      "pairIndex": 2,
      "twist": "“흥, 저 포도는 분명 셔!” 그런데 여우의 배에서는 꼬르륵 소리가 나요. “여기 사다리가 있었지?” 덩굴 밑에 길쭉한 자국이 두 줄 남아 있어요.",
      "art": {
        "filename": "fox.jpg",
        "prompt": "토끼 탐정이 포도 덩굴 밑에 옆으로 놓인 낮은 사다리를 발견한다. 작은 새 둘이 사다리를 긴 벤치로 쓰고 있다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "wind",
      "title": "해와 바람",
      "subtitle": "모자도 함께 가고 싶어",
      "clue": {
        "name": "나그네의 모자 끈",
        "x": 39,
        "y": 27
      },
      "boss": {
        "name": "빙글 바람 구름",
        "symbol": "wind",
        "description": "동그란 바람 구름. 멈춰 예고한 뒤 부채꼴 방울, 짧은 직선 돌진, 열린 바람 고리를 번갈아 내보낸다."
      },
      "intro": [
        {
          "speaker": "바람",
          "text": "“내가 먼저 인사할래!” 후우 불었더니 나그네가 모자만 꼭 붙잡고 있어요.",
          "artId": "wind-before",
          "caption": "반가운 인사가 너무 세요",
          "emotion": "silly"
        },
        {
          "speaker": "해",
          "text": "“모자 끈이 없어서 그런가 봐.” 토끼가 길가의 길쭉한 리본 자국을 찾아요.",
          "artId": "wind-twist",
          "caption": "손을 흔들 수 없는 이유",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“바람아, 잠깐만 살살 불어 줘.” 들판을 밝혀 모자 끈을 찾아 다시 묶어 줘요.",
          "artId": "wind-challenge",
          "caption": "아홉 번째 수사 · 모자 끈을 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "나그네",
          "text": "“내 끈이다!” 꽃줄기 사이에서 찾았어요. 토끼가 묶어 주자 두 손이 편해졌어요.",
          "artId": "wind-solved",
          "caption": "모자도 자리를 찾았어요",
          "emotion": "joy"
        },
        {
          "speaker": "바람 · 해",
          "text": "살랑 바람, 따뜻한 햇살에 나그네가 손을 흔들어요. “둘이 같이 인사하니 좋네!”",
          "artId": "wind-wink",
          "caption": "이긴 친구 대신 함께 웃는 친구",
          "emotion": "tender"
        }
      ],
      "restored": "토끼 탐정이 들꽃 줄기 사이에 걸린 모자 끈을 발견한다. 넓고 짧은 부드러운 끈이며 목이나 몸에 감겨 있지 않다.",
      "index": 9,
      "pairIndex": 2,
      "twist": "“내가 먼저 인사할래!” 후우 불었더니 나그네가 모자만 꼭 붙잡고 있어요. “모자 끈이 없어서 그런가 봐.” 토끼가 길가의 길쭉한 리본 자국을 찾아요.",
      "art": {
        "filename": "wind.jpg",
        "prompt": "토끼 탐정이 들꽃 줄기 사이에 걸린 모자 끈을 발견한다. 넓고 짧은 부드러운 끈이며 목이나 몸에 감겨 있지 않다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "ax",
      "title": "금도끼 은도끼",
      "subtitle": "반짝이는 건 너무 무거워",
      "clue": {
        "name": "나무꾼의 쇠도끼",
        "x": 31,
        "y": 23
      },
      "boss": {
        "name": "반짝 연못 돌림판",
        "symbol": "pond",
        "description": "연못의 둥근 빛 물결. 멈춰 예고한 뒤 금빛과 은빛 조준 방울, 빛줄기, 열린 물결 고리를 번갈아 내보낸다."
      },
      "intro": [
        {
          "speaker": "나무꾼",
          "text": "“금도끼도 은도끼도 제 것이 아니에요.” 너무 무거워 들지도 못하고 있어요.",
          "artId": "ax-before",
          "caption": "멋있어도 내 손엔 안 맞아요",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“손에 익은 쇠도끼를 찾는 거구나.” 연못가 진흙에 짧은 손잡이 자국이 보여요.",
          "artId": "ax-twist",
          "caption": "반짝임보다 중요한 것",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“물가를 한 조각씩 살펴보자.” 맑아지는 연못 그림에서 둥근 쇠도끼를 찾아요.",
          "artId": "ax-challenge",
          "caption": "열 번째 수사 · 쇠도끼를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "나무꾼",
          "text": "“제 도끼예요!” 물풀 위에서 찾았어요. 나무꾼이 익숙한 손잡이를 꼭 잡아요.",
          "artId": "ax-solved",
          "caption": "내 손에 딱 맞는 도구",
          "emotion": "proud"
        },
        {
          "speaker": "연못 친구",
          "text": "“금도끼는 문진으로 쓸까?” 바람에 날리던 수사 종이가 딱 멈춰요. 토끼가 엄지를 쏙!",
          "artId": "ax-wink",
          "caption": "반짝이는 도구의 새 일자리",
          "emotion": "silly"
        }
      ],
      "restored": "토끼 탐정이 연못 가장자리의 물풀 위에 놓인 나무꾼의 작은 쇠도끼를 발견한다. 도끼 날은 둥글고 도구가 사람을 향하지 않는다.",
      "index": 10,
      "pairIndex": 3,
      "twist": "“금도끼도 은도끼도 제 것이 아니에요.” 너무 무거워 들지도 못하고 있어요. “손에 익은 쇠도끼를 찾는 거구나.” 연못가 진흙에 짧은 손잡이 자국이 보여요.",
      "art": {
        "filename": "ax.jpg",
        "prompt": "토끼 탐정이 연못 가장자리의 물풀 위에 놓인 나무꾼의 작은 쇠도끼를 발견한다. 도끼 날은 둥글고 도구가 사람을 향하지 않는다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "piper",
      "title": "피리 부는 사나이",
      "subtitle": "삐이 대신 푸우우",
      "clue": {
        "name": "피리 마개",
        "x": 41,
        "y": 25
      },
      "boss": {
        "name": "통통 박자 북",
        "symbol": "drum",
        "description": "마을 악단의 둥근 장난감 북. 멈춰 예고한 뒤 열린 고리, 부채꼴 방울, 조준 방울, 짧은 직선 돌진을 박자에 맞춰 번갈아 보낸다."
      },
      "intro": [
        {
          "speaker": "피리 연주자",
          "text": "“행진곡, 시작!” 그런데 피리에서 푸우우… 바람 소리만 나요. 쥐 악단도 멈췄어요.",
          "artId": "piper-before",
          "caption": "첫 음부터 이상한 행진",
          "emotion": "silly"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“끝에 있던 마개가 빠졌네.” 작은 동그라미 자국이 악보 옆에 찍혀 있어요.",
          "artId": "piper-twist",
          "caption": "노래에 빠진 한 조각",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“연습하던 광장부터 찾아보자.” 광장을 밝히면 작은 피리 마개가 나타날 거예요.",
          "artId": "piper-challenge",
          "caption": "열한 번째 수사 · 마개를 찾아요",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "꼬마 쥐",
          "text": "광장의 북채 받침에서 찾았어요! 꼬마 쥐가 마개를 돌려주자 피리에서 맑은 첫 음이 나요.",
          "artId": "piper-solved",
          "caption": "찾았다, 노래의 첫 조각",
          "emotion": "joy"
        },
        {
          "speaker": "피리 연주자",
          "text": "모두 원해서 행진에 따라나서요. 토끼도 걷는데 귀가 먼저 박자를 타네요!",
          "artId": "piper-wink",
          "caption": "같이 연주하는 마을 잔치",
          "emotion": "silly"
        }
      ],
      "restored": "토끼 탐정이 광장 바닥의 작은 북채를 받치고 있는 둥근 피리 마개를 발견한다. 꼬마 쥐가 곁에서 놀란다.",
      "index": 11,
      "pairIndex": 3,
      "twist": "“행진곡, 시작!” 그런데 피리에서 푸우우… 바람 소리만 나요. 쥐 악단도 멈췄어요. “끝에 있던 마개가 빠졌네.” 작은 동그라미 자국이 악보 옆에 찍혀 있어요.",
      "art": {
        "filename": "piper.jpg",
        "prompt": "토끼 탐정이 광장 바닥의 작은 북채를 받치고 있는 둥근 피리 마개를 발견한다. 꼬마 쥐가 곁에서 놀란다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    },
    {
      "id": "troy",
      "title": "트로이의 오리",
      "subtitle": "깜짝 인사가 안 열려요",
      "clue": {
        "name": "트로이 오리의 문 손잡이",
        "x": 36,
        "y": 28
      },
      "boss": {
        "name": "꽥꽥 나무 오리",
        "symbol": "woodduck",
        "description": "친구들이 꾸민 커다란 나무 오리 잔치 수레. 멈춰 예고한 뒤 네 갈래 반짝 빛줄기, 열린 방울 고리, 짧은 직선 돌진, 부채꼴 색종이 방울을 번갈아 보낸다. 군사나 싸움 장면 없이 축하 소품으로 표현한다."
      },
      "intro": [
        {
          "speaker": "나무 오리 속 친구들",
          "text": "“깜짝이야, 하려고 했는데… 문이 안 열려!” 커다란 나무 오리에서 꽥꽥 웃음이 나요.",
          "artId": "troy-before",
          "caption": "마지막 사건 · 안 나오는 깜짝 선물",
          "emotion": "silly"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“바깥 손잡이가 빠졌구나!” 수레바퀴 옆에 둥근 자국이 반짝여요.",
          "artId": "troy-twist",
          "caption": "오리가 말을 하는 건 아니었네",
          "emotion": "curious"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“함께 인사할 수 있게 찾아보자!” 잔치 마당을 밝히고 나무 오리 손잡이를 찾아요.",
          "artId": "troy-challenge",
          "caption": "열두 번째 수사 · 마지막 손잡이",
          "emotion": "encourage"
        }
      ],
      "win": [
        {
          "speaker": "친구들",
          "text": "색종이 밑에서 찾은 손잡이를 달자 문이 활짝! “깜짝이야!” 친구들이 나와 토끼를 반겨요.",
          "artId": "troy-solved",
          "caption": "찾았다, 모두의 마지막 조각",
          "emotion": "joy"
        },
        {
          "speaker": "토끼 탐정",
          "text": "“이번 수사의 진짜 탐정은 너야.” 토끼가 너에게 윙크해요. 그런데 오리 수레가 한 번 더 꽥!",
          "artId": "troy-wink",
          "caption": "끝까지 함께 찾아 줘서 고마워",
          "emotion": "tender"
        }
      ],
      "restored": "토끼 탐정이 잔치 수레바퀴 옆 색종이 더미에서 오리 문 손잡이를 발견한다. 나무 오리의 옆문은 아직 닫혀 있지만 넓은 환기창에서 친구들이 편하게 손을 흔든다.",
      "index": 12,
      "pairIndex": 3,
      "twist": "“깜짝이야, 하려고 했는데… 문이 안 열려!” 커다란 나무 오리에서 꽥꽥 웃음이 나요. “바깥 손잡이가 빠졌구나!” 수레바퀴 옆에 둥근 자국이 반짝여요.",
      "art": {
        "filename": "troy.jpg",
        "prompt": "토끼 탐정이 잔치 수레바퀴 옆 색종이 더미에서 오리 문 손잡이를 발견한다. 나무 오리의 옆문은 아직 닫혀 있지만 넓은 환기창에서 친구들이 편하게 손을 흔든다. Warm original gouache children's detective picture book. The clue is clear near the central safe area. One brown rabbit with exactly two ears and a teal scarf, without a bag. No text, numbers, UI or logos. Horizontal 3:2."
      }
    }
  ]
};

export default STORY;
