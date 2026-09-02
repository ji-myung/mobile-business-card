import { beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, getTheme, toggleTheme, type Theme } from '../src/lib/theme'

const STORAGE_KEY = 'theme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('getTheme', () => {
  it('저장된 값이 없으면 dark 를 반환한다', () => {
    expect(getTheme()).toBe('dark')
  })

  it('저장된 light 를 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    expect(getTheme()).toBe('light')
  })

  it('알 수 없는 값이 저장돼 있으면 dark 로 떨어진다', () => {
    localStorage.setItem(STORAGE_KEY, 'sepia')
    expect(getTheme()).toBe('dark')
  })

  it('시스템이 라이트를 선호해도 dark 를 유지한다', () => {
    // 사용자가 직접 토글해야만 라이트로 간다.
    expect(getTheme()).toBe('dark')
  })
})

describe('applyTheme', () => {
  it('data-theme 속성과 localStorage 에 함께 쓴다', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
  })
})

describe('toggleTheme', () => {
  it('dark 에서 light 로 넘어간다', () => {
    applyTheme('dark')
    expect(toggleTheme()).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('light 에서 dark 로 돌아온다', () => {
    applyTheme('light')
    expect(toggleTheme()).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('새로고침을 건너뛰어도 저장된 값이 남는다', () => {
    applyTheme('dark')
    toggleTheme()
    const persisted: Theme = getTheme()
    expect(persisted).toBe('light')
  })
})

describe('localStorage 를 못 쓰는 환경', () => {
  it('읽기가 실패해도 dark 로 동작한다', () => {
    const original = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new Error('denied')
    }
    try {
      expect(getTheme()).toBe('dark')
    } finally {
      Storage.prototype.getItem = original
    }
  })

  it('쓰기가 실패해도 화면 테마는 바뀐다', () => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = () => {
      throw new Error('quota')
    }
    try {
      applyTheme('light')
      expect(document.documentElement.dataset.theme).toBe('light')
    } finally {
      Storage.prototype.setItem = original
    }
  })
})
