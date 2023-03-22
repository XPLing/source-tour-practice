import { describe, expect, it, vi } from 'vitest'
import { effect, reactive } from '../src'
describe('响应式', () => {
  it('reactive 基本功能', () => {
    const obj = { count: 1 }
    const observed = reactive(obj)
    let dummy
    effect(() => {
      dummy = observed.count
    })
    expect(dummy).toBe(1)
    observed.count++
    expect(dummy).toBe(2)
  })
  it('reactive 读取复杂数据', () => {
    const obj = { count: 1, info: { name: 'xpl' }, settings: { note: '' } }
    const observed = reactive(obj)
    let name, note
    effect(() => {
      name = observed.info.name
    })
    effect(() => {
      note = observed.settings.note
    })
    expect(name).toBe('xpl')
    observed.info.name = 'xpl2'
    expect(name).toBe('xpl2')
    expect(note).toBe('')
    observed.settings = { newNote: 'new' }
    expect(note).toBe(undefined)
  })
  it('reactive 设置复杂数据', () => {
    const obj = { count: 1, info: 'xpl' }
    const observed = reactive(obj)
    let name, note, note2
    effect(() => {
      note = observed.info && observed.info.id
    })
    expect(note).toBe(undefined)

    expect(note2).toBe(undefined)
    observed.info = { id: 'xpl' }
    effect(() => {
      note2 = observed.info && observed.info.id
    })
    expect(note2).toBe('xpl')
    observed.info.id = 'xpl2'
    expect(note2).toBe('xpl2')
    // expect(note).toBe('xpl2')
  })
  it('删除属性的响应式', () => {
    const obj = reactive({ name: 'xpl', count: 1 })
    let val
    effect(() => {
      val = obj.name
    })
    expect(val).toBe('xpl')
    delete obj.name
    expect(val).toBeUndefined()
  })
  it('why reflect', () => {
    const obj = {
      _count: 1,
      get count() {
        return this._count
      }
    }

    const ret = reactive(obj)
    const fn = vi.fn(arg => {})
    effect(() => {
      fn(ret.count) // 触发的是count函数内部的this_count
    })

    expect(fn).toBeCalledTimes(1)
    ret._count++
    // 如果不适用reflect做代理去访问设置对象, _count的改变并不会触发到effect
    expect(fn).toBeCalledTimes(2)
  })
  /**
   * Set Map WeakMap WeakSet类型数据的响应式
   * 这些类型的数据的更改都是通过自身的方法来实现的，如add,delete,clear等
   * 如果不在proxy做特殊处理，那么在执行这些操作的时候只会触发到get
   * {},[]   (Prixy, get,set)
   * number,string  (ref)
   * map set weakmap weakset (Proxy)
   * let obj = {name:'dasheng'}
   * obj.name   //get
   * obj.name = 'xx'  //set
   * let set = new Set([1])
   * set.add(2)  // get ,key是add
   */
  it('Set Map WeakMap WeakSet类型数据的响应式', () => {
    const obj = reactive(new Set([1]))
    let size
    effect(() => {
      size = obj.size
    })
    expect(size).toBe(1)
    obj.add(2)
    expect(size).toBe(2)
  })
  it('Set Delete', () => {
    const obj = reactive(new Set([1, 2]))
    let size
    effect(() => {
      size = obj.size
    })
    expect(size).toBe(2)
    obj.delete(2)
    expect(size).toBe(1)
  })
})
