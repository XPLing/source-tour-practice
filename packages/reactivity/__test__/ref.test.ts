import { describe, expect, it } from 'vitest'
import { effect, ref } from '../src'

describe('TEST ref', () => {
  it('ref 基本功能', () => {
    const num = ref(0)
    let val
    effect(() => {
      val = num.value
    })
    expect(val).toBe(0)
    num.value++
    expect(val).toBe(1)
  })
  it('ref 复杂数据', () => {
    const num = ref({ count: 1 })
    let val
    effect(() => {
      val = num.value.count
    })
    expect(val).toBe(1)
    num.value.count++
    expect(val).toBe(2)
  })
})
