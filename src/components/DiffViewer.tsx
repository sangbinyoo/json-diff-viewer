import React, { useState, useMemo } from 'react'
import type { DiffRow, SortMode, FilterMode } from '../types/diff'
import type { TreeNode } from '../utils/buildTree'
import { buildTree } from '../utils/buildTree'
import { ValueToken } from './ValueToken'
import styles from './DiffViewer.module.css'

interface Props {
  rows: DiffRow[]
  sortMode: SortMode
  filterMode: FilterMode
  onSortChange: (mode: SortMode) => void
}

// ── 마커 설정 ──────────────────────────────────────────────
const MARKER_MAP = {
  added:     { symbol: '+', label: 'added' },
  removed:   { symbol: '-', label: 'removed' },
  changed:   { symbol: 'M', label: 'changed' },
  unchanged: { symbol: ' ', label: 'unchanged' },
} as const

// ── 단일 트리 노드 컴포넌트 ────────────────────────────────
interface TreeNodeRowProps {
  node: TreeNode
  depth: number
  filterMode: FilterMode
}

const TreeNodeRow: React.FC<TreeNodeRowProps> = ({ node, depth, filterMode }) => {
  const [expanded, setExpanded] = useState(true)

  const hasChildren = node.children.length > 0
  const marker = MARKER_MAP[node.type]

  // 필터 적용: unchanged 필터가 아닌데 이 노드와 자손 모두 unchanged면 숨김
  const isVisible = (() => {
    if (filterMode === 'all') return true
    if (filterMode === 'unchanged') return node.type === 'unchanged' && !node.hasChangedDescendant
    // changed/added/removed 필터: 해당 type 이거나 그런 자손을 가진 경우 표시
    if (node.type === filterMode) return true
    if (hasChildren && node.hasChangedDescendant) return true
    return false
  })()

  if (!isVisible) return null

  const indentPx = depth * 20

  return (
    <>
      <div
        className={`${styles.row} ${styles[`row_${node.type}`]}`}
        style={{ paddingLeft: indentPx + 8 }}
      >
        {/* 토글 버튼 */}
        <span
          className={`${styles.toggle} ${hasChildren ? styles.toggleVisible : ''}`}
          onClick={() => hasChildren && setExpanded(v => !v)}
          aria-label={expanded ? '접기' : '펼치기'}
          role={hasChildren ? 'button' : undefined}
          tabIndex={hasChildren ? 0 : undefined}
          onKeyDown={e => e.key === 'Enter' && hasChildren && setExpanded(v => !v)}
        >
          {hasChildren ? (expanded ? '▾' : '▸') : ''}
        </span>

        {/* 변경 마커 뱃지 */}
        <span
          className={`${styles.marker} ${node.type !== 'unchanged' ? styles[`marker_${node.type}`] : styles.markerHidden}`}
          aria-label={marker.label}
        >
          {marker.symbol}
        </span>

        {/* 키 이름 */}
        <span className={`${styles.key} ${hasChildren ? styles.keyBold : ''}`}>
          {node.key}
        </span>

        {/* 값 표시 */}
        {!hasChildren && (
          <span className={styles.values}>
            {node.type === 'changed' ? (
              <>
                <ValueToken value={node.aVal} highlight="removed" />
                <span className={styles.arrow}>→</span>
                <ValueToken value={node.bVal} highlight="added" />
              </>
            ) : node.type === 'added' ? (
              <ValueToken value={node.bVal} highlight="added" />
            ) : node.type === 'removed' ? (
              <ValueToken value={node.aVal} highlight="removed" />
            ) : (
              <ValueToken value={node.aVal} />
            )}
          </span>
        )}

        {/* 객체 노드: 자식 카운트 표시 */}
        {hasChildren && (
          <span className={styles.childCount}>
            {node.children.length}개 키
          </span>
        )}
      </div>

      {/* 자식 노드 재귀 렌더 */}
      {hasChildren && expanded && node.children.map(child => (
        <TreeNodeRow
          key={child.path}
          node={child}
          depth={depth + 1}
          filterMode={filterMode}
        />
      ))}
    </>
  )
}

// ── 메인 DiffViewer ────────────────────────────────────────
export const DiffViewer: React.FC<Props> = ({ rows, sortMode, filterMode, onSortChange }) => {
  const tree = useMemo(() => buildTree(rows), [rows])

  // 루트 레벨 정렬
  const SORT_PRIORITY: Record<string, number> = { removed: 0, changed: 1, added: 2, unchanged: 3 }

  const sortedTree = useMemo(() => {
    const copy = [...tree]
    if (sortMode === 'alpha') return copy.sort((a, b) => a.key.localeCompare(b.key))
    if (sortMode === 'type') return copy.sort((a, b) => SORT_PRIORITY[a.type] - SORT_PRIORITY[b.type])
    return copy
  }, [tree, sortMode])

  if (rows.length === 0) {
    return (
      <div className={styles.empty}>
        <p>표시할 항목이 없습니다</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {/* 툴바 */}
      <div className={styles.toolbar}>
        {/* 범례 */}
        <div className={styles.legend}>
          <span className={`${styles.legendItem} ${styles.legendAdded}`}>
            <span className={styles.legendMarker}>+</span> 추가
          </span>
          <span className={`${styles.legendItem} ${styles.legendRemoved}`}>
            <span className={styles.legendMarker}>-</span> 삭제
          </span>
          <span className={`${styles.legendItem} ${styles.legendChanged}`}>
            <span className={styles.legendMarker}>M</span> 변경
          </span>
        </div>

        {/* 정렬 */}
        <div className={styles.sortControl}>
          <label htmlFor="sortMode" className={styles.sortLabel}>정렬</label>
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
        </div>

        <span className={styles.rowCount}>{rows.length}개 항목</span>
      </div>

      {/* 컬럼 헤더 */}
      <div className={styles.colHeader}>
        <span>프로퍼티</span>
        <span>값</span>
      </div>

      {/* 트리 */}
      <div className={styles.tree} role="tree">
        {sortedTree.map(node => (
          <TreeNodeRow
            key={node.path}
            node={node}
            depth={0}
            filterMode={filterMode}
          />
        ))}
      </div>
    </div>
  )
}
