import { COLL_KEY } from './reactive'

/*
    对象和依赖的映射关系
    {
        target1: {
            key1: [effect1, effect2, ...],
            ...
        },
        ...
    }
*/
const targetMap = new WeakMap()
// 当前激活的effect,临时存储点，方便依赖收集
let activeEffect = null
const effectStack = [] // 用于存储effect的栈,解决effect嵌套的问题
// 依赖收集
// type 操作类型
export function track(target, type, key) {
  if (!activeEffect) return
  let desMap = targetMap.get(target)
  if (!desMap) targetMap.set(target, (desMap = new Map()))

  let dep = desMap.get(key)
  if (!dep) desMap.set(key, (dep = new Set()))

  if (!dep.has(activeEffect)) dep.add(activeEffect)
  //   console.log(`target: ${target}, key: ${key}, dep: ${dep} ${dep.size}, activeEffect: ${activeEffect.toLocaleString()}`)
}
// 触发依赖
export function trigger(target, type, key) {
  const desMap = targetMap.get(target) // 获取对象的整个依赖
  if (!desMap) return
  if (type.startsWith('collection')) key = COLL_KEY // 针对set map weakmap weakset的特殊处理
  const deps = desMap.get(key) // 获取对象的某个属性的依赖
  if (!deps) return
  deps.forEach(effect => effect()) // 遍历改属性的所有effect，并执行effect
}
export function effect(fn) {
  // activeEffect = fn // 临时存储effect
  // fn() // 执行effect,触发依赖收集(触发get)
  // activeEffect = null // 执行完重置，清空临时存储的effect
  // 如果fn中有嵌套的effect，那么嵌套的effect会在执行的时候，将activeEffect重置为自己，等到折行完毕后就设置为null，这样就会导致上一层的effect丢失（track里面如果activeEffect为null会直接return出来）

  // 嵌套effect解决方案：使用栈，将嵌套的effect存储起来
  activeEffect = fn
  if (!activeEffect) return
  effectStack.push(activeEffect)
  fn()
  effectStack.pop() // 等到嵌套的effect执行完毕后，再将其弹出
  activeEffect = effectStack[effectStack.length - 1] // 将栈顶的effect赋值给 activeEffect, 将activeEffect设置回上一层嵌套的fn
}

// export function reTrack(target, key) {
//     const desMap = targetMap.get(target) // 获取对象的整个依赖
//     if (!desMap) return
//     const dep = desMap.get(key) // 获取对象的某个属性的依赖
//     if (!dep) return
// }
