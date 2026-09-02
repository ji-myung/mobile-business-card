import type { Profile } from '../data/profile'

/** RFC 2426 §5: 역슬래시·세미콜론·쉼표·줄바꿈을 이스케이프한다. */
function escape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** 전화번호에서 숫자만 남긴다. tel: 링크와 vCard 양쪽이 쓴다. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, '')}`
}

/**
 * Profile 을 vCard 3.0 문자열로 만든다.
 * 3.0 을 쓰는 이유: iOS·안드로이드 기본 연락처 앱이 모두 받아준다.
 */
export function buildVCard(p: Profile): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']

  const add = (key: string, value: string) => {
    if (value) lines.push(`${key}:${escape(value)}`)
  }

  lines.push(`N:${escape(p.name)};;;;`)
  add('FN', p.name)
  add('ORG', p.company)
  add('TITLE', p.title)

  const digits = p.phone.replace(/\D/g, '')
  if (digits) lines.push(`TEL;TYPE=CELL:${digits}`)

  add('EMAIL;TYPE=INTERNET', p.email)
  add('URL', p.website)
  add('URL', p.siteUrl)

  if (p.kakaoChannelId) {
    add('X-SOCIALPROFILE;TYPE=kakao', `https://pf.kakao.com/${p.kakaoChannelId}/chat`)
  }
  add('X-SOCIALPROFILE;TYPE=instagram', p.instagram)
  add('X-SOCIALPROFILE;TYPE=youtube', p.youtube)

  add('NOTE', p.services.map((s) => s.label).join(', '))

  lines.push('END:VCARD')
  return lines.join('\r\n')
}
