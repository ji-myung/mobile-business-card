// 다크/라이트 아트보드를 하나의 토큰 세트에서 생성한다.
// 수정할 곳: THEMES (색) 또는 page() (구조). 두 아트보드가 절대 어긋나지 않는다.
import { writeFileSync } from 'node:fs'

const THEMES = {
  dark: {
    file: 'Main.dc.html',
    bg: '#0B0B0B', surface: '#141414', surfaceAlt: '#111111',
    text: '#E8E8E8', textMuted: '#9A9A9A', textFaint: '#858585', footer: '#808080',
    accent: '#D4A855', accentStrong: '#F1CE6D', glow: '#FDDAA3',
    border: 'rgba(212,168,85,.20)', borderStrong: 'rgba(212,168,85,.34)',
    lineSoft: 'rgba(212,168,85,.38)', lineStrong: 'rgba(212,168,85,.9)',
    subtle: 'rgba(212,168,85,.06)',
    barBg: 'rgba(11,11,11,.94)',
    thumbFrom: '#1A1611', thumbTo: '#2B2218',
    qrPanel: '#EFEAE0', qrModule: '#141414',
    onAccent: '#0B0B0B',
    toggle: 'sun',
    cardShadow: '0 1px 0 rgba(255,255,255,.02)',
  },
  light: {
    file: 'Light.dc.html',
    bg: '#F7F5F0', surface: '#FFFFFF', surfaceAlt: '#FFFFFF',
    text: '#141414', textMuted: '#5F5F5F', textFaint: '#6B6B6B', footer: '#6B6B6B',
    accent: '#8A6320', accentStrong: '#6B4C17', glow: '#C89A45',
    border: 'rgba(138,99,32,.22)', borderStrong: 'rgba(138,99,32,.36)',
    lineSoft: 'rgba(138,99,32,.35)', lineStrong: 'rgba(138,99,32,.85)',
    subtle: 'rgba(138,99,32,.05)',
    barBg: 'rgba(247,245,240,.96)',
    thumbFrom: '#F0EBE1', thumbTo: '#E3D9C7',
    qrPanel: '#FFFFFF', qrModule: '#141414',
    onAccent: '#FFFFFF',
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
}

const icon = (name, size, color, sw = 1.5) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex: 0 0 auto; display: block">${PATHS[name]}</svg>`

// 21x21 QR 자리표시자. 파인더 패턴 3개 + 고정 시드 의사난수 모듈.
function qrSvg(t, px) {
  const N = 21, cell = px / N
  let seed = 20260902
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const on = Array.from({ length: N }, () => Array(N).fill(false))
  const finder = (r, c) => {
    for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
      const y = r + i, x = c + j
      if (y < 0 || x < 0 || y >= N || x >= N) continue
      const edge = i === 0 || i === 6 || j === 0 || j === 6
      const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
      on[y][x] = edge || core
    }
  }
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) on[r][c] = rnd() > 0.5
  finder(0, 0); finder(0, N - 7); finder(N - 7, 0)
  let rects = ''
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (!on[r][c]) continue
    rects += `<rect x="${(c * cell).toFixed(2)}" y="${(r * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`
  }
  return `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" fill="${t.qrModule}" style="display: block">${rects}</svg>`
}

const label = (t, text) => `
      <div style="display: flex; align-items: center; gap: 8px; margin: 0 0 13px">
        <span style="width: 14px; height: 1px; background: ${t.accent}"></span>
        <span style="font-size: 11px; font-weight: 500; letter-spacing: 0.14em; color: ${t.textFaint}">${text}</span>
      </div>`

const SERVICES = [
  ['cross', '병원 마케팅'], ['play', '숏폼 컨텐츠'],
  ['users', '방송 출연자 협업'], ['gift', '협찬'],
  ['pen', '블로그'], ['sparkles', '체험단'],
  ['news', '기자단'],
]

