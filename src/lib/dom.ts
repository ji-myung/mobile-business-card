/** 신뢰할 수 있는 HTML 조각. html`` 안에서 이스케이프를 건너뛴다. */
export class Raw {
  constructor(readonly value: string) {}
}

export const raw = (value: string): Raw => new Raw(value)

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Value = string | number | Raw | Value[] | null | undefined | false

function stringify(value: Value): string {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof Raw) return value.value
  if (Array.isArray(value)) return value.map(stringify).join('')
  return escapeHtml(String(value))
}

/**
 * 기본은 이스케이프. 아이콘이나 다른 컴포넌트 출력처럼 이미 HTML 인 값만
 * raw() 로 감싼다. profile.ts 의 값이 그대로 마크업에 새지 않게 하는 장치다.
 */
export function html(strings: TemplateStringsArray, ...values: Value[]): Raw {
  let out = strings[0] ?? ''
  for (let i = 0; i < values.length; i++) {
    out += stringify(values[i]) + (strings[i + 1] ?? '')
  }
  return new Raw(out)
}
