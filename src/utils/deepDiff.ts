import type { DiffRow, DiffStats, SortMode } from '../types/diff'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 두 JSON 값을 재귀적으로 비교하여 DiffRow 배열을 반환합니다.
 * 중첩 객체는 키 경로(예: "user.settings.theme")로 펼쳐집니다.
 * 배열은 JSON 직렬화 비교로 동일 여부만 확인합니다.
 */
export function deepDiff(
  a: unknown,
  b: unknown,
  path = ''
): DiffRow[] {
  const results: DiffRow[] = []

  const objA = isPlainObject(a) ? a : {}
  const objB = isPlainObject(b) ? b : {}
  const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)])

  for (const key of allKeys) {
    const fullPath = path ? `${path}.${key}` : key
    const aHas = Object.prototype.hasOwnProperty.call(objA, key)
    const bHas = Object.prototype.hasOwnProperty.call(objB, key)
    const aVal = objA[key]
    const bVal = objB[key]

    if (!aHas) {
      results.push({ path: fullPath, type: 'added', aVal: undefined, bVal })
    } else if (!bHas) {
      results.push({ path: fullPath, type: 'removed', aVal, bVal: undefined })
    } else if (isPlainObject(aVal) && isPlainObject(bVal)) {
      // 중첩 객체: 재귀 탐색
      results.push(...deepDiff(aVal, bVal, fullPath))
    } else if (JSON.stringify(aVal) !== JSON.stringify(bVal)) {
      results.push({ path: fullPath, type: 'changed', aVal, bVal })
    } else {
      results.push({ path: fullPath, type: 'unchanged', aVal, bVal })
    }
  }

  return results
}

const SORT_ORDER: Record<string, number> = {
  removed: 0,
  changed: 1,
  added: 2,
  unchanged: 3,
}

export function sortDiff(rows: DiffRow[], mode: SortMode): DiffRow[] {
  const copy = [...rows]
  if (mode === 'alpha') return copy.sort((a, b) => a.path.localeCompare(b.path))
  if (mode === 'type') return copy.sort((a, b) => SORT_ORDER[a.type] - SORT_ORDER[b.type])
  return copy // 'original' — 원본 순서 유지
}

export function calcStats(rows: DiffRow[]): DiffStats {
  const stats: DiffStats = { total: rows.length, added: 0, removed: 0, changed: 0, unchanged: 0 }
  for (const row of rows) stats[row.type]++
  return stats
}
