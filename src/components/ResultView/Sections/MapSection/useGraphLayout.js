/**
 * @fileoverview 그래프 레이아웃 계산 Composable
 * 원형 레이아웃 알고리즘을 사용하여 노드 위치를 계산합니다.
 */

import { computed, ref } from 'vue'
import { CANVAS_WIDTH, getCanvasHeight } from './graphConstants.js'

/** 원형 배치 기본 반지름 */
const CIRCLE_BASE_RADIUS = 200

/** 중요도에 따른 반지름 가중치 */
const IMPORTANCE_RADIUS_WEIGHT = 2

/**
 * 그래프 레이아웃 계산 Composable
 * @param {import('vue').Ref<Object>} graph - 그래프 데이터
 * @returns {Object} 레이아웃 관련 computed 및 함수들
 */
export function useGraphLayout(graph) {
  /** 호버된 노드 ID */
  const hoveredNode = ref(null)

  const height = getCanvasHeight(graph.value.nodes.length)
  /**
   * 기본 노드 레이아웃 계산 (원형 배치)
   * 첫 번째 노드는 중앙에, 나머지는 원을 그리며 배치됩니다.
   * @type {import('vue').ComputedRef<Array>}
   */
  const layout = computed(() => {
    if (!graph.value.nodes.length) return []

    const nodes = graph.value.nodes

    return nodes.map((node, i) => {
      // 첫 번째 노드는 중앙에 배치
      if (i === 0) {
        return { ...node, x: CANVAS_WIDTH / 2, y: height / 2 }
      }

      // 나머지 노드들은 원형으로 배치
      const angle = ((i - 1) / (nodes.length - 1)) * 2 * Math.PI
      const radius = CIRCLE_BASE_RADIUS + (node.importance || 5) * IMPORTANCE_RADIUS_WEIGHT

      return {
        ...node,
        x: CANVAS_WIDTH / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
      }
    })
  })

  /**
   * 노드 ID로 현재 위치 조회 (호버 시 이동 효과 포함)
   * @param {string} id - 노드 ID
   * @param {string|null} currentHoveredNode - 현재 호버된 노드 ID
   * @returns {{x: number, y: number}} 노드 위치 좌표
   */
  const getNodePos = (id, currentHoveredNode = null) => {
    const node = layout.value.find((n) => n.id === id)
    if (!node) return { x: 0, y: 0 }

    // 호버된 노드가 없거나 현재 노드가 호버된 노드인 경우 기본 위치 반환
    if (!currentHoveredNode || currentHoveredNode === id) {
      return { x: node.x, y: node.y }
    }

    // 호버된 노드와 연결되어 있는지 확인
    const isConnected = graph.value.edges.some(
      (e) =>
        (e.source === id && e.target === currentHoveredNode) ||
        (e.target === id && e.source === currentHoveredNode),
    )

    // 연결된 노드는 호버된 노드에서 멀어지는 방향으로 이동
    if (isConnected) {
      const hoveredNodeData = layout.value.find((n) => n.id === currentHoveredNode)
      if (hoveredNodeData) {
        const dx = node.x - hoveredNodeData.x
        const dy = node.y - hoveredNodeData.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        return {
          x: node.x + (dx / dist) * 45,
          y: node.y + (dy / dist) * 45,
        }
      }
    }

    return { x: node.x, y: node.y }
  }

  return {
    layout,
    height,
    getNodePos,
    hoveredNode,
  }
}
