import { html, raw, type Raw } from '../lib/dom'
import { icon } from '../icons'
import type { PortfolioItem } from '../data/profile'

/**
 * 대표 작업을 카드로 겹쳐 쌓는다.
 * 세로로 늘어놓으면 화면이 길어져서, 맨 앞 한 장만 보여주고 나머지는 옆으로 민다.
 */
export function portfolio(items: PortfolioItem[]): Raw {
  const first = items[0]
  if (!first) return raw('')
  const rest = items.length - 1

  const front = first.thumbnail
    ? html`<img class="c-stack__image" src="${first.thumbnail}" alt="${first.title}" />`
    : html`${raw(icon('image', 24, 1.25))}<span class="c-stack__title">${first.title}</span>`

  return html`
    <section class="section section--flush">
      <div class="section__label section__label--inset">
        <span class="section__label-text">포트폴리오</span>
      </div>
      <div class="c-stack">
        ${items.length > 2 ? html`<span class="c-stack__layer c-stack__layer--back"></span>` : raw('')}
        ${items.length > 1 ? html`<span class="c-stack__layer c-stack__layer--mid"></span>` : raw('')}
        ${first.url
          ? html`<a class="c-stack__front" href="${first.url}" target="_blank" rel="noopener noreferrer"
              >${front}</a
            >`
          : html`<div class="c-stack__front">${front}</div>`}
        ${rest > 0 ? html`<span class="c-stack__more">+${rest}건 · 밀어서 보기</span>` : raw('')}
      </div>
    </section>
  `
}
