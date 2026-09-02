# 모바일 명함 (mobile-business-card) 프로젝트 계획서

## Context

강지명(Corelink · Founder & Content Director)의 모바일 명함을 GitHub Pages로 서비스한다.
`externals/명함 디자인 시안_260902.png`(블랙 + 골드)의 톤앤매너를 웹으로 옮기되,
디자인 n차 수정을 견디도록 **토큰 기반 디자인 시스템**과 **데이터/뷰 분리**를 갖추고,
모바일 한 손 사용(하단 고정 액션바, 44px 터치 타겟, safe-area)에 최적화한다.

## 인터뷰 결정 사항

| 항목 | 결정 |
|---|---|
| 호스팅 | GitHub Pages. 저장소를 **public 전환** (무료 플랜은 public만 Pages 가능). URL `https://ji-myung.github.io/mobile-business-card/` |
| 범위 | 강지명 1인용 |
| 기술 스택 | **Vite + TypeScript + 바닐라 DOM** (프레임워크 없음), vitest, GitHub Actions 배포 |
| 회사명 / 이메일 | Corelink / `corelink.mail@gmail.com` (시안의 corelink.kr 주소는 사용 안 함) |
| 제공 서비스 (7) | 병원 마케팅 / 숏폼 컨텐츠 / 방송 출연자 협업 / 협찬 / 블로그 / 체험단 / 기자단 |
| 링크 | 홈페이지·인스타·유튜브·카카오채널 전부 placeholder. **빈 값이면 UI에서 숨김** |
| 프로필 사진 / 로고 | 사진은 이니셜 아바타 placeholder. 로고는 코드(인라인 SVG)로 재현, E = 골드 가로바 3개 |
| 태그라인 | `PEOPLE × CONTENT × MARKETING` 헤더 포함 |
| 테마 | 한국어만. **기본 다크**, 사용자가 토글해야 라이트. 토큰 세트 2벌(`[data-theme]`) |
| 추가 기능 | 공유하기(Web Share API, 미지원 시 링크 복사) / 한 줄 소개글 / 포트폴리오 섬네일 3개 placeholder / 전화·이메일 복사 버튼 + 토스트 |
| QR | 1차는 골드 프레임 placeholder. 나중에 명함 URL을 인코딩한 SVG로 교체할 슬롯만 확보 |
| 목업 | 코딩 전 `/design` 스킬로 다크/라이트 아트보드 2장 → 사용자 승인 후 구현 |

## 사전 조사 요약

- 로컬: 빈 디렉토리, git 미초기화. Node 24.18 / npm 11 / gh 2.98 (ji-myung 로그인, repo·workflow 스코프)
- 원격: `ji-myung/mobile-business-card` PRIVATE, main, `LICENSE`(MIT) 1개 파일, Pages 미설정
- 참고 오픈소스: arpixnet/digital-business-card(Nuxt, vCard/QR/Share/PWA), GrigoryKovalev/online-business-card(정적, Pages). 공통 패턴 = **데이터 파일 1개로 콘텐츠 관리**
- **iOS Safari vCard**: JS Blob 다운로드는 iOS 13+에서 미리보기로 열려 저장 경로가 숨음. **정적 `.vcf` 파일을 `<a href>`로 직접 링크**(download 속성 없음)가 iOS(연락처 추가 시트)/Android(다운로드→가져오기) 모두 가장 안정적
- **카카오 상담**: `https://pf.kakao.com/_채널ID/chat` 단순 링크. SDK 불필요
- 시안 추출 컬러(PNG 직접 디코딩): 배경 `#0B0B0B`, 골드 평균 `#C39853`, 직함 `#DCBC70`, 하이라이트 `#F1CE6D`, 글로우 `#FDDAA3`, 어두운 골드 `#634824`, 본문 화이트 `#E8E8E8`

## 아키텍처

### 파일 구조

