import React, { useRef } from 'react'
import type { JsonInputState } from '../types/diff'
import styles from './JsonInputPanel.module.css'

interface Props {
  label: string
  state: JsonInputState
  onTextChange: (value: string) => void
  onFileChange: (file: File) => void
}

/**
 * JSON 입력 패널 — 파일 업로드 + 텍스트 에디터 겸용.
 * 드래그 앤 드롭도 지원합니다.
 */
export const JsonInputPanel: React.FC<Props> = ({ label, state, onTextChange, onFileChange }) => {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.json')) onFileChange(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileChange(file)
  }

  const hasFile = !!state.fileName
  const hasContent = !!state.raw.trim()

  return (
    <div className={styles.panel}>
      <span className={styles.label}>{label}</span>

      {/* 파일 드롭존 */}
      <div
        className={`${styles.dropzone} ${hasFile ? styles.dropzoneActive : ''}`}
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label={`${label} JSON 파일 업로드`}
        onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          {hasFile
            ? <polyline points="9 12 11 14 15 10"/>
            : <line x1="12" y1="11" x2="12" y2="17"/>}
          {!hasFile && <line x1="9" y1="14" x2="15" y2="14"/>}
        </svg>
        <span>
          {hasFile ? state.fileName : '클릭하거나 JSON 파일을 드래그하세요'}
        </span>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className={styles.hiddenInput}
          onChange={handleFileInput}
        />
      </div>

      {/* 텍스트 에디터 */}
      <textarea
        className={`${styles.editor} ${state.error ? styles.editorError : ''}`}
        value={state.raw}
        onChange={e => onTextChange(e.target.value)}
        placeholder={'또는 JSON을 직접 붙여넣기...\n{\n  "key": "value"\n}'}
        spellCheck={false}
        aria-label={`${label} JSON 텍스트 입력`}
      />

      {/* 에러 메시지 */}
      {state.error && (
        <p className={styles.error} role="alert">
          ⚠ {state.error}
        </p>
      )}

      {/* 유효성 뱃지 */}
      {hasContent && !state.error && (
        <p className={styles.valid}>✓ 유효한 JSON</p>
      )}
    </div>
  )
}
