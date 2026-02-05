<template>
  <div
    class="relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-inner print:p-2"
  >
    <!-- 헤더 -->
    <div class="no-print pointer-events-none absolute left-6 top-6 z-10">
      <h3 class="mb-1 text-sm font-black uppercase tracking-wider text-slate-800">
        {{ t(language, 'knowledgeMap') }}
      </h3>
      <p class="text-xs font-medium text-slate-500">
        {{ t(language, 'mapHoverHint') }}
      </p>
    </div>

    <!-- SVG 캔버스 -->
    <svg
      :viewBox="`0 0 ${CANVAS_WIDTH} ${height}`"
      class="h-auto max-h-[700px] w-full select-none drop-shadow-sm print:max-h-[400px]"
    >
      <!-- SVG 정의 -->
      <SVGDefs />

      <!-- 배경 그리드 -->
      <rect width="100%" height="100%" fill="url(#dotGrid)" class="no-print" />

      <!-- 간선 렌더링 -->
      <GraphEdge
        v-for="(edge, i) in graph.edges"
        :key="`edge-${i}`"
        :start-pos="getNodePos(edge.source)"
        :end-pos="getNodePos(edge.target)"
        :is-active="isEdgeActive(i)"
        :should-dim="hasHoveredItem && !isEdgeActive(i)"
      />

      <!-- 비활성 간선 라벨 -->
      <template v-for="(edge, i) in graph.edges" :key="`edge-label-inactive-${i}`">
        <EdgeLabel
          v-if="!isEdgeLabelActive(i)"
          :position="getLabelPos(edge, i)"
          :relationship="edge.relationship"
          :is-active="false"
          @click="emit('edge-click', edge)"
          @mouseenter="hoveredEdge = i"
          @mouseleave="hoveredEdge = null"
        />
      </template>

      <!-- 노드 렌더링 -->
      <GraphNode
        v-for="node in layout"
        :key="`node-${node.id}`"
        :node="getNodeWithCurrentPos(node)"
        :is-active="isNodeActive(node.id)"
        :is-hovered="isNodeHovered(node.id)"
        :is-connected="isNodeConnected(node.id)"
        :has-hovered-item="hasHoveredItem"
        @mouseenter="hoveredNode = $event"
        @mouseleave="hoveredNode = null"
      />

      <!-- 활성 간선 라벨 -->
      <template v-for="(edge, i) in graph.edges" :key="`edge-label-active-${i}`">
        <EdgeLabel
          v-if="isEdgeLabelActive(i)"
          :position="getLabelPos(edge, i)"
          :relationship="edge.relationship"
          :is-active="true"
          @click="emit('edge-click', edge)"
          @mouseenter="hoveredEdge = i"
          @mouseleave="hoveredEdge = null"
        />
      </template>
    </svg>
  </div>
</template>

<script setup>
/**
 * @component ConceptMap
 * @description 인터랙티브 지식 맵 시각화 컴포넌트
 *
 * 노드와 간선으로 구성된 그래프를 SVG로 렌더링합니다.
 * 원형 레이아웃 알고리즘을 사용하여 첫 번째 노드를 중앙에,
 * 나머지 노드들을 원형으로 배치합니다.
 *
 * 주요 기능:
 * - 노드 호버 시 연결된 노드가 바깥으로 이동하는 애니메이션
 * - 노드 호버 시 연결된 노드와 간선 하이라이트
 * - 간선 클릭 시 상세 정보 모달 표시
 * - 반응형 레이아웃 (노드 수에 따라 캔버스 높이 자동 조정)
 * - 노드 중요도에 따른 크기 차별화
 *
 * @example
 * <ConceptMap
 *   :graph="{
 *     nodes: [{id: '1', label: '개념1', importance: 8}, ...],
 *     edges: [{source: '1', target: '2', relationship: '영향을 준다'}, ...]
 *   }"
 *   @edge-click="handleEdgeClick"
 * />
 */
import { computed, ref, toRef } from 'vue'
import { t } from '../../i18n.js'
import EdgeLabel from './EdgeLabel.vue'
import GraphEdge from './GraphEdge.vue'
import GraphNode from './GraphNode.vue'
import SVGDefs from './SVGDefs.vue'
import { CANVAS_WIDTH } from './graphConstants.js'
import { useGraphLayout } from './useGraphLayout.js'

const props = defineProps({
  /**
   * 그래프 데이터 객체
   * @property {Array<Object>} nodes - 노드 배열
   * @property {Array<Object>} edges - 간선 배열
   */
  graph: {
    type: Object,
    required: true,
    validator: (value) => {
      return Array.isArray(value.nodes) && Array.isArray(value.edges)
    },
  },
  /**
   * 출력 언어
   */
  language: {
    type: String,
    default: 'Korean',
  },
})