```
mobile-business-card/
├── index.html                  # 셸. <html data-theme="dark">, 폰트 링크, #app
├── public/
│   ├── favicon.svg
│   └── portfolio/              # 섬네일 이미지 (나중에 추가)
├── src/
│   ├── main.ts                 # 부트스트랩: 테마 적용 → 섹션 렌더 → 이벤트 바인딩
│   ├── data/
│   │   └── profile.ts          # ★ 유일한 콘텐츠 소스. Profile 타입 + 데이터
│   ├── lib/
│   │   ├── vcard.ts            # Profile → vCard 3.0 문자열 (순수 함수, 테스트 대상)
│   │   ├── theme.ts            # get/set/toggle, localStorage 'theme', 기본 'dark'
│   │   ├── clipboard.ts        # copyText + Web Share 폴백
│   │   └── dom.ts              # html`` 템플릿 헬퍼, escapeHtml
│   ├── components/             # 각 파일 = render(profile) => string  +  bind(root)
│   │   ├── header.ts           # 로고(SVG) + 글로우 디바이더 + 태그라인 + 테마 토글
│   │   ├── profile.ts          # 아바타 + 이름 + 직함 + 소개글 + 회사
│   │   ├── contact.ts          # 전화/이메일/홈페이지 행 + 복사 버튼
│   │   ├── services.ts         # 7개 서비스, 골드 라인 아이콘
│   │   ├── social.ts           # 인스타/유튜브 (빈 값 숨김)
│   │   ├── portfolio.ts        # 섬네일 그리드
│   │   ├── qr.ts               # QR 슬롯 + 공유하기
│   │   ├── action-bar.ts       # 하단 고정: 전화 / 카카오 상담 / 연락처 저장
│   │   └── toast.ts
│   ├── icons.ts                # 인라인 SVG 문자열 (stroke 1.5, currentColor)
│   └── styles/
│       ├── tokens.css          # 원시 토큰 (팔레트·스케일). 컴포넌트에서 직접 참조 금지
│       ├── themes.css          # [data-theme=dark] / [data-theme=light] 의미 토큰
│       ├── base.css            # reset, 타이포, focus, safe-area, 터치 타겟
│       ├── layout.css          # 카드 컨테이너 (max-width 480, 데스크톱 중앙 정렬)
│       └── components/*.css    # 컴포넌트별 1파일, 의미 토큰만 사용
├── tests/
│   ├── vcard.test.ts
│   ├── theme.test.ts
│   └── profile.test.ts         # 데이터 유효성 (전화 형식, 필수 필드)
├── scripts/
│   └── vite-plugin-vcard.ts    # dev: /card.vcf 미들웨어, build: dist/card.vcf 방출
├── docs/
│   └── PLAN.md                 # 이 계획서 사본 (저장소에 보존)
├── externals/                  # 디자인 시안 (참고용, 커밋)
├── .github/workflows/deploy.yml
├── vite.config.ts              # base: '/mobile-business-card/'
├── tsconfig.json, package.json, .gitignore
└── CLAUDE.md                   # 콘텐츠 수정 = profile.ts, 디자인 수정 = tokens/themes 규칙
```

### 데이터 모델 (`src/data/profile.ts`)

```ts
export interface Profile {
  name: string; nameEn?: string;
  title: string; company: string; tagline: string[]; bio: string;
  phone: string;            // '010-3991-2579' (tel: 링크는 숫자만 추출)
  email: string;
  website?: string;         // '' → 숨김
  kakaoChannelId?: string;  // '_xxxx' → https://pf.kakao.com/_xxxx/chat
  instagram?: string; youtube?: string;   // 전체 URL
  services: { label: string; icon: IconName }[];
  portfolio: { title: string; thumbnail?: string; url?: string }[];
  siteUrl: string;          // 공유/QR 대상
}
```

콘텐츠 변경은 이 파일만 수정 → 화면·vCard·공유 텍스트가 모두 따라간다.

### 디자인 시스템 (3계층)

