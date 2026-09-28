# 게임 통합 저장소 관리

이 저장소는 ‘토끼 탐정과 열두 동화 사건’ 전용이다. 상위 MovieBookingWatcher 업무 프로그램은 포함하지 않는다. 최초 기준판은 v4.1.0이며 main 브랜치와 v4.1.0 태그로 보관한다.

## 파일 위치

| 자료 | 경로 | 관리 내용 |
|---|---|---|
| 게임 소스 | src/ | 규칙 엔진(src/game), 화면, 연출(fx), 저장, 스토리 데이터, 음악 악보·합성 코드 |
| Windows 앱 | electron/, vite.config.js, index.html | exe 창과 빌드 설정 |
| 사건 그림 | assets/detective/ | 12개 사건의 여섯 컷 시트, 가족 장면 2장, PNG 원본과 JPEG, 패널 좌표 frames.json |
| v5 그림 (게임용) | assets/v5/ | 게임판 배경(boards), 스토리(story), 배경을 지운 캐릭터·보스·탄(sprites)과 스티커(stickers) |
| v5 그림 원본 | assets/v5-source/ | AI로 만든 원본. `npm run sprites`가 배경을 지워 assets/v5로 만든다. 게임에 직접 들어가지 않음 |
| 음악 | src/audio.js | 다섯 곡의 악보와 Web Audio 연주, 효과음 코드 |
| 기획 | docs/ | roadmap-v5(계획·진행), story-bible(이야기·또롱), art-prompts-v5(그림 프롬프트), audio-notes |
| 지난 기록 | docs/archive/ | v2~v4 기획·QA·밸런스·아트 기록 (참고용) |
| 자동 검사 | tests/ | 엔진·이동·보스·연출·보상·저장·화면 검사 |
| 제작 도구 | scripts/ | 그림 변환(prepare-art, prepare-sprites), 프롬프트 문서 생성(art-prompts) |
| 화면 스타일 | style.css | 게임 화면과 그림책 레이아웃 |

v2·v3 시절 그림(assets/story, 공주 동화 등)과 음악 미리듣기 WAV는 v5 정리 때 저장소에서 뺐다. 필요하면 Git 기록(v4.1.0 태그 이전 커밋)에서 꺼낼 수 있다.

## 커밋에 포함하는 것

사용 중인 그림과 그 원본, 코드, 기획서, 테스트, 제작 도구를 포함한다. 이미지는 일반 Git 바이너리로 저장하며 Git LFS 설치 없이 체크아웃할 수 있다.

dist/, release/, node_modules/는 빌드·설치 결과라 추적하지 않는다. 개인 진행 저장, ZIP, 로컬 환경 설정도 제외한다.

## 다음 변경 저장

```powershell
git status
npm test
git add src assets docs tests scripts electron style.css index.html package.json package-lock.json README.md
```

새 경로의 파일은 의도한 경로를 git add에 추가한다. 완료판을 남길 때에는 package.json 버전을 올리고 새 버전 태그를 만든다. 기존 태그는 덮어쓰지 않는다.

## GitHub 원격 백업

원격 origin은 https://github.com/julongjulong/storybook-dream.git 이다. main 브랜치는 origin/main을 추적한다. 최초 게임 커밋과 v4.1.0 태그를 업로드했다.

커밋은 PC에 기록되고, git push까지 실행하면 GitHub에도 반영된다. 새 버전 태그는 git push origin 태그이름으로 별도 올린다.

다른 PC에서 작업을 이어가려면 다음 순서로 받는다.

```powershell
git clone https://github.com/julongjulong/storybook-dream.git
cd storybook-dream
npm install
npm test
```

이미 받은 PC에서는 작업 시작 전에 git pull --ff-only로 최신 커밋을 받는다. package.json이 바뀌었으면 npm install을 다시 실행한다.
