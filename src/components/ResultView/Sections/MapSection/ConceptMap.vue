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

    <!-- SVG 캔버스 컨테이너 (모바일 가로 스크롤) -->
    <div ref="scrollContainer" class="w-full overflow-x-auto overflow-y-hidden">
      <!-- SVG 캔버스 -->
      <svg
        :viewBox="`0 0 ${CANVAS_WIDTH} ${height}`"
        class="h-auto w-full min-w-[600px] select-none drop-shadow-sm print:max-h-[400px]"
        @click="handleBackgroundClick"
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
          @node-click="handleNodeClick"
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
 * - [Mobile] 노드 탭(Click) 시 활성화 및 유지 (Selected state)
 * - [Mobile] 가로 스크롤 지원
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
  /**
   * 컴포넌트 활성화 여부 (탭 선택 등)
   */
  isActive: {
    type: Boolean,
    default: true,
  },
})

/**
 * 간선 클릭 이벤트
 * 사용자가 간선 라벨을 클릭했을 때 발생합니다.
 * @event edge-click
 * @param {Object} edge - 클릭된 간선 객체
 */
const emit = defineEmits(['edge-click'])

/** 스크롤 컨테이너 참조 */
const scrollContainer = ref(null)

/**
 * 스크롤을 중앙으로 이동
 */
const scrollToCenter = () => {
  if (!scrollContainer.value) return
  const { scrollWidth, clientWidth } = scrollContainer.value
  if (scrollWidth > clientWidth) {
    scrollContainer.value.scrollLeft = (scrollWidth - clientWidth) / 2
  }
}

// 활성화 상태가 되면 중앙 정렬
import { nextTick, onMounted, watch } from 'vue'

watch(
  () => props.isActive,
  (active) => {
    if (active) {
      nextTick(() => scrollToCenter())
    }
  },
)

onMounted(() => {
  if (props.isActive) {
    nextTick(() => scrollToCenter())
  }
})

/** 현재 호버된 노드 ID */
const hoveredNode = ref(null)

/** 현재 선택된 노드 ID (모바일/클릭용) */
const selectedNode = ref(null)

/** 현재 호버된 간선 인덱스 */
const hoveredEdge = ref(null)

/** 그래프 레이아웃 계산 */
const graphRef = toRef(props, 'graph')
const { layout, height, getNodePos: getNodePosBase } = useGraphLayout(graphRef)

/**
 * 현재 활성 노드 ID (호버 또는 선택)
 */
const activeNodeId = computed(() => hoveredNode.value || selectedNode.value)

/**
 * 현재 호버 상태를 반영한 노드 위치 조회
 * 호버된 노드와 연결된 노드는 멀어지는 애니메이션 효과가 적용됩니다.
 * @param {string} id - 노드 ID
 * @returns {{x: number, y: number}} 노드 위치 좌표
 */
const getNodePos = (id) => {
  return getNodePosBase(id, activeNodeId.value)
}

/**
 * 호버된 항목이 있는지 확인
 */
const hasHoveredItem = computed(() => activeNodeId.value !== null || hoveredEdge.value !== null)

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
const isNodeHovered = (nodeId) => activeNodeId.value === nodeId

/**
 * 노드가 호버된 노드와 연결되어 있는지 확인
 * @param {string} nodeId - 노드 ID
 * @returns {boolean} 연결 여부
 */
const isNodeConnected = (nodeId) => {
  if (!activeNodeId.value || activeNodeId.value === nodeId) return false
  return props.graph.edges.some(
    (e) =>
      (e.source === nodeId && e.target === activeNodeId.value) ||
      (e.target === nodeId && e.source === activeNodeId.value),
  )
}

/**
 * 노드 활성 상태 확인
 * 노드가 호버되었거나 연결된 간선이 호버된 경우 활성화됩니다.
 * @param {string} nodeId - 노드 ID
 * @returns {boolean} 활성화 여부
 */
const isNodeActive = (nodeId) => {
  const isHovered = activeNodeId.value === nodeId
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
    activeNodeId.value === edge.source ||
    activeNodeId.value === edge.target ||
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
    (activeNodeId.value !== null &&
      (edge.source === activeNodeId.value || edge.target === activeNodeId.value))
  )
}

/**
 * 노드 클릭 핸들러 (모바일 지원)
 * - 이미 선택된 노드 클릭 -> 위키 페이지 이동 (기본 동작 허용)
 * - 선택되지 않은 노드 클릭 -> 선택(하이라이트) 상태로 변경하고 이동 막기
 */
const handleNodeClick = (node, event) => {
  // 데스크탑 등 hover가 주력인 환경에서도 클릭 시 고정할 수 있음
  // 여기서는 모바일 사용성을 위해 "첫 터치=선택, 두번째 터치=이동" 패턴 적용

  if (selectedNode.value !== node.id) {
    // 아직 선택되지 않은 노드라면 -> 선택만 하고 이동 막음
    event.preventDefault()
    selectedNode.value = node.id
  } else {
    // 이미 선택된 상태라면 -> 링크 이동하도록 놔둠 (state는 굳이 안 꺼도 됨)
    // 혹은 토글하려면: selectedNode.value = null; event.preventDefault();
  }
}

/**
 * 배경 클릭 시 선택 해제
 */
const handleBackgroundClick = (event) => {
  // SVG 배경 클릭 시 선택 초기화
  if (event.target.tagName === 'svg' || event.target.tagName === 'rect') {
    selectedNode.value = null
  }
}
</script>
