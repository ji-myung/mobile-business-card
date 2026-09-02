import { html, raw, type Raw } from '../lib/dom'
import { icon, type IconName } from '../icons'
import type { Profile } from '../data/profile'

/** 인스타그램·유튜브. 둘 다 비어 있으면 섹션째 그리지 않는다. */
export function channels(p: Profile): Raw {
  const links: { ic: IconName; label: string; href: string }[] = []
  if (p.instagram) links.push({ ic: 'instagram', label: '인스타그램', href: p.instagram })
  if (p.youtube) links.push({ ic: 'youtube', label: '유튜브', href: p.youtube })
  if (links.length === 0) return raw('')

  return html`
    <section class="section">
      <div class="section__label"><span class="section__label-text">채널</span></div>
      <div class="c-channels">
        ${links.map(
          (link) => html`
            <a class="c-channels__item" href="${link.href}" target="_blank" rel="noopener noreferrer">
              ${raw(icon(link.ic, 17))}<span>${link.label}</span>
            </a>
          `,
        )}
      </div>
    </section>
  `
}
