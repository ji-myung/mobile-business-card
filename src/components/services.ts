import { html, raw, type Raw } from '../lib/dom'
import { icon } from '../icons'
import type { Service } from '../data/profile'

export function services(items: Service[]): Raw {
  if (items.length === 0) return raw('')
  return html`
    <ul class="c-services">
      ${items.map(
        (service) => html`
          <li class="c-services__item">
            ${raw(icon(service.icon, 15, 1.4))}
            <span>${service.label}</span>
          </li>
        `,
      )}
    </ul>
  `
}
