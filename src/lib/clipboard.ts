/** 클립보드에 복사한다. 성공 여부를 돌려준다. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

/**
 * 명함 링크를 공유한다.
 * Web Share 를 지원하면 시스템 공유 시트를, 아니면 링크 복사로 대체한다.
 */
export async function shareCard(title: string, url: string): Promise<ShareResult> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      return 'shared'
    } catch (error) {
      // 사용자가 공유 시트를 닫은 경우는 실패가 아니다.
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    }
  }
  return (await copyText(url)) ? 'copied' : 'failed'
}
