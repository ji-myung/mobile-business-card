import { describe, expect, it } from 'vitest'

describe('toolchain', () => {
  it('runs vitest in a DOM environment', () => {
    expect(typeof document).toBe('object')
  })
})
