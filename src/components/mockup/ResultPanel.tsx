import React, { useState } from 'react'
import { PropertyChip } from './PropertyChip'
import styles from './ResultPanel.module.css'
export type DiffType = 'added' | 'removed' | 'changed' | 'unchanged'

export interface ResultNode {
  key: string
  title: string
  value: {origin: any, target: any}
  type: DiffType
  children?: ResultNode[]
}

interface TreeRowProps {
  node: ResultNode
  depth: number
}

const TreeRow: React.FC<TreeRowProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = !!node.children?.length

  return (
    <>
      <div
        className={styles.row}
        style={{ paddingLeft: depth * 22 + 8 }}
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <span
          className={`${styles.toggle} ${hasChildren ? styles.toggleVisible : ''}`}
          onClick={() => hasChildren && setExpanded(v => !v)}
          aria-hidden="true"
        >
          {hasChildren ? (expanded ? '▾' : '▸') : ''}
        </span>

        <PropertyChip label={node.title} type={node.type} />
      </div>

      {hasChildren && expanded && node.children!.map(child => (
        <TreeRow key={child.key} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

interface Props {
  nodes: ResultNode[]
}

/**
 * Compare result 패널.
 * ResultNode 트리를 받아 접기/펼치기가 가능한 트리로 렌더링합니다.
 */
export const ResultPanel: React.FC<Props> = ({ nodes }) => (
  <section className={styles.panel} aria-label="비교 결과">
    <p className={styles.header}>Compare result</p>

    <div className={styles.box} role="tree" aria-label="프로퍼티 트리">
      <p className={styles.propLabel}>property</p>

      {nodes.map(node => (
        <TreeRow key={node.key} node={node} depth={0} />
      ))}
    </div>
  </section>
)
