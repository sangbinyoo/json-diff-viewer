import React from 'react'
import ReactDOMServer from 'react-dom/server'
import type { ResultNode, DiffType } from './mockup/ResultPanel'

// ── 색상 토큰 ─────────────────────────────────────────────
const COLOR: Record<DiffType, { bg: string; text: string; badge: string }> = {
  added:     { bg: '#EAF3DE', text: '#3B6D11', badge: '#c8e6a0' },
  removed:   { bg: '#FCEBEB', text: '#A32D2D', badge: '#f5c0c0' },
  changed:   { bg: '#FAEEDA', text: '#854F0B', badge: '#f5d9a0' },
  unchanged: { bg: '#ffffff', text: '#6b6b65', badge: '#e8e8e5' },
}

const TYPE_LABEL: Record<DiffType, string> = {
  added: '추가', removed: '삭제', changed: '변경', unchanged: '동일',
}

function formatVal(v: any): string {
  if (v === undefined || v === null) return '—'
  if (typeof v === 'object') return Array.isArray(v) ? `[${v.length}개]` : `{${Object.keys(v).length}개 키}`
  return String(v)
}

// ── summary 집계 ──────────────────────────────────────────
export function countByType(nodes: ResultNode[]): Record<DiffType, number> {
  const counts: Record<DiffType, number> = { added: 0, removed: 0, changed: 0, unchanged: 0 }
  function traverse(list: ResultNode[]) {
    for (const node of list) {
      counts[node.type]++
      if (node.children?.length) traverse(node.children)
    }
  }
  traverse(nodes)
  return counts
}

// ── 트리 행 (재귀) ────────────────────────────────────────
const ExportTreeRow: React.FC<{ node: ResultNode; depth: number }> = ({ node, depth }) => {
  const hasChildren = !!node.children?.length
  const color = COLOR[node.type]

  return (
    <>
      <tr
        data-type={node.type}
        style={{ background: color.bg }}
      >
        <td style={{
          padding: '7px 12px 7px ' + (depth * 20 + 12) + 'px',
          fontFamily: 'monospace',
          fontSize: '13px',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          <span style={{ marginRight: 4, opacity: 0.5 }}>{hasChildren ? '▾' : ''}</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '24px',
            padding: '0 10px',
            borderRadius: '20px',
            background: color.bg,
            border: '1px solid ' + color.badge,
            color: color.text,
            fontWeight: 500,
            fontSize: '12px',
          }}>
            {node.title}
          </span>
        </td>
        <td style={{ padding: '7px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '12px',
            background: color.badge,
            color: color.text,
            fontSize: '11px',
            fontWeight: 600,
          }}>
            {TYPE_LABEL[node.type]}
          </span>
        </td>
        <td style={{
          padding: '7px 12px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: node.type === 'removed' || node.type === 'changed' ? '#A32D2D' : '#6b6b65',
          textDecoration: node.type === 'removed' ? 'line-through' : 'none',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          {hasChildren ? '' : formatVal(node.value?.origin)}
        </td>
        <td style={{
          padding: '7px 12px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: node.type === 'added' || node.type === 'changed' ? '#3B6D11' : '#6b6b65',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          {hasChildren ? '' : formatVal(node.value?.target)}
        </td>
      </tr>

      {hasChildren && node.children!.map(child => (
        <ExportTreeRow key={child.key} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

// ── 테이블만 renderToStaticMarkup으로 추출 ────────────────
const ExportTable: React.FC<{ nodes: ResultNode[] }> = ({ nodes }) => (
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.10)',
    borderRadius: '10px',
    overflow: 'hidden',
  }}>
    <thead>
      <tr style={{ background: '#f0f0ee' }}>
        {['Property', 'Type', 'Origin', 'Target'].map(col => (
          <th key={col} style={{
            padding: '8px 12px',
            textAlign: 'left',
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b6b65',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {nodes.map(node => (
        <ExportTreeRow key={node.key} node={node} depth={0} />
      ))}
    </tbody>
  </table>
)

// ── HTML 생성 + 다운로드 ──────────────────────────────────
export function exportToHtml(nodes: ResultNode[]) {
  const exportedAt = new Date().toLocaleString('ko-KR')
  const counts = countByType(nodes)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  const tableHtml = ReactDOMServer.renderToStaticMarkup(<ExportTable nodes={nodes} />)

  // summary 카드 — onclick을 직접 HTML 문자열로 작성
  const summaryItems = [
    { label: '전체',  count: total,            filter: 'all',       color: '#1a1a18' },
    { label: '추가',  count: counts.added,     filter: 'added',     color: '#3B6D11' },
    { label: '삭제',  count: counts.removed,   filter: 'removed',   color: '#A32D2D' },
    { label: '변경',  count: counts.changed,   filter: 'changed',   color: '#854F0B' },
    { label: '동일',  count: counts.unchanged, filter: 'unchanged', color: '#6b6b65' },
  ]

  const summaryHtml = summaryItems.map(item => `
    <div
      data-card="${item.filter}"
      onclick="filterRows('${item.filter}')"
      style="
        background:#fff;
        border:1px solid rgba(0,0,0,0.10);
        border-radius:8px;
        padding:12px 20px;
        text-align:center;
        min-width:72px;
        cursor:pointer;
        transition:outline 0.1s;
        user-select:none;
      "
    >
      <div style="font-size:24px;font-weight:600;color:${item.color};line-height:1">
        ${item.count}
      </div>
      <div style="font-size:11px;color:#6b6b65;margin-top:4px">
        ${item.label}
      </div>
    </div>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JSON Diff Report — ${exportedAt}</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f6;font-family:-apple-system,BlinkMacSystemFont,sans-serif">
  <div style="padding:32px">

    <h1 style="font-size:22px;font-weight:600;margin:0 0 4px;color:#1a1a18">JSON Diff Report</h1>
    <p style="font-size:13px;color:#6b6b65;margin:0 0 24px">내보낸 시각: ${exportedAt}</p>

    <!-- Summary 카드 -->
    <div style="display:flex;gap:10px;margin-bottom:24px">
      ${summaryHtml}
    </div>

    <!-- Diff 테이블 -->
    <div id="tableWrapper">
      ${tableHtml}
    </div>

  </div>

  <script>
    let currentFilter = 'all'

    function filterRows(type) {
      currentFilter = type

      // 카드 활성 표시
      document.querySelectorAll('[data-card]').forEach(function(card) {
        card.style.outline = card.dataset.card === type
          ? '2px solid #1D9E75'
          : 'none'
      })

      // 행 표시/숨김
      document.querySelectorAll('tr[data-type]').forEach(function(row) {
        row.style.display = (type === 'all' || row.dataset.type === type) ? '' : 'none'
      })
    }

    // 초기: 전체 카드 활성
    filterRows('all')
  </script>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diff-report-${new Date().toISOString().slice(0, 10)}.html`
  a.click()
  URL.revokeObjectURL(url)
}