1. **원시 토큰** `tokens.css` — `--gold-300 #F1CE6D`, `--gold-500 #D4A855`, `--gold-700 #7A5C2E`, `--neutral-950 #0B0B0B` … , 간격 4pt 스케일 `--space-1..10`, 반경, 폰트 크기(clamp 유동형), 폰트 패밀리, 그림자, 모션 시간
2. **의미 토큰** `themes.css` — 테마별 재정의만 여기서

   | 토큰 | dark | light |
   |---|---|---|
   | `--color-bg` | `#0B0B0B` | `#F7F5F0` |
   | `--color-surface` | `#141414` | `#FFFFFF` |
   | `--color-text` | `#E8E8E8` | `#141414` |
   | `--color-text-muted` | `#9A9A9A` | `#6B6B6B` |
   | `--color-accent` | `#D4A855` | `#A67C2E` (대비 확보용 어두운 골드) |
   | `--color-accent-strong` | `#F1CE6D` | `#8A6320` |
   | `--color-accent-subtle` | `rgba(212,168,85,.12)` | `rgba(166,124,46,.10)` |
   | `--color-border` | `rgba(212,168,85,.25)` | `rgba(166,124,46,.30)` |
   | `--shadow-card` | 골드 글로우 | 부드러운 회색 |

3. **컴포넌트 CSS** — 의미 토큰만 참조. 원시 토큰 직접 참조 금지(CLAUDE.md에 규칙 명시). 클래스 네이밍 `.c-header__logo` 식 BEM.

- 폰트: 본문 **Pretendard Variable** (jsDelivr v1.3.9 dynamic subset), 로고/태그라인 라틴 디스플레이 **Montserrat**(Google Fonts) + 넓은 letter-spacing. 폰트 패밀리도 토큰.
- 아이콘: Lucide(MIT) 경로를 `icons.ts`에 인라인 복사. 골드 라인 스타일(시안 일치). 카카오는 말풍선 아이콘.
- 모션: `prefers-reduced-motion` 존중. 글로우 디바이더는 CSS gradient + box-shadow만(이미지 없음).

### 화면 구성 (모바일 세로 스크롤, 위→아래)

1. **헤더**: CORELINK 로고(SVG) · 글로우 라인 · `PEOPLE × CONTENT × MARKETING` · 우상단 테마 토글(해/달)
2. **프로필**: 이니셜 아바타(골드 링) · 강지명 · Founder & Content Director(골드) · 짧은 골드 언더라인 · 소개글 · Corelink
3. **연락처**: 전화 / 이메일 / 홈페이지 행. 값 탭 → `tel:` / `mailto:` / 새 탭. 우측 복사 버튼 → 토스트 "복사됨"
4. **제공 서비스**: 7개, 2열 그리드, 골드 라인 아이콘 + 라벨
5. **소셜**: 인스타그램 / 유튜브 버튼 (빈 값 숨김, 둘 다 비면 섹션 자체 숨김)
6. **포트폴리오**: 섬네일 3개 그리드(16:9). 이미지 없으면 골드 그라데이션 placeholder + 제목
7. **QR & 공유**: 골드 코너 프레임 QR 슬롯 · "카메라로 스캔해 명함 열기" · **공유하기** 버튼
8. **푸터**: © Corelink
9. **하단 고정 액션바**(항상 표시, `env(safe-area-inset-bottom)`): **전화하기** `tel:` / **카카오 상담** `pf.kakao.com/_id/chat` / **연락처 저장** `card.vcf`

- 데스크톱: 카드가 480px 폭으로 중앙 정렬, 주변은 `--color-bg`. 액션바는 카드 폭에 맞춤.
- 카카오 ID 비어 있으면 액션바 버튼 비활성(회색 + "준비 중" 툴팁)이 아니라 **숨기고 2버튼으로 재배치**.

### 핵심 동작

- **연락처 저장**: `scripts/vite-plugin-vcard.ts`가 `profile.ts` → `lib/vcard.ts`로 vCard 3.0(CRLF, UTF-8, `N;FN;ORG;TITLE;TEL;EMAIL;URL;NOTE`) 생성. dev에서는 `/card.vcf` 미들웨어(`Content-Type: text/vcard`), build에서는 `dist/card.vcf` 방출. 링크는 `<a href="card.vcf">` (download 속성 없음 → iOS 연락처 시트, Android 다운로드)
- **테마**: `lib/theme.ts` — `localStorage.theme ?? 'dark'`를 `<html data-theme>`에 적용. `index.html` 헤드에 인라인 스크립트로 첫 페인트 전 적용(FOUC 방지). 시스템 설정은 무시(사용자 요구)
- **공유**: `navigator.share({title, text, url: siteUrl})` → 없으면 `clipboard.writeText(siteUrl)` + 토스트
- **복사**: `navigator.clipboard.writeText` → 토스트. 실패 시 `execCommand('copy')` 폴백은 두지 않음(현대 모바일 브라우저 모두 지원)

