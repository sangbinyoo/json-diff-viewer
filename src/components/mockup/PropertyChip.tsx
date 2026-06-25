import React from 'react'
import styles from './PropertyChip.module.css'
import { DiffType } from './ResultPanel'

interface Props {
  label: string
  type: DiffType
  title?: string
  value: { origin: any; target: any }
}

const TYPE_CLASS: Record<DiffType, string> = {
  changed:   styles.changed,
  removed:   styles.removed,
  added:     styles.added,
  unchanged: styles.unchanged,
}

const TYPE_TITLE: Record<DiffType, string> = {
  changed:   '변경됨',
  removed:   '삭제됨',
  added:     '추가됨',
  unchanged: '동일',
}

const VALUE_CLASS: Record<DiffType, string> = {
  changed:   styles.valueChanged,
  removed:   styles.valueRemoved,
  added:     styles.valueAdded,
  unchanged: styles.valueUnchanged,
}

/**
 * 프로퍼티 이름을 diff 유형에 맞는 색상 칩으로 렌더링합니다.
 * 변경(노랑) / 삭제(빨강) / 추가(초록) / 동일(회색)
 */
type ChipProps = Props & React.HTMLAttributes<HTMLSpanElement>
export const PropertyChip: React.FC<ChipProps> = ({ label, type, title, value, ...rest }) => {
  const valueFormatter = (val: { origin: any; target: any }) => {
    if(typeof val.origin == 'object' || typeof val.target == 'object') return ""
    switch(type){
      case 'changed':
        return `${val.origin} → ${val.target}`
      case 'removed':
        return val.origin
      case 'added':
        return val.target
      case 'unchanged':
        return val.origin
    }
  }
  return (
  <>
    <span
      className={`${styles.chip} ${TYPE_CLASS[type]}`}
      title={title ?? TYPE_TITLE[type]}
      {...rest}
    >
      {label}
    </span>
    <span className={`${styles.value} ${VALUE_CLASS[type]}`}>
      {valueFormatter(value)}
    </span>
  </>
  )
}
