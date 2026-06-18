import React from 'react'
import styles from './FilePanel.module.css'
import { jsonPrettier } from '../../utils/jsonPrettier'

interface Props {
  label: string
  /** 업로드된 파일명 — 없으면 빈 박스 표시 */
  fileName?: string | null
  children?: React.ReactNode
}

/**
 * origin file / target file 패널.
 * 실제 파일 내용 미리보기는 children 으로 주입합니다.
 */
export const FilePanel: React.FC<Props> = ({ label, fileName, children }) => (
  <section className={styles.panel} aria-label={label}>
    <span className={styles.label}>{label} : {fileName}</span>
    <pre className={styles.box}>
      {jsonPrettier(children as string)}
    </pre>
  </section>
)
