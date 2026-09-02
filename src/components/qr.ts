import { qrSvg } from 'virtual:qr'
import { html, raw, type Raw } from '../lib/dom'

/** 명함 주소를 담은 QR. 골드 코너 프레임은 CSS 로 그린다. */
export function qr(): Raw {
  return html`
    <div class="c-qr">
      <div class="c-qr__frame">
        <div class="c-qr__panel">${raw(qrSvg)}</div>
      </div>
      <span class="c-qr__caption">SCAN</span>
    </div>
  `
}
