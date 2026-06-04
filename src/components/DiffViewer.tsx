import React, { useRef, useCallback } from 'react'
import type { DiffRow, SortMode } from '../types/diff'
import { ValueToken } from './ValueToken'
import styles from './DiffViewer.module.css'

interface Props {
  rows: DiffRow[]
  sortMode: SortMode
  onSortChange: (mode: SortMode) => void
}

const MARKER: Record<string, { symbol: string; cls: string }> = {
  added:     { symbol: '+', cls: styles.markerAdded },
  removed:   { symbol: '−', cls: styles.markerRemoved },
  changed:   { symbol: '~', cls: styles.markerChanged },
  unchanged: { symbol: ' ', cls: '' },
}

/**
 * 좌우 나란히 diff 뷰.
 * 두 스크롤 컨테이너를 동기화하고, 키 경로 깊이를 들여쓰기로 표현합니다.
 */
export const DiffViewer: React.FC<Props> = ({ rows, sortMode, onSortChange }) => {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const isSyncing = useRef(false)

  const syncLeft = useCallback(() => {
    if (isSyncing.current || !rightRef.current || !leftRef.current) return
    isSyncing.current = true
    rightRef.current.scrollTop = leftRef.current.scrollTop
    isSyncing.current = false
  }, [])

  const syncRight = useCallback(() => {
    if (isSyncing.current || !leftRef.current || !rightRef.current) return
    isSyncing.current = true
    leftRef.current.scrollTop = rightRef.current.scrollTop
    isSyncing.current = false
  }, [])

  if (rows.length === 0) {
    return (
      <div className={styles.empty}>
        <p>표시할 항목이 없습니다</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {/* 정렬 컨트롤 */}
      <div className={styles.toolbar}>
        <label htmlFor="sortMode" className={styles.sortLabel}>정렬:</label>
        <select
          id="sortMode"
          value={sortMode}
          onChange={e => onSortChange(e.target.value as SortMode)}
          className={styles.sortSelect}
        >
          <option value="alpha">키 이름순</option>
          <option value="type">변경 유형순</option>
          <option value="original">원본 순서</option>
        </select>
        <span className={styles.rowCount}>{rows.length}개 항목</span>
      </div>

      {/* diff 테이블 */}
      <div className={styles.grid}>
        {/* 헤더 */}
        <div className={styles.colHeader}>
          <span className={styles.colLabel}>파일 A (기준)</span>
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.colHeader}>
          <span className={styles.colLabel}>파일 B (비교)</span>
        </div>

        {/* 좌측 */}
        <div className={styles.lines} ref={leftRef} onScroll={syncLeft}>
          {rows.map((row, i) => {
            const depth = row.path.split('.').length - 1
            const key   = row.path.split('.').pop() ?? row.path
            const m     = MARKER[row.type]
            const lineClass = row.type === 'removed' ? styles.lineRemoved
                            : row.type === 'changed'  ? styles.lineChanged
                            : row.type === 'unchanged' ? styles.lineUnchanged
                            : styles.lineEmpty

            return (
              <div key={`a-${i}`} className={`${styles.line} ${lineClass}`}>
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={`${styles.marker} ${m.cls}`}>{m.symbol}</span>
                <span className={styles.content} style={{ paddingLeft: depth * 12 }}>
                  <span className={styles.key}>"{key}"</span>
                  <span className={styles.colon}>: </span>
                  {row.type !== 'added'
                    ? <ValueToken
                        value={row.aVal}
                        highlight={row.type === 'removed' ? 'removed' : row.type === 'changed' ? 'changed' : null}
                      />
                    : <span className={styles.absent}>—</span>
                  }
                </span>
              </div>
            )
          })}
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* 우측 */}
        <div className={styles.lines} ref={rightRef} onScroll={syncRight}>
          {rows.map((row, i) => {
            const depth = row.path.split('.').length - 1
            const key   = row.path.split('.').pop() ?? row.path
            const m     = MARKER[row.type]
            const lineClass = row.type === 'added'   ? styles.lineAdded
                            : row.type === 'changed'  ? styles.lineChanged
                            : row.type === 'unchanged' ? styles.lineUnchanged
                            : styles.lineEmpty

            return (
              <div key={`b-${i}`} className={`${styles.line} ${lineClass}`}>
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={`${styles.marker} ${m.cls}`}>{m.symbol}</span>
                <span className={styles.content} style={{ paddingLeft: depth * 12 }}>
                  <span className={styles.key}>"{key}"</span>
                  <span className={styles.colon}>: </span>
                  {row.type !== 'removed'
                    ? <ValueToken
                        value={row.bVal}
                        highlight={row.type === 'added' ? 'added' : row.type === 'changed' ? 'changed' : null}
                      />
                    : <span className={styles.absent}>—</span>
                  }
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
