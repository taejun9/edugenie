<template>
  <line
    :x1="startPos.x"
    :y1="startPos.y"
    :x2="endPos.x"
    :y2="endPos.y"
    :stroke="isActive ? COLORS.edge.active : COLORS.edge.default"
    :stroke-width="isActive ? 4 : 1.5"
    :marker-end="isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
    class="pointer-events-none transition-all duration-500 ease-out"
    :style="{
      opacity: shouldDim ? 0.05 : 1,
    }"
  />
</template>

<script setup>
import { COLORS } from './graphConstants.js'

/**
 * @component GraphEdge
 * @description 그래프 간선 렌더링 컴포넌트
 * 두 노드를 연결하는 간선을 SVG line 요소로 렌더링합니다.
 *
 * @example
 * <GraphEdge
 *   :start-pos="{x: 100, y: 100}"
 *   :end-pos="{x: 200, y: 200}"
 *   :is-active="true"
 *   :should-dim="false"
 * />
 */
const props = defineProps({
  /**
   * 시작 노드 위치
   */
  startPos: {
    type: Object,
    required: true,
    validator: (value) => typeof value.x === 'number' && typeof value.y === 'number',
  },
  /**
   * 끝 노드 위치
   */
  endPos: {
    type: Object,
    required: true,
    validator: (value) => typeof value.x === 'number' && typeof value.y === 'number',
  },
  /**
   * 활성화 여부 (호버 또는 선택됨)
   */
  isActive: {
    type: Boolean,
    default: false,
  },
  /**
   * 흐리게 표시할지 여부
   */
  shouldDim: {
    type: Boolean,
    default: false,
  },
})
</script>
