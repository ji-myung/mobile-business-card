import { html, raw, type Raw } from '../lib/dom'
import { icon, type IconName } from '../icons'
import { telHref } from '../lib/vcard'
import type { Profile } from '../data/profile'

interface Action {
  ic: IconName
  label: string
  href: string
  primary?: boolean
  download?: boolean
}

/**
 * 하단 고정 액션바.
 * 연락처 저장은 card.vcf 를 그냥 링크로 건다 — download 속성을 붙이지 않는다.
 * iOS 는 연락처 추가 시트를, 안드로이드는 다운로드를 띄운다.
 */
export function actionBar(p: Profile): Raw {
  const actions: Action[] = [{ ic: 'phone', label: '전화하기', href: telHref(p.phone) }]

  // 카카오 채널이 없으면 버튼을 비활성으로 두지 않고 아예 뺀다. 남은 둘로 자리를 나눈다.
  if (p.kakaoChannelId) {
    actions.push({
      ic: 'chat',
      label: '카카오 상담',
      href: `https://pf.kakao.com/${p.kakaoChannelId}/chat`,
    })
  }

  actions.push({
    ic: 'userPlus',
    label: '연락처 저장',
    href: `${import.meta.env.BASE_URL}card.vcf`,
    primary: true,
  })

  return html`
    <nav class="c-bar" style="--bar-count: ${actions.length}">
      ${actions.map(
        (action) => html`
          <a
            class="c-bar__button${action.primary ? ' c-bar__button--primary' : ''}"
            href="${action.href}"
            ${raw(action.href.startsWith('https://pf.kakao') ? 'target="_blank" rel="noopener noreferrer"' : '')}
          >
            ${raw(icon(action.ic, 19))}<span>${action.label}</span>
          </a>
        `,
      )}
    </nav>
  `
}
