import { html, type Raw } from '../lib/dom'

export function footer(company: string): Raw {
  const year = new Date().getFullYear()
  return html`<footer class="c-footer">© ${year} ${company}</footer>`
}
