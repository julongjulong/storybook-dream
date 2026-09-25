# 게임 통합 저장소 관리

이 저장소는 ‘토끼 탐정과 열두 동화 사건’ 전용이다. 상위 MovieBookingWatcher 업무 프로그램은 포함하지 않는다. 최초 기준판은 v4.1.0이며 main 브랜치와 v4.1.0 태그로 보관한다.

## 파일 위치

| 자료 | 경로 | 관리 내용 |
|---|---|---|
| 게임 소스 | src/ | 전투 엔진, 화면, 저장, 스토리 데이터, 음악 악보·합성 코드 |
| 최신 디자인 | assets/detective/ | 12개 사건의 여섯 컷 시트, 가족 장면 2장, PNG 원본과 JPEG, 패널 좌표 frames.json |
| 이전 디자인 | assets/의 그림 및 assets/story/ | 이전 버전 그림과 시안. 현재판에서 사용하지 않아도 이력 자료로 보관 |
| 음악 원본 | src/audio.js | 다섯 곡의 악보와 Web Audio 연주, 효과음 코드 |
| 음악 미리듣기 | output/audio/ | dream, play, celebrate, boss, morning WAV 5곡 |
| 기획·검수 | docs/ | game-design, story-bible, balance-v4.1, QA-v4.1, 아트·오디오 제작 기록 |
| 자동 검사 | tests/ | 엔진·저장·화면·음악·포장 검사 |
| 제작 도구 | scripts/ | 그림 변환, 내장, HTML 빌드, 배포 검증과 압축 |
| 화면 스타일 | style.css | 게임 화면과 그림책 레이아웃 |

현재 디자인 원본은 PNG이다. PSD/AI 같은 레이어 편집 원본은 아직 없다. WAV는 미리듣기이며 실제 게임은 audio.js의 악보를 합성해 재생한다. 음악 수정 시 코드와 제작 문서를 함께 갱신하고, 미리듣기도 바뀐 곡과 맞춰 갱신한다.

## 처음 받은 저장소 실행

Node.js가 설치된 개발 PC에서 저장소 폴더를 열고 다음 순서로 실행한다.

```powershell
npm install
npm test
npm run dev
```

`npm run dev`는 http://localhost:4181 에 개발 서버를 띄운다. Windows 앱으로 확인하려면 `npm run app`, 배포용 exe는 `npm run dist`(release/ 폴더)다.

PNG를 바꿨다면 Windows PowerShell에서 `./scripts/prepare-art.ps1`로 JPEG를 먼저 갱신한다. 새 시트의 패널 경계가 달라졌다면 frames.json도 함께 수정한다.

## 커밋에 포함하는 것

원본/사용 중인 이미지, WAV 5곡, 코드, 기획서, 테스트, 제작 도구를 포함한다. 이미지는 일반 Git 바이너리로 저장하며 Git LFS 설치 없이 체크아웃할 수 있다.

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
