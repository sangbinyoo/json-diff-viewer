import React, { useEffect, useState } from 'react'
import { PropertyChip } from './PropertyChip/PropertyChip'
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
  onDrop: (dragKey:string, dropKey:string) => void // 부모 콜백
}

const TreeRow: React.FC<TreeRowProps> = ({ node, depth, onDrop }) => {
  const [expanded, setExpanded] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const hasChildren = !!node.children?.length
  
  // ── 드래그 하는 쪽 (칩에서 시작) ──
  const handleDragStart = (e:React.DragEvent)=>{
    e.dataTransfer.setData('dragKey', node.key)
    e.dataTransfer.effectAllowed = 'move'
  }

  // ── 드롭 받는 쪽 (행 전체) ──
  const handleDragOver = (e:React.DragEvent)=>{
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e:React.DragEvent)=>{
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e:React.DragEvent)=>{
    e.preventDefault()
    setIsDragOver(false)
    const dragKey = e.dataTransfer.getData('dragKey')
    if(dragKey !== node.key){
      onDrop(dragKey, node.key)
    }
  }

  return (
    <>
      <div
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`${styles.row} ${isDragOver ? styles.dragOver :''}`}
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

        <PropertyChip
          draggable
          onDragStart={handleDragStart}
        label={node.title} type={node.type} value={node.value} />
      </div>

      {hasChildren && expanded && node.children!.map(child => (
        <TreeRow key={child.key} node={child} depth={depth + 1} onDrop={onDrop} />
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
export const ResultPanel: React.FC<Props> = ({ nodes }) => {
  const [items, setItems] = useState<ResultNode[]>(nodes)
  useEffect(() => setItems(nodes), [nodes])

  const handleDrop = (dragKey: string, dropKey: string) => {
    setItems(prev => {
      const dragIndex = prev.findIndex(n => n.key === dragKey)
      const dropIndex = prev.findIndex(n => n.key === dropKey)
      if (dragIndex === -1 || dropIndex === -1) return prev

      const next = [...prev]
      const [removed] = next.splice(dragIndex, 1)
      next.splice(dropIndex, 0, removed)
      return next
    })
  }

  return (
    <>
    <section className={styles.panel} aria-label="비교 결과">
      <span className={styles.label}>Compare result</span>
      <div className={styles.box} role="tree" aria-label="프로퍼티 트리">
        {items.map(node => (
          <TreeRow key={node.key} node={node} depth={0} onDrop={handleDrop}/>
        ))}
      </div>
    </section>
  </>
  )
}

