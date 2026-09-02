# mobile-business-card

강지명 (Corelink · Founder & Content Director) 모바일 명함.
Vite + TypeScript + 바닐라 DOM. GitHub Pages 배포.

## 수정 지점 규칙

이 프로젝트는 디자인 n차 수정을 전제로 만들었다. 무엇을 바꾸든 아래 표의 위치만 건드린다.

| 바꾸려는 것 | 수정할 파일 |
|---|---|
| 이름·연락처·서비스 목록·링크·포트폴리오 등 모든 콘텐츠 | `src/data/profile.ts` **한 곳만** |
| 색·간격·폰트 크기 같은 디자인 값 | `src/styles/tokens.css` (원시 값) |
| 다크/라이트 테마별 색 배정 | `src/styles/themes.css` (의미 토큰) |
| 특정 컴포넌트의 레이아웃 | `src/styles/components/<name>.css` |
| 섹션 구조·순서 | `src/main.ts` 의 렌더 순서, `src/components/<name>.ts` |

## 지켜야 할 제약

1. **컴포넌트 CSS는 의미 토큰만 참조한다.** `var(--color-accent)` 는 되고 `var(--gold-500)` 이나 `#D4A855` 같은 원시 값 직접 사용은 금지. 원시 토큰은 `themes.css` 안에서만 소비한다.
2. **콘텐츠를 컴포넌트에 하드코딩하지 않는다.** 화면 문구·연락처는 전부 `profile.ts` 에서 온다. 예외는 "복사됨" 같은 UI 라벨.
3. **선택 항목이 비면 UI에서 숨긴다.** `website`, `instagram`, `youtube`, `kakaoChannelId` 는 빈 문자열일 수 있다. 렌더 전에 확인하고, 섹션 전체가 비면 섹션도 그린다.
4. **테마 기본값은 dark.** 시스템 설정을 따라가지 않는다. 사용자가 토글해야 light 로 간다.
5. **vCard 는 정적 파일로 낸다.** iOS Safari 에서 JS Blob 다운로드는 저장 경로가 숨는다. `scripts/vite-plugin-vcard.ts` 가 `/card.vcf` 를 만들고, 링크는 `download` 속성 없이 `<a href>` 로 건다.
6. **터치 타겟 최소 44px, `env(safe-area-inset-*)` 존중.** 하단 액션바가 홈 인디케이터에 가리면 안 된다.

## 명령어

```
npm run dev        # 개발 서버
npm test           # vitest 1회 실행
npm run build      # 타입 검사 + 프로덕션 빌드
npm run typecheck  # 타입 검사만
```

## 참고

- 디자인 시안: `externals/명함 디자인 시안_260902.png` (블랙 + 골드)
- 전체 계획서: `docs/PLAN.md`