function page(t) {
  const contactRow = (ic, cap, val) => `
        <div style="display: flex; align-items: center; gap: 13px; padding: 13px 14px; background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 14px; box-shadow: ${t.cardShadow}">
          ${icon(ic, 20, t.accent)}
          <div style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px">
            <span style="font-size: 10px; letter-spacing: 0.1em; color: ${t.textFaint}">${cap}</span>
            <span style="font-size: 15px; letter-spacing: 0.01em; color: ${t.text}">${val}</span>
          </div>
          <span style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: ${t.subtle}">${icon('copy', 17, t.textFaint)}</span>
        </div>`

  const service = (ic, name, span) => `
          <div style="display: flex; align-items: center; ${span ? 'justify-content: center; grid-column: span 2;' : ''} gap: 10px; padding: 13px 12px; background: ${t.surfaceAlt}; border: 1px solid ${t.border}; border-radius: 12px">
            ${icon(ic, 18, t.accent)}
            <span style="font-size: 13px; letter-spacing: -0.01em; color: ${t.text}">${name}</span>
          </div>`

  const channel = (ic, name) => `
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 48px; border: 1px solid ${t.borderStrong}; border-radius: 12px; color: ${t.text}; font-size: 13px; letter-spacing: 0.01em">
            ${icon(ic, 18, t.accent)}<span>${name}</span>
          </div>`

  const thumb = (n) => `
          <div style="flex: 0 0 auto; width: 204px">
            <div style="display: flex; align-items: center; justify-content: center; height: 115px; border-radius: 12px; border: 1px solid ${t.border}; background: linear-gradient(135deg, ${t.thumbFrom}, ${t.thumbTo})">
              ${icon('image', 22, t.accent, 1.25)}
            </div>
            <div style="margin: 9px 2px 0; font-size: 12.5px; color: ${t.textMuted}">[대표 작업 ${n}]</div>
          </div>`

  const corner = (pos) => `<span style="position: absolute; ${pos} width: 18px; height: 18px; border: 1.5px solid ${t.accent}"></span>`

  const barBtn = (ic, name, primary) => `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; height: 54px; border-radius: 13px; ${primary ? `background: ${t.accent}; border: 1px solid ${t.accent}` : `background: transparent; border: 1px solid ${t.borderStrong}`}">
          ${icon(ic, 19, primary ? t.onAccent : t.accent)}
          <span style="font-size: 11px; font-weight: 500; letter-spacing: -0.01em; color: ${primary ? t.onAccent : t.text}">${name}</span>
        </div>`

  return `<!doctype html>
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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500&family=Noto+Sans+KR:wght@300;400;500;600&display=swap">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${t.accent}; text-decoration: none; }
    a:hover { color: ${t.accentStrong}; }
  </style>
</helmet>
<div style="width: 390px; height: 1660px; display: flex; flex-direction: column; background: ${t.bg}; color: ${t.text}; overflow: hidden">

  <div style="flex: 1 1 auto; min-height: 0">

    <header style="position: relative; padding: 38px 24px 26px; text-align: center">
      <div style="position: absolute; top: 26px; right: 18px; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid ${t.border}; border-radius: 999px">
        ${icon(t.toggle, 18, t.accent)}
      </div>

      <div style="display: flex; align-items: center; justify-content: center; font-family: Montserrat, \"Helvetica Neue\", Arial, sans-serif; font-size: 27px; font-weight: 300; letter-spacing: 0.2em; color: ${t.text}">
        <span>COR</span>
        <span style="display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 19px; height: 19px; margin-right: 0.2em">
          <span style="height: 3px; background: ${t.accent}"></span>
          <span style="height: 3px; background: ${t.accent}"></span>
          <span style="height: 3px; background: ${t.accent}"></span>
        </span>
        <span>LINK</span>
      </div>

      <div style="position: relative; height: 1px; margin: 23px 6px 20px; background: linear-gradient(90deg, transparent, ${t.lineSoft} 10%, ${t.lineStrong} 50%, ${t.lineSoft} 90%, transparent)">
        <span style="position: absolute; left: 12%; top: 50%; width: 4px; height: 4px; transform: translate(-50%, -50%); border-radius: 50%; background: ${t.glow}; box-shadow: 0 0 10px 2px ${t.accent}"></span>
        <span style="position: absolute; left: 30%; top: 50%; width: 4px; height: 4px; transform: translate(-50%, -50%); border-radius: 50%; background: ${t.glow}; box-shadow: 0 0 10px 2px ${t.accent}"></span>
        <span style="position: absolute; left: 50%; top: 50%; width: 5px; height: 5px; transform: translate(-50%, -50%); border-radius: 50%; background: ${t.glow}; box-shadow: 0 0 13px 2px ${t.accent}"></span>
        <span style="position: absolute; left: 70%; top: 50%; width: 4px; height: 4px; transform: translate(-50%, -50%); border-radius: 50%; background: ${t.glow}; box-shadow: 0 0 10px 2px ${t.accent}"></span>
        <span style="position: absolute; left: 88%; top: 50%; width: 4px; height: 4px; transform: translate(-50%, -50%); border-radius: 50%; background: ${t.glow}; box-shadow: 0 0 10px 2px ${t.accent}"></span>
      </div>

      <div style="display: flex; align-items: center; justify-content: center; gap: 13px; font-family: Montserrat, \"Helvetica Neue\", Arial, sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.28em; color: ${t.textMuted}">
        <span>PEOPLE</span><span style="color: ${t.accent}">&times;</span><span>CONTENT</span><span style="color: ${t.accent}">&times;</span><span>MARKETING</span>
      </div>
    </header>

    <section style="display: flex; flex-direction: column; align-items: center; padding: 6px 24px 30px; text-align: center">
      <div style="display: flex; align-items: center; justify-content: center; width: 84px; height: 84px; border: 1px solid ${t.borderStrong}; border-radius: 50%; background: ${t.surface}; font-size: 30px; font-weight: 300; color: ${t.accent}">강</div>
      <h1 style="margin: 16px 0 0; font-size: 29px; font-weight: 600; letter-spacing: 0.04em; color: ${t.text}">강지명</h1>
      <p style="margin: 7px 0 0; font-family: Montserrat, \"Helvetica Neue\", Arial, sans-serif; font-size: 11.5px; font-weight: 400; letter-spacing: 0.13em; color: ${t.accent}">Founder &amp; Content Director</p>
      <span style="width: 34px; height: 1px; margin: 15px 0 0; background: ${t.accent}"></span>
      <p style="max-width: 280px; margin: 15px 0 0; font-size: 13px; line-height: 1.7; color: ${t.textMuted}; text-wrap: pretty">[한 줄 소개 &mdash; 예: 병원 마케팅과 숏폼 콘텐츠로 브랜드를 연결합니다]</p>
    </section>

    <section style="padding: 0 24px 28px">
      ${label(t, '연락처')}
      <div style="display: flex; flex-direction: column; gap: 10px">
${contactRow('phone', '전화', '010-3991-2579')}
${contactRow('mail', '이메일', 'corelink.mail@gmail.com')}
      </div>
    </section>

    <section style="padding: 0 24px 28px">
      ${label(t, '제공 서비스')}
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px">
${SERVICES.map(([ic, name], i) => service(ic, name, i === SERVICES.length - 1)).join('')}
      </div>
    </section>

    <section style="padding: 0 24px 28px">
      ${label(t, '채널')}
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">
${channel('instagram', '인스타그램')}
${channel('youtube', '유튜브')}
      </div>
    </section>

    <section style="padding: 0 0 30px">
      <div style="padding: 0 24px">${label(t, '포트폴리오')}</div>
      <div style="display: flex; gap: 12px; padding: 0 24px; overflow: hidden">
${[1, 2, 3].map(thumb).join('')}
      </div>
    </section>

    <section style="display: flex; flex-direction: column; align-items: center; padding: 0 24px 30px">
      <div style="position: relative; padding: 13px">
        ${corner('top: 0; left: 0; border-right: none; border-bottom: none;')}
        ${corner('top: 0; right: 0; border-left: none; border-bottom: none;')}
        ${corner('bottom: 0; left: 0; border-right: none; border-top: none;')}
        ${corner('bottom: 0; right: 0; border-left: none; border-top: none;')}
        <div style="padding: 9px; background: ${t.qrPanel}; border: 1px solid ${t.border}; border-radius: 4px">${qrSvg(t, 112)}</div>
      </div>
      <p style="margin: 14px 0 0; font-size: 12px; color: ${t.textMuted}">카메라로 스캔하면 이 명함이 열립니다</p>
      <div style="display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; height: 50px; margin: 18px 0 0; border: 1px solid ${t.borderStrong}; border-radius: 13px; color: ${t.text}; font-size: 14px; font-weight: 500">
        ${icon('share', 18, t.accent)}<span>명함 공유하기</span>
      </div>
    </section>

    <footer style="padding: 0 24px 26px; text-align: center; font-size: 11px; letter-spacing: 0.05em; color: ${t.footer}">&copy; 2026 Corelink</footer>
  </div>

  <nav style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; padding: 11px 16px 22px; background: ${t.barBg}; border-top: 1px solid ${t.border}">
${barBtn('phone', '전화하기', false)}
${barBtn('chat', '카카오 상담', false)}
${barBtn('userPlus', '연락처 저장', true)}
  </nav>
</div>
</x-dc>
</body>
</html>
`
}

for (const t of Object.values(THEMES)) {
  writeFileSync(new URL(t.file, import.meta.url), page(t))
  console.log('wrote', t.file)
}

writeFileSync(new URL('canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', title: '다크 (기본)', x: 0, y: 0, w: 390, h: 1660 },
    { file: 'Light.dc.html', title: '라이트', x: 510, y: 0, w: 390, h: 1660 },
  ],
  annotations: [
    { id: 'note-brief', x: 0, y: -150, w: 900, text: '강지명 · Corelink 모바일 명함 — 390×844 화면을 세로로 다 펼친 모습입니다.\n기본은 다크. 우상단 아이콘을 눌러야 라이트로 갑니다.\n대괄호 [ ]로 감싼 곳은 아직 값이 없어 자리만 잡아둔 부분입니다.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n')
console.log('wrote canvas.json')
