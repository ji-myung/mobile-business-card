// 모바일 명함 시안 생성기.
// 방향 3개(A 명함면 / B 에디토리얼 / C 스포트라이트)를 같은 토큰·부품에서 찍어낸다.
// 색을 바꾸려면 THEMES, 공통 부품은 아래 헬퍼, 배치는 각 page 함수를 고친다.
import { writeFileSync } from 'node:fs'

const THEMES = {
  dark: {
    bg: '#0B0B0B', surface: '#141414', surfaceAlt: '#111111',
    text: '#E8E8E8', textMuted: '#9A9A9A', textFaint: '#858585', footer: '#808080',
    accent: '#D4A855', accentStrong: '#F1CE6D', glow: '#FDDAA3',
    border: 'rgba(212,168,85,.20)', borderStrong: 'rgba(212,168,85,.34)',
    // 글로우 라인: 효과를 절반으로 줄인 값
    ruleSoft: 'rgba(212,168,85,.19)', ruleStrong: 'rgba(212,168,85,.45)',
    subtle: 'rgba(212,168,85,.06)', glass: 'rgba(255,255,255,.035)',
    barBg: 'rgba(11,11,11,.94)',
    thumbFrom: '#1A1611', thumbTo: '#2B2218',
    qrPanel: '#EFEAE0', qrModule: '#141414',
    onAccent: '#0B0B0B',
    spot: 'rgba(212,168,85,.16)',
    toggle: 'sun',
    cardShadow: '0 1px 0 rgba(255,255,255,.02)',
  },
  light: {
    bg: '#F7F5F0', surface: '#FFFFFF', surfaceAlt: '#FFFFFF',
    text: '#141414', textMuted: '#5F5F5F', textFaint: '#6B6B6B', footer: '#6B6B6B',
    accent: '#8A6320', accentStrong: '#6B4C17', glow: '#C89A45',
    border: 'rgba(138,99,32,.22)', borderStrong: 'rgba(138,99,32,.36)',
    ruleSoft: 'rgba(138,99,32,.18)', ruleStrong: 'rgba(138,99,32,.42)',
    subtle: 'rgba(138,99,32,.05)', glass: 'rgba(138,99,32,.035)',
    barBg: 'rgba(247,245,240,.96)',
    thumbFrom: '#F0EBE1', thumbTo: '#E3D9C7',
    qrPanel: '#FFFFFF', qrModule: '#141414',
    onAccent: '#FFFFFF',
    spot: 'rgba(138,99,32,.10)',
    toggle: 'moon',
    cardShadow: '0 1px 2px rgba(20,20,20,.05)',
  },
}

const PATHS = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  cross: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8"/><path d="M8 12h8"/>',
  play: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M10 8.5v7l6-3.5z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  pen: '<path d="M12 20h9"/><path d="M16.4 3.6a1 1 0 0 1 3 3L7.4 18.6a2 2 0 0 1-.9.5l-2.9.9a.5.5 0 0 1-.6-.6l.8-2.9a2 2 0 0 1 .5-.9z"/>',
  sparkles: '<path d="M12 3l1.9 5.6a2 2 0 0 0 1.3 1.3L20.8 12l-5.6 1.9a2 2 0 0 0-1.3 1.3L12 20.8l-1.9-5.6a2 2 0 0 0-1.3-1.3L3.2 12l5.6-1.9a2 2 0 0 0 1.3-1.3z"/>',
  news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8Z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.6-4.6a2 2 0 0 0-2.8 0L3 21"/>',
  arrow: '<path d="M7 17 17 7"/><path d="M9 7h8v8"/>',
}

const MONO = 'Montserrat, "Helvetica Neue", Arial, sans-serif'

const icon = (name, size, color, sw = 1.5) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex: 0 0 auto; display: block">${PATHS[name]}</svg>`

/* 로고. E 는 SVG 로 그려 baseline 에 올린다 — 다른 글자와 세로 크기가 정확히 같다.
   Montserrat 대문자 높이는 0.7em 이므로 막대 묶음 높이도 0.7em 으로 맞춘다. */
