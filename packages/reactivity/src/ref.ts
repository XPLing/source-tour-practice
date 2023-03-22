/**
 * ref 简单实现
 * let num = ref(0)
 * num.value++
 * 通常使用.value,可以使用class的setter和getter来实现
 */

import { track, trigger } from './effect'
import { convert } from './reactive'

export function ref(raw) {
  return new RefImpl(raw)
}

class RefImpl {
  _val: any
  isRef: boolean
  constructor(val) {
    this.isRef = true
    this._val = convert(val)
  }

  get value() {
    track(this, 'ref-get', 'value')
    return this._val
  }

  set value(newVal) {
    if (newVal !== this._val) {
      this._val = newVal
      trigger(this, 'ref-set', 'value')
    }
  }
}
