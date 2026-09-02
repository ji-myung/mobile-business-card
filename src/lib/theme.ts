export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

/** 저장된 테마를 읽는다. 없거나 못 읽으면 dark. 시스템 설정은 따르지 않는다. */
export function getTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/** 화면에 테마를 적용하고 저장한다. 저장이 막혀도 화면은 바뀐다. */
export function applyTheme(theme: Theme): Theme {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // 시크릿 모드 등에서 저장이 막힐 수 있다. 이번 세션만 적용된다.
  }
  return theme
}

export function toggleTheme(): Theme {
  return applyTheme(getTheme() === 'dark' ? 'light' : 'dark')
}