function logo(t, size) {
  const cap = Math.round(size * 0.7)
  const bar = Math.max(2, Math.round(cap / 6.3))
  const w = Math.round(size * 0.63)
  const mid = Math.round((cap - bar) / 2)
  return `<span style="font-family: ${MONO}; font-size: ${size}px; font-weight: 300; letter-spacing: 0.2em; line-height: 1; color: ${t.text}; white-space: nowrap">COR<svg width="${w}" height="${cap}" viewBox="0 0 ${w} ${cap}" style="display: inline; vertical-align: baseline; margin-right: 0.2em"><rect width="${w}" height="${bar}" y="0" fill="${t.accent}"/><rect width="${w}" height="${bar}" y="${mid}" fill="${t.accent}"/><rect width="${w}" height="${bar}" y="${cap - bar}" fill="${t.accent}"/></svg>LINK</span>`
}

/* 골드 글로우 라인. 시안 대비 효과를 절반으로 낮췄다. */
function glowRule(t, margin) {
  const dot = (left, size, blur) =>
    `<span style="position: absolute; left: ${left}; top: 50%; width: ${size}px; height: ${size}px; transform: translate(-50%, -50%); border-radius: 50%; background: ${t.glow}; box-shadow: 0 0 ${blur}px 1px ${t.accent}; opacity: .75"></span>`
  return `<div style="position: relative; height: 1px; margin: ${margin}; background: linear-gradient(90deg, transparent, ${t.ruleSoft} 10%, ${t.ruleStrong} 50%, ${t.ruleSoft} 90%, transparent)">${dot('12%', 3, 5)}${dot('30%', 3, 5)}${dot('50%', 4, 7)}${dot('70%', 3, 5)}${dot('88%', 3, 5)}</div>`
}

/* 테마 토글. 보이는 원은 22px(기존 44px의 1/4 면적), 누르는 영역은 44px 유지. */
const toggle = (t, pos) =>
  `<div style="position: absolute; ${pos} display: flex; align-items: center; justify-content: center; width: 44px; height: 44px">
      <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border: 1px solid ${t.border}; border-radius: 999px">${icon(t.toggle, 12, t.accent, 1.6)}</span>
    </div>`

function qrSvg(t, px) {
  const N = 21, cell = px / N
  let seed = 20260902
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const on = Array.from({ length: N }, () => Array(N).fill(false))
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) on[r][c] = rnd() > 0.5
  const finder = (r, c) => {
    for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
      const y = r + i, x = c + j
      if (y < 0 || x < 0 || y >= N || x >= N) continue
      on[y][x] = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)
    }
  }
  finder(0, 0); finder(0, N - 7); finder(N - 7, 0)
  let rects = ''
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (on[r][c]) rects += `<rect x="${(c * cell).toFixed(2)}" y="${(r * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`
  }
  return `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" fill="${t.qrModule}" style="display: block">${rects}</svg>`
}

const qrFramed = (t, px) => {
  const c = (pos) => `<span style="position: absolute; ${pos} width: ${Math.round(px / 7)}px; height: ${Math.round(px / 7)}px; border: 1.5px solid ${t.accent}"></span>`
  return `<div style="position: relative; padding: 11px">
        ${c('top: 0; left: 0; border-right: none; border-bottom: none;')}${c('top: 0; right: 0; border-left: none; border-bottom: none;')}${c('bottom: 0; left: 0; border-right: none; border-top: none;')}${c('bottom: 0; right: 0; border-left: none; border-top: none;')}
        <div style="padding: 8px; background: ${t.qrPanel}; border: 1px solid ${t.border}; border-radius: 4px">${qrSvg(t, px)}</div>
      </div>`
}

const actionBar = (t) => {
  const btn = (ic, name, primary) => `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; height: 54px; border-radius: 13px; ${primary ? `background: ${t.accent}; border: 1px solid ${t.accent}` : `background: transparent; border: 1px solid ${t.borderStrong}`}">
        ${icon(ic, 19, primary ? t.onAccent : t.accent)}
        <span style="font-size: 11px; font-weight: 500; letter-spacing: -0.01em; color: ${primary ? t.onAccent : t.text}">${name}</span>
      </div>`
  return `<nav style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; padding: 11px 16px 22px; background: ${t.barBg}; border-top: 1px solid ${t.border}">${btn('phone', '전화하기', false)}${btn('chat', '카카오 상담', false)}${btn('userPlus', '연락처 저장', true)}</nav>`
}

const SERVICES = [
  ['cross', '병원 마케팅'], ['play', '숏폼 컨텐츠'], ['users', '방송 출연자 협업'],
  ['gift', '협찬'], ['pen', '블로그'], ['sparkles', '체험단'], ['news', '기자단'],
]
const NAME = '강지명'
const TITLE = 'Founder | Content Director'
const PHONE = '010-3991-2579'
const EMAIL = 'corelink.mail@gmail.com'
const BIO = '[한 줄 소개 &mdash; 예: 병원 마케팅과 숏폼 콘텐츠로 브랜드를 연결합니다]'

