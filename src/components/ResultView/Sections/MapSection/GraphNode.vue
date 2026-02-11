<template>
  <!-- 노드 링크 그룹 (위키피디아 링크 + 위치 이동 트랜지션 적용) -->
  <a
    :href="node.wikiUrl || '#'"
    :target="node.wikiUrl ? '_blank' : undefined"
    rel="noopener noreferrer"
    class="cursor-pointer outline-none"
    :style="{
      opacity: isActive ? 1 : hasHoveredItem ? 0.2 : 1,
    }"
    @mouseenter="$emit('mouseenter', node.id)"
    @mouseleave="$emit('mouseleave')"
    @click="(e) => $emit('node-click', node, e)"
  >
    <g
      :transform="`translate(${node.x}, ${node.y})`"
      class="transition-transform duration-500 ease-out"
    >
      <g filter="url(#nodeShadow)">
        <!-- 연결 히트 영역 (원과 라벨 사이 간격을 채움) -->
        <rect
          :x="-Math.max(currentRadius, labelWidth / 2 + 4)"
          :y="-currentRadius"
          :width="Math.max(currentRadius, labelWidth / 2 + 4) * 2"
          :height="currentRadius + labelOffset"
          fill="transparent"
          class="pointer-events-auto"
        />

        <!-- 외부 원 (테두리) -->
        <circle
          cx="0"
          cy="0"
          :r="currentRadius"
          fill="white"
          :stroke="strokeColor"
          :stroke-width="isHovered ? 6 : isConnected ? 3 : 2"
          class="transition-all duration-300"
        />
        <!-- 내부 원 (채우기) -->
        <circle
          cx="0"
          cy="0"
          :r="currentRadius - 4"
          :fill="fillColor"
          class="transition-all duration-300"
        />

        <!-- 노드 라벨 (헤일로 효과 포함) -->
        <g :transform="`translate(0, ${labelOffset})`">
          <text
            text-anchor="middle"
            stroke="white"
            stroke-width="6"
            stroke-linejoin="round"
            class="pointer-events-none select-none text-sm font-black transition-all duration-300"
            :class="{ 'scale-125': isHovered }"
          >
            {{ node.label }}
          </text>
          <!-- 라벨 텍스트 -->
          <text
            text-anchor="middle"
            class="pointer-events-none text-sm font-black transition-all duration-300"
            :class="labelClass"
          >
            {{ node.label }}
          </text>
        </g>
      </g>
    </g>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { BASE_NODE_RADIUS, RADIUS_PER_IMPORTANCE } from './graphConstants.js'

/**
 * @component GraphNode
 * @description 그래프 노드 렌더링 컴포넌트
 * 노드 원과 라벨을 렌더링합니다.
 * 호버 및 활성화 상태에 따라 스타일이 변경됩니다.
 * 클릭 시 위키피디아 링크로 이동합니다.
 *
 * @example
 * <GraphNode
 *   :node="{id: '1', label: '개념1', x: 100, y: 100, importance: 8, wikiUrl: 'https://ko.wikipedia.org/wiki/...'}"
 *   :is-active="true"
 *   :is-hovered="false"
 *   :is-connected="false"
 *   :has-hovered-item="false"
 *   @mouseenter="handleMouseEnter"
 *   @mouseleave="handleMouseLeave"
 * />
 */
const props = defineProps({
  /**
   * 노드 데이터 객체
   * @property {string} id - 노드 고유 ID
   * @property {string} label - 노드 라벨 텍스트
   * @property {number} x - 노드 X 좌표
   * @property {number} y - 노드 Y 좌표
   * @property {number} [importance] - 노드 중요도 (크기 결정)
   * @property {string} [wikiUrl] - 위키피디아 링크 URL
   */
  node: {
    type: Object,
    required: true,
    validator: (value) =>
      typeof value.id === 'string' &&
      typeof value.label === 'string' &&
      typeof value.x === 'number' &&
      typeof value.y === 'number',
  },
  /**
   * 활성화 여부 (호버되었거나 연결된 노드)
   */
  isActive: {
    type: Boolean,
    default: false,
  },
  /**
   * 호버 여부
   */
  isHovered: {
    type: Boolean,
    default: false,
  },
  /**
   * 연결된 노드 여부 (호버된 노드와 연결됨)
   */
  isConnected: {
    type: Boolean,
    default: false,
  },
  /**
   * 다른 항목이 호버되었는지 여부
   */
  hasHoveredItem: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['mouseenter', 'mouseleave', 'node-click'])

/**
 * 노드 기본 반지름 계산
 */
const radius = computed(() => {
  return (BASE_NODE_RADIUS + (props.node.importance || 5) * RADIUS_PER_IMPORTANCE) * 0.8
})

/**
 * 현재 반지름 (호버 시 확대)
 */
const currentRadius = computed(() => {
  return props.isHovered ? radius.value * 1.2 : radius.value
})

/**
 * 라벨 Y 오프셋
 */
const labelOffset = computed(() => {
  return currentRadius.value + 24
})

/**
 * 테두리 색상 계산
 */
const strokeColor = computed(() => {
  if (props.isHovered) return '#4f46e5' // indigo-600
  if (props.isConnected) return '#818cf8' // indigo-400
  return '#94a3b8' // slate-400
})

/**
 * 채우기 색상 계산
 */
const fillColor = computed(() => {
  if (props.isHovered) return '#eef2ff' // indigo-50
  if (props.isConnected) return '#f5f3ff' // violet-50
  return '#f8fafc' // slate-50
})

/**
 * 라벨 클래스 계산
 */
const labelClass = computed(() => {
  if (props.isHovered) return 'fill-indigo-700 scale-125'
  if (props.isConnected) return 'fill-indigo-500'
  return 'fill-slate-900'
})

/**
 * 라벨 너비 추정 (글자 수 기반)
 */
const labelWidth = computed(() => {
  return props.node.label.length * 8
})
</script>
