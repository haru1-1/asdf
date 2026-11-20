# 삼국지 : 천하의 서막

브라우저에서 API 키나 외부 서버 없이 바로 실행할 수 있는 삼국지 턴제 전략 게임입니다.

## 파일 구성
- `index.html`: 메인 화면, 튜토리얼·전투·엔딩 모달
- `style.css`: 어두운 남색·금색 테마, 3D 디오라마 연출, PC/모바일 반응형
- `assets.js`: 성·전장·인물 이미지 및 음악·효과음 연결 설정
- `audio.js`: 배경음악 및 버튼·전투 효과음 제어
- `game.js`: 턴 진행, 내정, 외교, 연구 트리, 전투 계산, AI, 자동 저장

## GitHub Pages 배포 방법
1. GitHub에 새 저장소(Repository)를 만듭니다.
2. 압축을 푼 6개 파일을 저장소 최상위(root)에 업로드합니다.
3. 저장소의 **Settings > Pages**에서 Source를 `Deploy from a branch`, Branch를 `main` / `/ (root)`로 설정하고 저장합니다.
4. 잠시 후 생성되는 주소로 PC와 모바일에서 바로 접속할 수 있습니다.

## 직접 만든 이미지·음원 연결
`assets.js` 상단의 `CUSTOM_ASSETS` 객체에 파일 경로(예: `./images/chengdu.png`, `./audio/bgm.mp3`)를 입력하면 기본 SVG/Web Audio 대신 해당 파일이 사용됩니다.
