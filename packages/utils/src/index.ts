export function isObject(val: any) {
  return typeof val === 'object'
}

export function isOn(val: string) {
  return val[0] === 'o' && val[1] === 'n'
}