/**
 * 간선 클릭 이벤트
 * 사용자가 간선 라벨을 클릭했을 때 발생합니다.
 * @event edge-click
 * @param {Object} edge - 클릭된 간선 객체
 */
const emit = defineEmits(['edge-click'])

/** 현재 호버된 노드 ID */
const hoveredNode = ref(null)

/** 현재 호버된 간선 인덱스 */
const hoveredEdge = ref(null)

/** 그래프 레이아웃 계산 */
const graphRef = toRef(props, 'graph')
const { layout, height, getNodePos: getNodePosBase } = useGraphLayout(graphRef)

/**
 * 현재 호버 상태를 반영한 노드 위치 조회
 * 호버된 노드와 연결된 노드는 멀어지는 애니메이션 효과가 적용됩니다.
 * @param {string} id - 노드 ID
 * @returns {{x: number, y: number}} 노드 위치 좌표
 */
const getNodePos = (id) => {
  return getNodePosBase(id, hoveredNode.value)
}

/**
 * 호버된 항목이 있는지 확인
 */
const hasHoveredItem = computed(() => hoveredNode.value !== null || hoveredEdge.value !== null)

/**
 * 간선 라벨 위치 계산
 * 간선의 중점에서 수직 방향으로 오프셋을 적용하여 라벨 위치를 결정합니다.
 * @param {Object} edge - 간선 객체
 * @param {number} index - 간선 인덱스 (교차 방지용)
 * @returns {{x: number, y: number}} 라벨 위치 좌표
 */
const getLabelPos = (edge, index) => {
  const start = getNodePos(edge.source)
  const end = getNodePos(edge.target)
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const px = -dy / len // 수직 방향 벡터
  const py = dx / len
  const offset = (index % 2 === 0 ? 1 : -1) * 22 // 교차 방지를 위한 오프셋
  return {
    x: start.x + dx * 0.5 + px * offset,
    y: start.y + dy * 0.5 + py * offset,
  }
}

/**
 * 노드 호버 상태 확인
 * @param {string} nodeId - 노드 ID
 * @returns {boolean} 호버 여부
 */
const isNodeHovered = (nodeId) => hoveredNode.value === nodeId

/**
 * 노드가 호버된 노드와 연결되어 있는지 확인
 * @param {string} nodeId - 노드 ID
 * @returns {boolean} 연결 여부
 */
const isNodeConnected = (nodeId) => {
  if (!hoveredNode.value || hoveredNode.value === nodeId) return false
  return props.graph.edges.some(
    (e) =>
      (e.source === nodeId && e.target === hoveredNode.value) ||
      (e.target === nodeId && e.source === hoveredNode.value),
  )
}

/**
 * 노드 활성 상태 확인
 * 노드가 호버되었거나 연결된 간선이 호버된 경우 활성화됩니다.
 * @param {string} nodeId - 노드 ID
 * @returns {boolean} 활성화 여부
 */
const isNodeActive = (nodeId) => {
  const isHovered = hoveredNode.value === nodeId
  const isConnected =
    isNodeConnected(nodeId) ||
    props.graph.edges.some(
      (e) =>
        hoveredEdge.value !== null &&
        (props.graph.edges[hoveredEdge.value].source === nodeId ||
          props.graph.edges[hoveredEdge.value].target === nodeId),
    )
  return isHovered || isConnected
}

/**
 * 현재 호버 상태를 반영한 노드 위치 반환
 * @param {Object} node - 노드 객체
 * @returns {Object} 현재 위치가 반영된 노드 객체
 */
const getNodeWithCurrentPos = (node) => {
  const pos = getNodePos(node.id)
  return { ...node, x: pos.x, y: pos.y }
}

/**
 * 간선 활성 상태 확인
 * 간선이 호버되었거나 연결된 노드가 호버된 경우 활성화됩니다.
 * @param {number} index - 간선 인덱스
 * @returns {boolean} 활성화 여부
 */
const isEdgeActive = (index) => {
  const edge = props.graph.edges[index]
  return (
    hoveredNode.value === edge.source ||
    hoveredNode.value === edge.target ||
    hoveredEdge.value === index
  )
}

/**
 * 간선 라벨 활성 상태 확인
 * 간선 라벨이 표시되어야 하는지 확인합니다.
 * @param {number} index - 간선 인덱스
 * @returns {boolean} 활성화 여부
 */
const isEdgeLabelActive = (index) => {
  const edge = props.graph.edges[index]
  return (
    hoveredEdge.value === index ||
    (hoveredNode.value !== null &&
      (edge.source === hoveredNode.value || edge.target === hoveredNode.value))
  )
}
</script>
