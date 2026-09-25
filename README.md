# PuzzlePuzzle Website

React + Vite 기반의 퍼즐 매장 웹사이트입니다.

## 로컬 실행

현재 저장소는 `bun.lock`을 기준으로 관리합니다. Bun을 사용할 수 없는 환경에서는 `npm install --no-package-lock`을 임시 대체 수단으로 사용할 수 있습니다.

```bash
bun install
bun run dev
```

검사와 빌드:

```bash
bun run lint
bun run build
```

빌드 결과는 `dist/`에 생성됩니다.

Pages Functions와 로컬 D1을 함께 확인하려면 먼저 migration을 적용한 뒤 Pages 개발 서버를 실행합니다.

```bash
npm run db:migrate:local
npm run dev:pages
```

서버가 실행되면 `/api/health`는 Pages Function과 D1 연결 상태를 반환합니다.

## Cloudflare Pages 배포

현재 앱은 정적 Vite SPA이므로 Cloudflare Pages로 먼저 배포합니다.

Cloudflare 대시보드에서 다음 값을 사용합니다.

- Production branch: `main`
- Build command: `bun run build`
- Build output directory: `dist`
- Root directory: `/`

Bun을 Cloudflare 빌드 환경에서 사용할 수 없다면 Build command를 `npm install --no-package-lock && npm run build`로 설정할 수 있습니다. 장기적으로는 Bun 지원 여부를 확인한 뒤 하나의 패키지 매니저를 표준으로 정해야 합니다.

`public/_redirects`는 `/pz_admin` 같은 SPA 경로를 새로고침할 때 `index.html`로 전달합니다. `public/_headers`는 Pages 배포 결과에 기본 보안 헤더와 정적 자산 캐시 정책을 적용합니다.

## 환경 변수와 비밀값

현재 브라우저 앱에서는 `GEMINI_API_KEY`를 사용하지 않습니다. Gemini 또는 예약 API를 추가할 때 키를 `VITE_*` 변수로 만들거나 프런트엔드 코드에 넣으면 안 됩니다. Cloudflare Pages Functions/Workers의 Secret으로 저장하고 서버에서만 사용해야 합니다.

`APP_URL`도 서버 콜백이나 canonical URL이 실제로 필요할 때 Production 환경 변수로 설정합니다.

## 현재 운영 범위

로컬 개발 환경에서는 Pages Functions와 D1을 사용해 게임별 예약 가능 시간 조회, 중복 슬롯 방지 예약 요청, 관리자 세션 인증을 검증할 수 있습니다. 현재 Cloudflare Pages 배포에 연결된 D1 binding과 실제 매장 seed 데이터는 아직 준비 전이므로, 배포된 사이트를 운영용 예약 시스템으로 사용하기 전에는 Preview/Production D1을 만들고 migrations, approved content seed, 관리자 계정을 적용해야 합니다.

## 사용자가 해야 할 Cloudflare 작업

1. Cloudflare 계정을 만들고 Pages에서 **Create a project > Connect to Git**을 선택합니다.
2. GitHub 저장소 `NoSR/PzPz_ver0-0725-`를 연결합니다.
3. 위의 Production branch, Build command, Output directory를 입력합니다.
4. 첫 배포 후 `*.pages.dev` 주소에서 홈 화면, 예약 모달, `/pz_admin` 직접 접속과 새로고침을 확인합니다.
5. 실제 매장 도메인을 구매한 뒤 Pages의 **Custom domains**에서 연결합니다. DNS를 Cloudflare로 이전하면 HTTPS 인증서가 자동으로 발급됩니다.
6. 도메인 연결 뒤 root 도메인과 `www` 중 하나를 canonical 주소로 정하고 다른 주소는 리디렉션합니다.

## 다음 개발 단계

- 실제 매장 정보와 이미지 교체
- 예약 자원, 영업시간, 휴무일, 취소 규칙 확정
- D1 스키마 및 예약 API 구현
- 관리자 인증과 서버 권한 검사 구현
- 예약 충돌 방지 및 운영 테스트 추가