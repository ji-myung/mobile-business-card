import QRCode from 'qrcode'
import type { Plugin } from 'vite'
import { profile } from '../src/data/profile'

const ID = 'virtual:qr'
const RESOLVED = '\0' + ID

/**
 * 명함 주소를 담은 QR 을 빌드 시점에 SVG 로 굽는다.
 * 런타임 의존성 없이 인라인으로 들어가고, siteUrl 이 바뀌면 자동으로 따라간다.
 */
export function qrPlugin(): Plugin {
  return {
    name: 'qr',
    resolveId: (id) => (id === ID ? RESOLVED : null),
    async load(id) {
      if (id !== RESOLVED) return null
      const svg = await QRCode.toString(profile.siteUrl, {
        type: 'svg',
        margin: 0,
        errorCorrectionLevel: 'M',
        // 색은 CSS 가 정하도록 currentColor 로 바꿔 끼운다.
        color: { dark: '#000000', light: '#0000' },
      })
      const themed = svg
        .replace(/stroke="#000000"/g, 'stroke="currentColor"')
        .replace(/fill="#000000"/g, 'fill="currentColor"')
      return `export const qrSvg = ${JSON.stringify(themed)}`
    },
  }
}
