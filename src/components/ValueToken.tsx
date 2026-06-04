import React from 'react'
import { tokenizeValue } from '../utils/formatValue'
import styles from './ValueToken.module.css'

interface Props {
  value: unknown
  highlight?: 'added' | 'removed' | 'changed' | null
}

/**
 * JSON 값 하나를 타입에 따라 색상으로 렌더링합니다.
 * highlight prop으로 배경 강조를 추가할 수 있습니다.
 */
export const ValueToken: React.FC<Props> = ({ value, highlight }) => {
  const token = tokenizeValue(value)

  let text: string
  let colorClass: string

  switch (token.kind) {
    case 'string':
      text = `"${token.value}"`
      colorClass = styles.string
      break
    case 'number':
      text = String(token.value)
      colorClass = styles.number
      break
    case 'boolean':
      text = String(token.value)
      colorClass = styles.boolean
      break
    case 'null':
      text = 'null'
      colorClass = styles.null
      break
    case 'undefined':
      text = '(없음)'
      colorClass = styles.undefined
      break
    case 'array':
      text = `[배열 ${token.length}개]`
      colorClass = styles.meta
      break
    case 'object':
      text = `{객체 ${token.keys}개 키}`
      colorClass = styles.meta
      break
  }

  const highlightClass = highlight ? styles[`hl_${highlight}`] : ''

  return (
    <span className={`${styles.token} ${colorClass} ${highlightClass}`}>
      {text}
    </span>
  )
}
