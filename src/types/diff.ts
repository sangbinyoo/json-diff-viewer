export type DiffType = 'added' | 'removed' | 'changed' | 'unchanged'

export type SortMode = 'alpha' | 'type' | 'original'

export type FilterMode = 'all' | DiffType

export interface DiffRow {
  path: string
  type: DiffType
  aVal: unknown
  bVal: unknown
}

export interface DiffStats {
  total: number
  added: number
  removed: number
  changed: number
  unchanged: number
}

export interface JsonInputState {
  raw: string
  parsed: unknown | null
  error: string | null
  fileName: string | null
}
