import { useState, useMemo, useCallback } from 'react'
import { deepDiff, sortDiff, calcStats } from '../utils/deepDiff'
import type { DiffRow, DiffStats, FilterMode, SortMode } from '../types/diff'

interface UseDiffReturn {
  rows: DiffRow[]
  stats: DiffStats | null
  sortMode: SortMode
  filterMode: FilterMode
  setSortMode: (mode: SortMode) => void
  setFilterMode: (mode: FilterMode) => void
  runDiff: (a: unknown, b: unknown) => void
  clearDiff: () => void
}

/**
 * diff 결과 계산, 정렬, 필터를 관리하는 커스텀 훅.
 * UI 상태(sortMode, filterMode)는 이 훅이 소유하고,
 * 실제 비교 로직은 utils/deepDiff 에 위임합니다.
 */
export function useDiff(): UseDiffReturn {
  const [rawRows, setRawRows] = useState<DiffRow[]>([])
  const [stats, setStats] = useState<DiffStats | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('alpha')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const runDiff = useCallback((a: unknown, b: unknown) => {
    const result = deepDiff(a, b)
    setRawRows(result)
    setStats(calcStats(result))
  }, [])

  const clearDiff = useCallback(() => {
    setRawRows([])
    setStats(null)
  }, [])

  const rows = useMemo(() => {
    const filtered =
      filterMode === 'all' ? rawRows : rawRows.filter(r => r.type === filterMode)
    return sortDiff(filtered, sortMode)
  }, [rawRows, sortMode, filterMode])

  return { rows, stats, sortMode, filterMode, setSortMode, setFilterMode, runDiff, clearDiff }
}
