import './styles/base.css'
import './styles/layout.css'
import './styles/components/header.css'
import './styles/components/card.css'
import './styles/components/channels.css'
import './styles/components/portfolio.css'
import './styles/components/action-bar.css'
import './styles/components/toast.css'

import { actionBar } from './components/action-bar'
import { card } from './components/card'
import { channels } from './components/channels'
import { footer } from './components/footer'
import { header } from './components/header'
import { portfolio } from './components/portfolio'
import { share } from './components/share'
import { toast } from './components/toast'
import { profile } from './data/profile'
import { copyText, shareCard } from './lib/clipboard'
import { html } from './lib/dom'
import { applyTheme, getTheme, toggleTheme } from './lib/theme'

function view(): string {
  return html`
    <div class="card">
      <div class="card__scroll">
        ${header(getTheme())} ${card(profile)} ${channels(profile)}
        ${portfolio(profile.portfolio)} ${share()} ${footer(profile.company)}
      </div>
      ${actionBar(profile)}
    </div>
  `.value
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (app) app.innerHTML = view()
}

/** 클릭은 한 곳에서 받는다. 각 요소는 data-action 으로 무엇을 할지 알린다. */
function onClick(event: MouseEvent): void {
  const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]')
  if (!target) return

  switch (target.dataset.action) {
    case 'toggle-theme': {
      toggleTheme()
      render()
      break
    }
    case 'copy': {
      const value = target.dataset.value ?? ''
      const label = target.dataset.label ?? '내용'
      void copyText(value).then((ok) => toast(ok ? `${label}를 복사했습니다` : '복사하지 못했습니다'))
      break
    }
    case 'share': {
      void shareCard(`${profile.name} | ${profile.company}`, profile.siteUrl).then((result) => {
        if (result === 'copied') toast('명함 링크를 복사했습니다')
        else if (result === 'failed') toast('공유하지 못했습니다')
      })
      break
    }
  }
}

applyTheme(getTheme())
render()
document.addEventListener('click', onClick)
