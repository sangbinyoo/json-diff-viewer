import { useState, useCallback } from 'react'
import type { JsonInputState } from '../types/diff'

const INITIAL_STATE: JsonInputState = {
  raw: '',
  parsed: null,
  error: null,
  fileName: null,
}

function tryParse(raw: string): { parsed: unknown; error: null } | { parsed: null; error: string } {
  if (!raw.trim()) return { parsed: null, error: null }
  try {
    return { parsed: JSON.parse(raw), error: null }
  } catch (e) {
    return { parsed: null, error: (e as Error).message }
  }
}

/**
 * 단일 JSON 입력 패널의 상태를 관리하는 커스텀 훅.
 * 파일 업로드와 직접 입력 두 가지 방식을 모두 처리합니다.
 */
export function useJsonInput() {
  const [state, setState] = useState<JsonInputState>(INITIAL_STATE)

  const handleTextChange = useCallback((raw: string) => {
    const { parsed, error } = tryParse(raw)
    setState(prev => ({ ...prev, raw, parsed, error }))
  }, [])

  const handleFileChange = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const raw = e.target?.result as string
      const { parsed, error } = tryParse(raw)
      setState({ raw, parsed, error, fileName: file.name })
    }
    reader.readAsText(file)
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const setRaw = useCallback((raw: string) => {
    const { parsed, error } = tryParse(raw)
    setState({ raw, parsed, error, fileName: null })
  }, [])

  return { state, handleTextChange, handleFileChange, reset, setRaw }
}
