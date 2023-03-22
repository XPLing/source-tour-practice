import { describe, expect, it, vi } from 'vitest'
import { effect, reactive } from '../src'

describe('TEST effect', () => {
  it('effect 嵌套', () => {
    const obj = { effectCount: 1, effectName: 'xpl' }
    const observed = reactive(obj)
    let count, name
    const fn1 = vi.fn(() => {})
    const fn2 = vi.fn(() => {})

    effect(() => {
      fn1()
      effect(() => {
        fn2()
        name = observed.effectName
      })
      count = observed.effectCount
    })
    expect(count).toBe(1)
    expect(name).toBe('xpl')
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    observed.effectCount = 12
    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(2)
  })
})
