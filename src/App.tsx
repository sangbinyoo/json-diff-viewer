import React from 'react'
import { useJsonInput } from './hooks/useJsonInput'
import { useDiff } from './hooks/useDiff'
import { JsonInputPanel } from './components/JsonInputPanel'
import { StatsBar } from './components/StatsBar'
import { DiffViewer } from './components/DiffViewer'
import { SAMPLE_A, SAMPLE_B } from './utils/sampleData'
import styles from './App.module.css'

const App: React.FC = () => {
  const inputA = useJsonInput()
  const inputB = useJsonInput()
  const diff   = useDiff()

  const canCompare = inputA.state.parsed !== null && inputB.state.parsed !== null

  const handleCompare = () => {
    if (!canCompare) return
    diff.runDiff(inputA.state.parsed, inputB.state.parsed)
  }

  const handleSample = () => {
    inputA.setRaw(JSON.stringify(SAMPLE_A, null, 2))
    inputB.setRaw(JSON.stringify(SAMPLE_B, null, 2))
    diff.runDiff(SAMPLE_A, SAMPLE_B)
  }

  const handleClear = () => {
    inputA.reset()
    inputB.reset()
    diff.clearDiff()
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>JSON Diff Viewer</h1>
        <p className={styles.subtitle}>
          두 JSON 파일을 비교하여 추가·삭제·변경된 프로퍼티를 시각화합니다
        </p>
      </header>

      <main className={styles.main}>
        {/* 입력 영역 */}
        <section className={styles.inputSection} aria-label="JSON 입력">
          <div className={styles.inputGrid}>
            <JsonInputPanel
              label="파일 A (기준)"
              state={inputA.state}
              onTextChange={inputA.handleTextChange}
              onFileChange={inputA.handleFileChange}
            />
            <JsonInputPanel
              label="파일 B (비교)"
              state={inputB.state}
              onTextChange={inputB.handleTextChange}
              onFileChange={inputB.handleFileChange}
            />
          </div>

          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              onClick={handleCompare}
              disabled={!canCompare}
            >
              비교하기
            </button>
            <button className={styles.btnSecondary} onClick={handleSample}>
              샘플 데이터
            </button>
            <button className={styles.btnGhost} onClick={handleClear}>
              초기화
            </button>
          </div>
        </section>

        {/* 결과 영역 */}
        {diff.stats && (
          <section className={styles.resultSection} aria-label="비교 결과">
            <StatsBar
              stats={diff.stats}
              filterMode={diff.filterMode}
              onFilterChange={diff.setFilterMode}
            />
            <DiffViewer
              rows={diff.rows}
              sortMode={diff.sortMode}
              onSortChange={diff.setSortMode}
            />
          </section>
        )}

        {!diff.stats && (
          <div className={styles.emptyState} aria-live="polite">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" aria-hidden="true">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
            <p>두 JSON을 입력한 뒤 비교하기를 눌러주세요</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
