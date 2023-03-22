import { isObject } from '@xpl/utils'

const ret = isObject({})
console.log(ret)

export { reactive } from './reactive'
export { effect } from './effect'
export { ref } from './ref'
