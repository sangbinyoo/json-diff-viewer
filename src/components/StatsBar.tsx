import React from 'react'
import type { DiffStats, FilterMode } from '../types/diff'
import styles from './StatsBar.module.css'

interface Props {
  stats: DiffStats
  filterMode: FilterMode
  onFilterChange: (mode: FilterMode) => void
}

const FILTERS: { mode: FilterMode; label: string }[] = [
  { mode: 'all', label: '전체' },
  { mode: 'changed', label: '변경' },
  { mode: 'added', label: '추가' },
  { mode: 'removed', label: '삭제' },
  { mode: 'unchanged', label: '동일' },
]

export const StatsBar: React.FC<Props> = ({ stats, filterMode, onFilterChange }) => (
  <div className={styles.wrapper}>
    <div className={styles.cards}>
      <div className={styles.card}>
        <span className={styles.num}>{stats.total}</span>
        <span className={styles.lbl}>전체 키</span>
      </div>
      <div className={`${styles.card} ${styles.added}`}>
        <span className={styles.num}>{stats.added}</span>
        <span className={styles.lbl}>추가됨</span>
      </div>
      <div className={`${styles.card} ${styles.removed}`}>
        <span className={styles.num}>{stats.removed}</span>
        <span className={styles.lbl}>삭제됨</span>
      </div>
      <div className={`${styles.card} ${styles.changed}`}>
        <span className={styles.num}>{stats.changed}</span>
        <span className={styles.lbl}>변경됨</span>
      </div>
    </div>

    <div className={styles.filters} role="group" aria-label="필터">
      {FILTERS.map(({ mode, label }) => (
        <button
          key={mode}
          className={`${styles.filterBtn} ${filterMode === mode ? styles.active : ''}`}
          onClick={() => onFilterChange(mode)}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
)
