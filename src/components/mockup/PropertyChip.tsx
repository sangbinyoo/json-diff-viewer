import React from 'react'
import type { DiffType } from '../../types/diff'
import styles from './PropertyChip.module.css'

interface Props {
  label: string
  type: DiffType
  title?: string
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

/**
 * 프로퍼티 이름을 diff 유형에 맞는 색상 칩으로 렌더링합니다.
 * 변경(노랑) / 삭제(빨강) / 추가(초록) / 동일(회색)
 */
export const PropertyChip: React.FC<Props> = ({ label, type, title }) => (
  <span
    className={`${styles.chip} ${TYPE_CLASS[type]}`}
    title={title ?? TYPE_TITLE[type]}
  >
    {label}
  </span>
)
