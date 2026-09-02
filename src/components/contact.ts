import { html, raw, type Raw } from '../lib/dom'
import { icon, type IconName } from '../icons'
import { telHref } from '../lib/vcard'
import type { Profile } from '../data/profile'

interface Row {
  ic: IconName
  caption: string
  value: string
  href: string
  external?: boolean
}

function row({ ic, caption, value, href, external }: Row): Raw {
  return html`
    <li class="c-contact__row">
      <a
        class="c-contact__link"
        href="${href}"
        ${raw(external ? 'target="_blank" rel="noopener noreferrer"' : '')}
      >
        ${raw(icon(ic, 17))}
        <span class="c-contact__text">
          <span class="c-contact__caption">${caption}</span>
          <span class="c-contact__value">${value}</span>
        </span>
      </a>
      <button
        class="c-contact__copy tap"
        type="button"
        data-action="copy"
        data-value="${value}"
        data-label="${caption}"
        aria-label="${caption} 복사"
      >
        ${raw(icon('copy', 15))}
      </button>
    </li>
  `
}

export function contact(p: Profile): Raw {
  const rows: Row[] = [
    { ic: 'phone', caption: '전화', value: p.phone, href: telHref(p.phone) },
    { ic: 'mail', caption: '이메일', value: p.email, href: `mailto:${p.email}` },
  ]
  // 빈 값은 줄을 만들지 않는다.
  if (p.website) {
    rows.push({
      ic: 'globe',
      caption: '홈페이지',
      value: p.website.replace(/^https?:\/\//, ''),
      href: p.website,
      external: true,
    })
  }
  return html`<ul class="c-contact">${rows.map(row)}</ul>`
}
