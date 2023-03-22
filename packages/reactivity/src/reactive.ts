import { isObject, toRawType } from '@xpl/utils'
import { track, trigger } from './effect'
const enum TargetType {
  INVALID = 0,
  COMMON = 1, // 普通对象
  COLLECTION = 2 // es6 中的map、set、weakset,weakmap
}
function targetTypeMap(type: string) {
  switch (type) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}
/**
 * COLL_KEY collection依赖的特殊key
 * 由于像set这种类型的数据操作都是通过get，因此如果想在改变数据时触发effect，就得设置一个特殊的key，然后在数据改变的时候即在trigger时做特殊判断，利用这个key来查找effect
 * 比如在set的size上添加一个effect，如果此时在set上对size添加effect，那么在执行set的add时，按照原来的逻辑会使用add这个可以去找effcet，但一开始收集依赖是收集在size上的，所以会触发不到size的effect
 * NOTE: size的变化是有add触发的，收集effect是在get size上收集，但没有直接拦截size的变化处理，因此只能通过add的拦截去做处理
 */
export const COLL_KEY = Symbol('collection')
const baseHandles = {
  get(target, key, receiver) {
    // 为了适配复杂类型的数据，比如对象中的对象，我们需要将对象中的对象也转换为响应式对象，以便于后续的依赖收集和触发
    // eg: target = {info:{name: xxx}}
    // 如果不转换，那么后续的依赖收集和触发都是针对info这个对象的，而不是info.name这个属性
    const ref = convert(Reflect.get(target, key, receiver))
    //   console.log('get key-------', key, ref)

    track(target, 'get', key) // 依赖收集
    // return Reflect.get(target, key, receiver)
    // 如果val是一个引用类型的数值（object），直接把val返回的话，那就漏掉了对val的依赖收集，之后val里面属性的更改都会监测不到
    return ref
  },
  set(target, key, value, receiver) {
    const oldVal = target[key]
    if (oldVal === value) return true
    // console.log('set-------key', key, target, value);
    const ref = Reflect.set(target, key, value, receiver)
    // TODO:
    // value是对象的时候，之前为key设置的依赖会丢失，因为value是一个新的对象，所以需要重新为value设置依赖
    // if(isObject(value)){}
    trigger(target, 'set', key) // 触发依赖
    // console.log('set-------end', target);
    return ref
  },
  deleteProperty(target, p) {
    const ref = Reflect.deleteProperty(target, p)
    trigger(target, 'delete', p)
    return ref
  }
}
const collectionHandles = {
  get(target, key, receiver) {
    // console.log('collection get-------', key, target)
    if (key === '__reactive_raw') return target
    if (key === 'size') {
      // size 响应式监听
      track(target, 'collection-size', COLL_KEY)
      return Reflect.get(target, key)
    }
    return collectionActions[key]
  }
}
const collectionActions = {
  add(key: any) {
    // console.log('add-------', key, 'this-----', this, '__reactive_raw------', this.__reactive_raw)
    const target = this.__reactive_raw
    const ref = target.add(key)
    // console.log('ref ---- ', ref)
    trigger(target, 'collection-add', key)
    return ref
  },
  delete(key) {
    const target = this.__reactive_raw
    const ref = target.delete(key)
    trigger(target, 'collection-delete', key)
    return ref
  }
}
function handlesMap(type: TargetType) {
  switch (type) {
    case TargetType.COMMON:
      return baseHandles
    case TargetType.COLLECTION:
      return collectionHandles
    default:
      return {}
  }
}
export function reactive(obj: any) {
  const handles = handlesMap(targetTypeMap(toRawType(obj)))
  return new Proxy(obj, handles)
}
// convert 函数是为了将对象中的对象也转换为响应式对象
export function convert(val) {
  return isObject(val) ? reactive(val) : val
}