const label = (t, text, pad = '') => `
      <div style="display: flex; align-items: center; gap: 8px; margin: 0 0 13px; ${pad}">
        <span style="width: 14px; height: 1px; background: ${t.accent}"></span>
        <span style="font-size: 11px; font-weight: 500; letter-spacing: 0.14em; color: ${t.textFaint}">${text}</span>
      </div>`

const thumbRow = (t) => `
      <div style="display: flex; gap: 12px; padding: 0 24px; overflow: hidden">
${[1, 2, 3].map((n) => `        <div style="flex: 0 0 auto; width: 204px">
          <div style="display: flex; align-items: center; justify-content: center; height: 115px; border-radius: 12px; border: 1px solid ${t.border}; background: linear-gradient(135deg, ${t.thumbFrom}, ${t.thumbTo})">${icon('image', 22, t.accent, 1.25)}</div>
          <div style="margin: 9px 2px 0; font-size: 12.5px; color: ${t.textMuted}">[대표 작업 ${n}]</div>
        </div>`).join('\n')}
      </div>`

const shell = (t, height, inner) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${t.accent}; text-decoration: none; }
    a:hover { color: ${t.accentStrong}; }
  </style>
</helmet>
<div style="width: 390px; height: ${height}px; display: flex; flex-direction: column; background: ${t.bg}; color: ${t.text}; overflow: hidden">
  <div style="flex: 1 1 auto; min-height: 0">
${inner}
  </div>
${actionBar(t)}
</div>
</x-dc>
</body>
</html>
`

/* ── A · 명함면 ────────────────────────────────────────────────
   실제 명함 뒷면을 화면 히어로로 그대로 옮긴다.
   세로 골드 규칙, 좌측 서비스 목록, 우측 QR — 종이 명함의 구조 그대로. */
function pageA(t, h) {
  const svc = SERVICES.map(([ic, n]) => `
            <div style="display: flex; align-items: center; gap: 9px">${icon(ic, 15, t.accent, 1.4)}<span style="font-size: 12.5px; letter-spacing: -0.01em; color: ${t.text}">${n}</span></div>`).join('')

  const contact = (ic, cap, val) => `
          <div style="display: flex; align-items: center; gap: 11px; flex: 1 1 0; min-width: 0">
            ${icon(ic, 17, t.accent)}
            <div style="min-width: 0">
              <div style="font-size: 9.5px; letter-spacing: 0.1em; color: ${t.textFaint}">${cap}</div>
              <div style="font-size: 13px; color: ${t.text}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">${val}</div>
            </div>
          </div>`

  const ghost = (ic, n) => `
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border: 1px solid ${t.border}; border-radius: 12px; font-size: 13px; color: ${t.text}">${icon(ic, 17, t.accent)}<span>${n}</span></div>`

  return shell(t, h, `
    <header style="position: relative; padding: 22px 24px 0">
      ${logo(t, 19)}
      ${toggle(t, 'top: 12px; right: 14px;')}
      ${glowRule(t, '16px 0 0')}
    </header>

    <section style="margin: 20px; padding: 22px 18px 20px; border: 1px solid ${t.borderStrong}; border-radius: 18px; background: ${t.surface}; box-shadow: ${t.cardShadow}">
      <h1 style="margin: 0; font-size: 31px; font-weight: 600; letter-spacing: 0.02em; color: ${t.text}">${NAME}</h1>
      <p style="margin: 8px 0 0; font-family: ${MONO}; font-size: 11px; font-weight: 400; letter-spacing: 0.12em; color: ${t.accent}">${TITLE}</p>
      <span style="display: block; width: 30px; height: 1px; margin: 14px 0 0; background: ${t.accent}"></span>

      <div style="display: flex; align-items: stretch; gap: 16px; margin: 20px 0 0">
        <div style="display: flex; flex-direction: column; gap: 11px; flex: 1 1 auto">${svc}
        </div>
        <span style="width: 1px; background: linear-gradient(180deg, transparent, ${t.borderStrong} 15%, ${t.borderStrong} 85%, transparent)"></span>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; flex: 0 0 auto">${qrFramed(t, 92)}
          <span style="margin: 2px 0 0; font-size: 9.5px; letter-spacing: 0.06em; color: ${t.textFaint}">SCAN</span>
        </div>
      </div>

      <span style="display: block; height: 1px; margin: 20px 0 16px; background: ${t.border}"></span>
      <div style="display: flex; gap: 12px">${contact('phone', '전화', PHONE)}</div>
      <div style="display: flex; gap: 12px; margin: 13px 0 0">${contact('mail', '이메일', EMAIL)}</div>
    </section>

    <p style="margin: 0 24px 26px; font-size: 13px; line-height: 1.7; color: ${t.textMuted}; text-wrap: pretty">${BIO}</p>

    <section style="padding: 0 24px 26px">
      ${label(t, '채널')}
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">${ghost('instagram', '인스타그램')}${ghost('youtube', '유튜브')}</div>
    </section>

    <section style="padding: 0 0 26px">
      ${label(t, '포트폴리오', 'padding: 0 24px')}
${thumbRow(t)}
    </section>

    <section style="padding: 0 24px 24px">
      <div style="display: flex; align-items: center; justify-content: center; gap: 9px; height: 50px; border: 1px solid ${t.borderStrong}; border-radius: 13px; font-size: 14px; font-weight: 500; color: ${t.text}">${icon('share', 18, t.accent)}<span>명함 공유하기</span></div>
    </section>

    <footer style="padding: 0 24px 24px; text-align: center; font-size: 11px; letter-spacing: 0.05em; color: ${t.footer}">&copy; 2026 Corelink</footer>`)
}

