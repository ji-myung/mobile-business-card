import { html, raw, type Raw } from '../lib/dom'
import { icon } from '../icons'
import type { Theme } from '../lib/theme'

/**
 * CORELINK 로고. E 는 SVG 막대 3개로 그린다.
 * baseline 에 올리고 높이를 대문자 높이(0.7em)로 맞춰야 다른 글자와 세로 크기가 같다.
 */
function logo(): Raw {
  const size = 19
  const cap = Math.round(size * 0.7)
  const bar = Math.max(2, Math.round(cap / 6.3))
  const width = Math.round(size * 0.63)
  const mid = Math.round((cap - bar) / 2)
  return html`<span class="c-logo" aria-label="CORELINK"
    >COR<svg class="c-logo__e" width="${width}" height="${cap}" viewBox="0 0 ${width} ${cap}" aria-hidden="true"
      ><rect width="${width}" height="${bar}" y="0" /><rect width="${width}" height="${bar}" y="${mid}" /><rect
        width="${width}"
        height="${bar}"
        y="${cap - bar}"
    /></svg
    >LINK</span
  >`
}

const DOTS = [12, 30, 50, 70, 88]

export function header(theme: Theme): Raw {
  const next = theme === 'dark' ? '라이트' : '다크'
  return html`
    <header class="c-header">
      ${logo()}
      <button
        class="c-header__toggle tap"
        type="button"
        data-action="toggle-theme"
        aria-label="${next} 테마로 바꾸기"
      >
        <span class="c-header__toggle-dot">
          ${raw(icon(theme === 'dark' ? 'sun' : 'moon', 12, 1.6))}
        </span>
      </button>
      <div class="c-rule" aria-hidden="true">
        ${DOTS.map((left) => html`<span class="c-rule__dot" style="left: ${left}%"></span>`)}
      </div>
    </header>
  `
}
