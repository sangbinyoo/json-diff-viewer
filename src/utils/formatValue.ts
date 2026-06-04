/**
 * JSON 값을 사람이 읽기 좋은 형태로 변환합니다.
 * React JSX 대신 문자열을 반환하고, 컴포넌트에서 span으로 감쌉니다.
 */
export type ValueToken =
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'null' }
  | { kind: 'undefined' }
  | { kind: 'array'; length: number }
  | { kind: 'object'; keys: number }

export function tokenizeValue(val: unknown): ValueToken {
  if (val === undefined) return { kind: 'undefined' }
  if (val === null) return { kind: 'null' }
  if (typeof val === 'boolean') return { kind: 'boolean', value: val }
  if (typeof val === 'number') return { kind: 'number', value: val }
  if (typeof val === 'string') return { kind: 'string', value: val }
  if (Array.isArray(val)) return { kind: 'array', length: val.length }
  if (typeof val === 'object') return { kind: 'object', keys: Object.keys(val as object).length }
  return { kind: 'string', value: String(val) }
}
