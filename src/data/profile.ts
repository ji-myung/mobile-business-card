import type { IconName } from '../icons'

export interface Service {
  label: string
  icon: IconName
}

export interface PortfolioItem {
  title: string
  /** public/portfolio/ 아래 파일명. 없으면 골드 그라데이션 자리표시자를 그린다. */
  thumbnail: string
  url: string
}

export interface Profile {
  name: string
  title: string
  company: string
  tagline: string[]
  bio: string
  phone: string
  email: string
  /** 아래 네 항목은 빈 문자열이면 화면에서 통째로 숨긴다. */
  website: string
  /** pf.kakao.com/_XXXX 의 _XXXX 부분 */
  kakaoChannelId: string
  instagram: string
  youtube: string
  services: Service[]
  portfolio: PortfolioItem[]
  /** 공유·QR 이 가리키는 이 명함의 주소 */
  siteUrl: string
}

/** ★ 명함 내용은 전부 여기서 온다. 화면·vCard·공유 문구가 이 값을 따라간다. */
export const profile: Profile = {
  name: '강지명',
  title: 'Founder & Content Director',
  company: 'Corelink',
  tagline: ['PEOPLE', 'CONTENT', 'MARKETING'],
  bio: '',

  phone: '010-3991-2579',
  email: 'corelink.mail@gmail.com',

  website: '',
  kakaoChannelId: '',
  instagram: '',
  youtube: '',

  services: [
    { label: '병원 마케팅', icon: 'cross' },
    { label: '숏폼 컨텐츠', icon: 'play' },
    { label: '방송 출연자 협업', icon: 'users' },
    { label: '협찬', icon: 'gift' },
    { label: '블로그', icon: 'pen' },
    { label: '체험단', icon: 'sparkles' },
    { label: '기자단', icon: 'news' },
  ],

  portfolio: [],

  siteUrl: 'https://ji-myung.github.io/mobile-business-card/',
}
