import { html, raw, type Raw } from '../lib/dom'
import { icon } from '../icons'
import type { Theme } from '../lib/theme'

/**
 * CORELINK 로고. E 는 SVG 막대 3개로 그린다.
 *
 * 크기를 px 로 계산하면 반올림 때문에 막대 간격이 어긋난다 (4px, 3px 처럼).
 * 그래서 viewBox 안에서 정수 비율로 고정하고, 바깥 크기는 CSS 가 em 으로 준다.
 * 글꼴 크기가 얼마든, 화면이 무엇이든 막대 간격이 균등하고
 * 전체 높이가 대문자 높이(0.7em)와 정확히 같다.
 *
 *   막대 22 + 간격 37 + 막대 22 + 간격 37 + 막대 22 = 140
 */
function logo(): Raw {
  return html`<span class="c-logo" aria-label="CORELINK"
    >COR<svg class="c-logo__e" viewBox="0 0 126 140" aria-hidden="true" focusable="false"
      ><rect width="126" height="22" y="0" /><rect width="126" height="22" y="59" /><rect
        width="126"
        height="22"
        y="118"
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