### 배포

- `.github/workflows/deploy.yml`: `push main` → `npm ci` → `npm test` → `npm run build` → `actions/upload-pages-artifact`(dist) → `actions/deploy-pages`
- `vite.config.ts` `base: '/mobile-business-card/'`
- 저장소 설정(gh CLI, 승인 후 실행):
  ```
  gh repo edit ji-myung/mobile-business-card --visibility public --accept-visibility-change-consequences
  gh api -X POST repos/ji-myung/mobile-business-card/pages -f build_type=workflow
  ```

## 구현 단계 (각 단계 검증 기준 포함)

1. **프로젝트 초기화** → 검증: `npm run dev` 기동, `npm run build`로 `dist/` 생성, `npm test` 통과(빈 테스트), 원격에 push 성공
   - `git init` + remote 연결 + 원격 `LICENSE` pull, `.gitignore`(node_modules, dist), `npm init` + vite/typescript/vitest 설치, 폴더 골격, `CLAUDE.md`, `docs/PLAN.md`(이 문서), 첫 커밋
2. **목업 검토** → 검증: 사용자 승인
   - `/design` 스킬로 390×844 아트보드 2장(다크/라이트). 시안 톤 + 위 화면 구성 반영. 수정 요청 반영 후 승인
3. **디자인 시스템 + 테마** (TDD: `theme.test.ts` 먼저) → 검증: 토글 시 `data-theme` 전환 + 새로고침 후 유지, 기본값 dark
   - `tokens.css`, `themes.css`, `base.css`, `layout.css`, `lib/theme.ts`, 인라인 FOUC 방지 스크립트
4. **데이터 + vCard** (TDD: `vcard.test.ts`, `profile.test.ts` 먼저) → 검증: 테스트 통과, dev `/card.vcf` 200 + `text/vcard`, `dist/card.vcf` 존재
   - `profile.ts`, `lib/vcard.ts`(특수문자 이스케이프 `;`,`,`,`\n`), `vite-plugin-vcard.ts`
5. **컴포넌트 구현** (목업 순서대로) → 검증: Playwright MCP로 390×844 스크린샷 다크/라이트, 모든 `href` 값 확인(`tel:01039912579`, `mailto:`, `pf.kakao.com/_…/chat`, `card.vcf`), 빈 링크 섹션 숨김 확인, 터치 타겟 ≥44px
   - header → profile → contact(+copy/toast) → services → social → portfolio → qr(+share) → action-bar
6. **배포** → 검증: 라이브 URL 200, 모바일 실기기에서 전화/카카오/저장 동작, `card.vcf` 실제 연락처 앱 저장 확인(사용자)
   - workflow 작성, 저장소 public 전환, Pages 활성화, push, Actions 성공 확인
7. **디자인 리뷰 패스** → 검증: 목업 대비 차이 목록 0, 라이트 테마 대비 ≥4.5:1(본문)/3:1(대형 텍스트)
   - `gstack-design-review` 또는 `frontend-design` 스킬로 시각 QA, 토큰 값만 조정

## 범위 제외 (YAGNI)

- PWA / 오프라인, 다국어, 다인용 라우팅, 실제 QR 생성(슬롯만), 애널리틱스, 시스템 다크모드 자동 추종, 카카오 SDK

## 미확정 · 나중에 채울 값 (profile.ts placeholder)

홈페이지 URL, 인스타그램 URL, 유튜브 URL, 카카오 채널 ID, 소개글 문구, 포트폴리오 3건(제목·섬네일·링크), 프로필 사진
