import type { DiffRow, DiffType } from '../types/diff'

export interface TreeNode {
  key: string
  path: string
  type: DiffType
  aVal: unknown
  bVal: unknown
  children: TreeNode[]
  /** 자식 중 하나라도 changed/added/removed 가 있으면 true — 부모 노드 강조에 사용 */
  hasChangedDescendant: boolean
}

/**
 * flat한 DiffRow 배열(예: "user.settings.theme")을
 * 중첩 TreeNode 구조로 변환합니다.
 *
 * 중간 경로(객체 노드)는 자식들의 type 을 집계하여
 * 가장 심각한 변경 유형을 부모 type 으로 설정합니다.
 * 우선순위: removed > changed > added > unchanged
 */
export function buildTree(rows: DiffRow[]): TreeNode[] {
  // path → node 맵 (중간 경로 노드 포함)
  const nodeMap = new Map<string, TreeNode>()

  // 루트 자식 목록
  const roots: TreeNode[] = []

  const getOrCreate = (path: string): TreeNode => {
    if (nodeMap.has(path)) return nodeMap.get(path)!
    const parts = path.split('.')
    const key = parts[parts.length - 1]
    const node: TreeNode = {
      key,
      path,
      type: 'unchanged',
      aVal: undefined,
      bVal: undefined,
      children: [],
      hasChangedDescendant: false,
    }
    nodeMap.set(path, node)

    if (parts.length === 1) {
      roots.push(node)
    } else {
      const parentPath = parts.slice(0, -1).join('.')
      const parent = getOrCreate(parentPath)
      parent.children.push(node)
    }
    return node
  }

  // 1단계: 모든 경로의 노드를 만들고 leaf 값 설정
  for (const row of rows) {
    const node = getOrCreate(row.path)
    node.type = row.type
    node.aVal = row.aVal
    node.bVal = row.bVal
  }

  // 2단계: 중간 경로 노드(children만 있고 직접 값은 없는 노드)의 type 집계
  const PRIORITY: Record<DiffType, number> = { removed: 3, changed: 2, added: 1, unchanged: 0 }

  function aggregateType(node: TreeNode): DiffType {
    if (node.children.length === 0) return node.type
    let max: DiffType = node.type
    for (const child of node.children) {
      const childType = aggregateType(child)
      if (PRIORITY[childType] > PRIORITY[max]) max = childType
      if (childType !== 'unchanged') {
        child.hasChangedDescendant = child.children.some(c => c.type !== 'unchanged' || c.hasChangedDescendant)
      }
    }
    // 직접 값이 없는 중간 노드는 자식 집계로 덮어씀
    if (node.aVal === undefined && node.bVal === undefined) node.type = max
    node.hasChangedDescendant = node.children.some(
      c => c.type !== 'unchanged' || c.hasChangedDescendant
    )
    return node.type
  }

  roots.forEach(aggregateType)
  return roots
}
