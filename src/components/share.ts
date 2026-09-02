import { html, raw, type Raw } from '../lib/dom'
import { icon } from '../icons'

export function share(): Raw {
  return html`
    <section class="section">
      <button class="c-share" type="button" data-action="share">
        ${raw(icon('share', 18))}<span>명함 공유하기</span>
      </button>
    </section>
  `
}
