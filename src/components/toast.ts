let timer: number | undefined

/** 화면 아래쪽에 잠깐 뜨는 알림. 액션바 위에 겹치지 않게 올라온다. */
export function toast(message: string): void {
  let el = document.querySelector<HTMLDivElement>('.c-toast')
  if (!el) {
    el = document.createElement('div')
    el.className = 'c-toast'
    el.setAttribute('role', 'status')
    el.setAttribute('aria-live', 'polite')
    document.body.append(el)
  }

  el.textContent = message
  // 다시 띄울 때 애니메이션이 처음부터 돌도록 클래스를 한 프레임 뗀다.
  el.classList.remove('is-visible')
  void el.offsetWidth
  el.classList.add('is-visible')

  window.clearTimeout(timer)
  timer = window.setTimeout(() => el?.classList.remove('is-visible'), 1800)
}
