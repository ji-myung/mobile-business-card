import { describe, expect, it } from 'vitest'
import { buildVCard, telHref } from '../src/lib/vcard'
import type { Profile } from '../src/data/profile'

const base: Profile = {
  name: '강지명',
  title: 'Founder | Content Director',
  company: 'Corelink',
  bio: '소개글',
  phone: '010-3991-2579',
  email: 'corelink.mail@gmail.com',
  website: '',
  kakaoChannelId: '',
  instagram: '',
  youtube: '',
  services: [],
  portfolio: [],
  siteUrl: 'https://ji-myung.github.io/corelink-mobile/',
}

const lines = (p: Profile) => buildVCard(p).split('\r\n')

describe('buildVCard', () => {
  it('vCard 3.0 봉투로 감싼다', () => {
    const l = lines(base)
    expect(l[0]).toBe('BEGIN:VCARD')
    expect(l[1]).toBe('VERSION:3.0')
    expect(l.at(-1)).toBe('END:VCARD')
  })

  it('줄바꿈은 CRLF 를 쓴다', () => {
    // RFC 2426 요구사항. LF 만 쓰면 일부 안드로이드 연락처 앱이 거른다.
    expect(buildVCard(base)).toContain('\r\n')
    expect(buildVCard(base).replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('이름을 N 과 FN 양쪽에 넣는다', () => {
    const l = lines(base)
    expect(l).toContain('N:강지명;;;;')
    expect(l).toContain('FN:강지명')
  })

  it('회사와 직함을 넣는다', () => {
    const l = lines(base)
    expect(l).toContain('ORG:Corelink')
    expect(l).toContain('TITLE:Founder | Content Director')
  })

  it('전화번호는 하이픈 없이 넣는다', () => {
    expect(lines(base)).toContain('TEL;TYPE=CELL:01039912579')
  })

  it('이메일을 넣는다', () => {
    expect(lines(base)).toContain('EMAIL;TYPE=INTERNET:corelink.mail@gmail.com')
  })

  it('명함 주소를 URL 로 넣는다', () => {
    expect(lines(base)).toContain('URL:https://ji-myung.github.io/corelink-mobile/')
  })

  it('홈페이지가 비어 있으면 그 줄을 만들지 않는다', () => {
    expect(buildVCard(base)).not.toContain('URL:\r\n')
  })

  it('홈페이지가 있으면 명함 주소와 함께 넣는다', () => {
    const l = lines({ ...base, website: 'https://corelink.kr' })
    expect(l).toContain('URL:https://corelink.kr')
    expect(l).toContain('URL:https://ji-myung.github.io/corelink-mobile/')
  })

  it('제공 서비스를 NOTE 로 요약한다', () => {
    const l = lines({
      ...base,
      services: [
        { label: '병원 마케팅', icon: 'cross' },
        { label: '숏폼 컨텐츠', icon: 'play' },
      ],
    })
    expect(l).toContain('NOTE:병원 마케팅\\, 숏폼 컨텐츠')
  })

  it('세미콜론·쉼표·역슬래시·줄바꿈을 이스케이프한다', () => {
    const l = lines({ ...base, company: 'A;B,C\\D', bio: '한 줄\n두 줄' })
    expect(l).toContain('ORG:A\;B\\,C\\\\D')
  })

  it('소셜 링크가 있으면 넣고 없으면 뺀다', () => {
    expect(buildVCard(base)).not.toContain('X-SOCIALPROFILE')
    const l = lines({ ...base, instagram: 'https://instagram.com/x' })
    expect(l).toContain('X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/x')
  })

  it('빈 값으로 된 줄을 하나도 남기지 않는다', () => {
    for (const line of lines(base)) {
      expect(line.endsWith(':')).toBe(false)
    }
  })
})

describe('telHref', () => {
  it('하이픈을 지우고 tel: 을 붙인다', () => {
    expect(telHref('010-3991-2579')).toBe('tel:01039912579')
  })

  it('공백과 괄호도 지운다', () => {
    expect(telHref('(02) 123 4567')).toBe('tel:021234567')
  })
})
