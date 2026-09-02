import { html, raw, type Raw } from '../lib/dom'
import { contact } from './contact'
import { qr } from './qr'
import { services } from './services'
import type { Profile } from '../data/profile'

/**
 * 히어로 카드 — 종이 명함 뒷면을 그대로 옮긴 부분.
 * 세로 골드 규칙을 사이에 두고 왼쪽에 서비스, 오른쪽에 QR 이 선다.
 */
export function card(p: Profile): Raw {
  return html`
    <section class="c-card">
      <h1 class="c-card__name">${p.name}</h1>
      <p class="c-card__title">${p.title}</p>
      <span class="c-card__underline" aria-hidden="true"></span>
      ${p.bio ? html`<p class="c-card__bio">${p.bio}</p>` : raw('')}

      <div class="c-card__body">
        ${services(p.services)}
        <span class="c-card__divider" aria-hidden="true"></span>
        ${qr()}
      </div>

      <span class="c-card__hairline" aria-hidden="true"></span>
      ${contact(p)}
    </section>
  `
}
