import React from 'react'
import styles from './Toolbar.module.css'

interface Props {
  sortValue: string
  onSortChange: (value: string) => void
  onUpload: () => void
  onCompare: () => void
  onExport: () => void
  compareDisabled?: boolean
}

export const Toolbar: React.FC<Props> = ({
  sortValue,
  onSortChange,
  onUpload,
  onCompare,
  onExport,
  compareDisabled = false,
}) => (
  <div className={styles.toolbar} role="toolbar" aria-label="메인 도구모음">

    <button className={styles.btnUpload} onClick={onUpload} aria-label="JSON 파일 업로드">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      Upload files
    </button>

    <button
      className={styles.btnCompare}
      onClick={onCompare}
      disabled={compareDisabled}
    >
      Compare
    </button>

    <div className={styles.sortGroup}>
      <span className={styles.sortLabel}>Sort</span>
      <select
        className={styles.sortSelect}
        value={sortValue}
        onChange={e => onSortChange(e.target.value)}
        aria-label="정렬 기준 선택"
      >
        <option value="key">key</option>
        <option value="type">type</option>
        <option value="original">original</option>
      </select>
    </div>

    <button className={styles.btnExport} onClick={onExport}>
      Export
    </button>

  </div>
)