/* ── B · 에디토리얼 ────────────────────────────────────────────
   상자를 전부 걷어내고 타이포와 헤어라인만 남긴다.
   서비스는 잡지 목차처럼 번호를 매긴 인덱스. */
function pageB(t, h) {
  const idx = SERVICES.map(([, n], i) => `
        <div style="display: flex; align-items: baseline; gap: 14px; padding: 12px 0; border-bottom: 1px solid ${t.border}">
          <span style="font-family: ${MONO}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.1em; color: ${t.accent}">${String(i + 1).padStart(2, '0')}</span>
          <span style="font-size: 15px; letter-spacing: -0.01em; color: ${t.text}">${n}</span>
        </div>`).join('')

  const link = (n, i) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid ${t.border}">
          <span style="display: flex; align-items: baseline; gap: 14px">
            <span style="font-family: ${MONO}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.1em; color: ${t.accent}">${String(i).padStart(2, '0')}</span>
            <span style="font-size: 14px; color: ${t.text}">${n}</span>
          </span>${icon('arrow', 15, t.textFaint, 1.4)}
        </div>`

  const work = (n) => `
        <div style="display: flex; align-items: center; gap: 14px; padding: 11px 0; border-bottom: 1px solid ${t.border}">
          <span style="font-family: ${MONO}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.1em; color: ${t.accent}">${String(n).padStart(2, '0')}</span>
          <div style="display: flex; align-items: center; justify-content: center; width: 62px; height: 38px; flex: 0 0 auto; border-radius: 4px; border: 1px solid ${t.border}; background: linear-gradient(135deg, ${t.thumbFrom}, ${t.thumbTo})">${icon('image', 15, t.accent, 1.25)}</div>
          <span style="flex: 1 1 auto; font-size: 13px; color: ${t.textMuted}">[대표 작업 ${n}]</span>${icon('arrow', 15, t.textFaint, 1.4)}
        </div>`

  const head = (text) => `<div style="margin: 30px 0 4px; font-family: ${MONO}; font-size: 10px; font-weight: 500; letter-spacing: 0.22em; color: ${t.textFaint}">${text}</div>`

  return shell(t, h, `
    <header style="position: relative; padding: 22px 26px 0">
      ${logo(t, 17)}
      ${toggle(t, 'top: 12px; right: 16px;')}
      ${glowRule(t, '16px 0 0')}
    </header>

    <div style="padding: 0 26px">
      <h1 style="margin: 34px 0 0; font-size: 47px; font-weight: 600; letter-spacing: -0.035em; line-height: 1.05; color: ${t.text}">${NAME}</h1>
      <p style="margin: 14px 0 0; font-family: ${MONO}; font-size: 11px; font-weight: 400; letter-spacing: 0.13em; color: ${t.accent}">${TITLE}</p>
      <p style="margin: 20px 0 0; font-size: 15px; line-height: 1.65; color: ${t.textMuted}; text-wrap: pretty">${BIO}</p>

      ${head('SERVICES')}
      <div>${idx}</div>

      ${head('CONTACT')}
      <div style="padding: 16px 0 0">
        <div style="font-family: ${MONO}; font-size: 26px; font-weight: 300; letter-spacing: 0.02em; color: ${t.text}">${PHONE}</div>
        <span style="display: block; height: 1px; margin: 10px 0 14px; background: ${t.ruleStrong}"></span>
        <div style="font-size: 14px; color: ${t.textMuted}">${EMAIL}</div>
      </div>

      ${head('CHANNELS')}
      <div style="margin: 6px 0 0">${link('인스타그램', 1)}${link('유튜브', 2)}</div>

      ${head('SELECTED WORK')}
      <div style="margin: 6px 0 0">${work(1)}${work(2)}${work(3)}</div>

      <div style="display: flex; align-items: flex-end; justify-content: space-between; margin: 34px 0 0">
        <div>${qrFramed(t, 84)}</div>
        <div style="display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px; border: 1px solid ${t.borderStrong}; border-radius: 999px; font-size: 13px; font-weight: 500; color: ${t.text}">${icon('share', 16, t.accent)}<span>공유</span></div>
      </div>

      <footer style="padding: 30px 0 24px; font-size: 11px; letter-spacing: 0.05em; color: ${t.footer}">&copy; 2026 Corelink</footer>
    </div>`)
}

/* ── C · 스포트라이트 ──────────────────────────────────────────
   상단에서 쏟아지는 골드 광원 + 반투명 레이어.
   숏폼 영상 하는 사람답게 시네마틱하게. */
function pageC(t, h) {
  const pill = (ic, n) => `
          <span style="display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 15px; border: 1px solid ${t.border}; border-radius: 999px; background: ${t.glass}; font-size: 12.5px; letter-spacing: -0.01em; color: ${t.text}">${icon(ic, 15, t.accent, 1.4)}${n}</span>`

  const panel = (ic, cap, val) => `
        <div style="display: flex; align-items: center; gap: 13px; padding: 15px 16px; border: 1px solid ${t.border}; border-radius: 16px; background: ${t.glass}">
          <span style="display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; flex: 0 0 auto; border-radius: 12px; background: ${t.subtle}">${icon(ic, 18, t.accent)}</span>
          <div style="flex: 1 1 auto; min-width: 0">
            <div style="font-size: 9.5px; letter-spacing: 0.12em; color: ${t.textFaint}">${cap}</div>
            <div style="margin: 2px 0 0; font-size: 14.5px; color: ${t.text}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">${val}</div>
          </div>
          <span style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; flex: 0 0 auto; border-radius: 10px; background: ${t.subtle}">${icon('copy', 15, t.textFaint)}</span>
        </div>`

  const stack = `
        <div style="position: relative; height: 172px; margin: 0 24px">
          <div style="position: absolute; top: 22px; left: 28px; right: 28px; height: 140px; border-radius: 16px; border: 1px solid ${t.border}; background: ${t.surfaceAlt}"></div>
          <div style="position: absolute; top: 11px; left: 14px; right: 14px; height: 140px; border-radius: 16px; border: 1px solid ${t.border}; background: ${t.surface}"></div>
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border-radius: 16px; border: 1px solid ${t.borderStrong}; background: linear-gradient(135deg, ${t.thumbFrom}, ${t.thumbTo})">
            ${icon('image', 24, t.accent, 1.25)}
            <span style="font-size: 12.5px; color: ${t.textMuted}">[대표 작업 1]</span>
          </div>
          <span style="position: absolute; right: 6px; bottom: -4px; font-size: 11px; letter-spacing: 0.04em; color: ${t.textFaint}">+2건 &middot; 밀어서 보기</span>
        </div>`

  return shell(t, h, `
    <div style="position: relative; background: radial-gradient(115% 46% at 50% 0%, ${t.spot}, transparent 72%)">
      <header style="position: relative; padding: 22px 24px 0; text-align: center">
        ${logo(t, 18)}
        ${toggle(t, 'top: 12px; right: 14px;')}
        ${glowRule(t, '16px 20px 0')}
      </header>

      <section style="display: flex; flex-direction: column; align-items: center; padding: 30px 24px 30px; text-align: center">
        <div style="display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; border: 1px solid ${t.borderStrong}; border-radius: 50%; background: ${t.surface}; box-shadow: 0 0 44px ${t.spot}; font-size: 34px; font-weight: 300; color: ${t.accent}">강</div>
        <h1 style="margin: 20px 0 0; font-size: 33px; font-weight: 600; letter-spacing: 0.02em; color: ${t.text}">${NAME}</h1>
        <p style="margin: 9px 0 0; font-family: ${MONO}; font-size: 11px; font-weight: 400; letter-spacing: 0.13em; color: ${t.accent}">${TITLE}</p>
        <p style="max-width: 290px; margin: 16px 0 0; font-size: 13px; line-height: 1.7; color: ${t.textMuted}; text-wrap: pretty">${BIO}</p>
      </section>
    </div>

    <section style="padding: 0 24px 30px">
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px">${SERVICES.map(([ic, n]) => pill(ic, n)).join('')}
      </div>
    </section>

    <section style="display: flex; flex-direction: column; gap: 10px; padding: 0 24px 28px">${panel('phone', 'PHONE', PHONE)}${panel('mail', 'EMAIL', EMAIL)}</section>

    <section style="padding: 0 0 28px">
      ${label(t, '포트폴리오', 'padding: 0 24px')}
${stack}
    </section>

    <section style="display: flex; align-items: center; gap: 14px; padding: 0 24px 28px">
      ${qrFramed(t, 88)}
      <div style="flex: 1 1 auto">
        <p style="margin: 0 0 12px; font-size: 12.5px; line-height: 1.6; color: ${t.textMuted}">카메라로 스캔하면<br>이 명함이 열립니다</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border: 1px solid ${t.borderStrong}; border-radius: 13px; font-size: 13.5px; font-weight: 500; color: ${t.text}">${icon('share', 17, t.accent)}<span>공유하기</span></div>
      </div>
    </section>

    <section style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 0 24px 26px">
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border: 1px solid ${t.border}; border-radius: 12px; background: ${t.glass}; font-size: 13px; color: ${t.text}">${icon('instagram', 17, t.accent)}<span>인스타그램</span></div>
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border: 1px solid ${t.border}; border-radius: 12px; background: ${t.glass}; font-size: 13px; color: ${t.text}">${icon('youtube', 17, t.accent)}<span>유튜브</span></div>
    </section>

    <footer style="padding: 0 24px 24px; text-align: center; font-size: 11px; letter-spacing: 0.05em; color: ${t.footer}">&copy; 2026 Corelink</footer>`)
}

const HEIGHTS = JSON.parse(process.env.MBC_HEIGHTS || '{}')
const H = (k, fallback) => HEIGHTS[k] ?? fallback

const OUT = [
  { file: 'Main.dc.html', title: 'A · 명함면 (다크)', build: pageA, theme: 'dark', h: H('A', 1400) },
  { file: 'DirectionB.dc.html', title: 'B · 에디토리얼 (다크)', build: pageB, theme: 'dark', h: H('B', 1600) },
  { file: 'DirectionC.dc.html', title: 'C · 스포트라이트 (다크)', build: pageC, theme: 'dark', h: H('C', 1500) },
  { file: 'Light.dc.html', title: 'A · 명함면 (라이트)', build: pageA, theme: 'light', h: H('A', 1400) },
]

for (const o of OUT) {
  writeFileSync(new URL(o.file, import.meta.url), o.build(THEMES[o.theme], o.h))
  console.log('wrote', o.file, `h=${o.h}`)
}

writeFileSync(new URL('canvas.json', import.meta.url), JSON.stringify({
  artboards: OUT.map((o, i) => ({ file: o.file, title: o.title, x: i * 510, y: 0, w: 390, h: o.h })),
  annotations: [{
    id: 'note-brief', x: 0, y: -190, w: 900,
    text: '강지명 · Corelink 모바일 명함 — 구조가 서로 다른 시안 3개입니다.\n\nA 명함면: 종이 명함 뒷면을 화면 히어로로 그대로 옮겼습니다. 세로 골드 규칙, 좌측 서비스, 우측 QR.\nB 에디토리얼: 상자를 전부 걷어내고 타이포와 헤어라인만. 서비스는 잡지 목차처럼 01~07 인덱스.\nC 스포트라이트: 상단 골드 광원과 반투명 레이어. 서비스는 알약 모양으로 흐르고 포트폴리오는 겹친 카드.\n\n맨 오른쪽은 A안의 라이트 테마입니다. 대괄호 [ ]는 아직 값이 없어 자리만 잡아둔 곳입니다.',
  }],
  launch: { view: 'canvas' },
}, null, 2) + '\n')
console.log('wrote canvas.json')
