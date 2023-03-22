export function isObject(val: any) {
  return typeof val === 'object'
}

export function isOn(val: string) {
  return val[0] === 'o' && val[1] === 'n'
}
export function toRawType(val: any) {
  let str = Object.prototype.toString.call(val)
  str = str.replace(/^\[object\s?([^\]]+)\]$/, '$1')
  return str
}
