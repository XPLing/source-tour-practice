import { describe, expect, it } from 'vitest'
import { isObject, isOn, toRawType } from '../src'

describe('TEST Utils', () => {
  it('test isObject', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(1)).toBe(false)
  })
  it('test isOn', () => {
    expect(isOn('onClick')).toBe(true)
    expect(isOn('Click')).toBe(false)
  })
  it('test toRawType', () => {
    expect(toRawType({})).toBe('Object')
    expect(toRawType([])).toBe('Array')
    expect(toRawType(new Set())).toBe('Set')
  })
})
