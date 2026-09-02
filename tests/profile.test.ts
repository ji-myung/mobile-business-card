import { describe, expect, it } from 'vitest'
import { profile } from '../src/data/profile'

describe('profile 데이터', () => {
  it('필수 항목이 비어 있지 않다', () => {
    for (const key of ['name', 'title', 'company', 'phone', 'email', 'siteUrl'] as const) {
      expect(profile[key], key).toBeTruthy()
    }
  })

  it('전화번호는 010-0000-0000 형식이다', () => {
    expect(profile.phone).toMatch(/^\d{2,3}-\d{3,4}-\d{4}$/)
  })

  it('이메일 형식이 맞다', () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('명함 주소는 https 로 시작하고 / 로 끝난다', () => {
    expect(profile.siteUrl).toMatch(/^https:\/\/.+\/$/)
  })

  it('제공 서비스 7개를 담고 있다', () => {
    expect(profile.services).toHaveLength(7)
    expect(profile.services.map((s) => s.label)).toEqual([
      '병원 마케팅',
      '숏폼 컨텐츠',
      '방송 출연자 협업',
      '협찬',
      '블로그',
      '체험단',
      '기자단',
    ])
  })

  it('채워 넣기 전의 선택 항목은 빈 문자열이다', () => {
    // 빈 값은 화면에서 숨긴다. undefined 가 아니라 빈 문자열로 통일한다.
    for (const key of ['website', 'kakaoChannelId', 'instagram', 'youtube'] as const) {
      expect(typeof profile[key], key).toBe('string')
    }
  })

  it('채워 넣은 링크는 http 로 시작한다', () => {
    for (const key of ['website', 'instagram', 'youtube'] as const) {
      const value = profile[key]
      if (value) expect(value, key).toMatch(/^https?:\/\//)
    }
  })
})
