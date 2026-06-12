import React, { useState } from 'react'
import { Toolbar } from './Toolbar'
import { FilePanel } from './FilePanel'
import { ResultPanel } from './ResultPanel'
import type { ResultNode } from './ResultPanel'
import styles from './MockupPage.module.css'

/**
 * 피그마 디자인 기반 목업 페이지.
 * 실제 diff 로직과 연결하기 전 UI 레이아웃·스타일을 확인하는 용도입니다.
 * 데이터는 하드코딩된 샘플을 사용합니다.
 */

const SAMPLE_NODES: ResultNode[] = [
  { key: 'name',     type: 'changed' },
  { key: 'birthday', type: 'removed' },
  {
    key: 'age',
    type: 'added',
    children: [
      { key: 'props',  type: 'added' },
      { key: 'props2', type: 'added' },
      { key: 'month',  type: 'added' },
    ],
  },
]

export const MockupPage: React.FC = () => {
  const [sortValue, setSortValue] = useState('key')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>JSON Comparator</h1>

      <Toolbar
        sortValue={sortValue}
        onSortChange={setSortValue}
        onUpload={() => alert('Upload 클릭')}
        onCompare={() => alert('Compare 클릭')}
        onExport={() => alert('Export 클릭')}
      />

      <main className={styles.grid}>
        <FilePanel label="origin file" />
        <FilePanel label="target file" />
        <ResultPanel nodes={SAMPLE_NODES} />
      </main>
    </div>
  )
}
