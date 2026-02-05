<template>
  <g
    :transform="`translate(${position.x}, ${position.y})`"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @click="$emit('click')"
    :class="[
      'no-print cursor-pointer transition-all duration-500 ease-out',
      isActive ? 'opacity-100' : 'opacity-50',
    ]"
    style="pointer-events: auto"
  >
    <rect
      x="-48"
      y="-14"
      width="96"
      height="28"
      rx="14"
      fill="white"
      :stroke="isActive ? COLORS.edgeLabel.stroke.active : COLORS.edgeLabel.stroke.default"
      :stroke-width="isActive ? 2.5 : 1.5"
      class="shadow-lg transition-all duration-300"
    />
    <text
      text-anchor="middle"
      dy="5"
      :class="[
        'text-[10px] font-black uppercase tracking-tighter transition-all duration-300',
        isActive ? 'fill-indigo-700' : 'fill-slate-500',
      ]"
    >
      {{ relationship }}
    </text>
  </g>
</template>

<script setup>
import { COLORS } from './graphConstants.js'

/**
 * @component EdgeLabel
 * @description 간선 라벨 컴포넌트
 * 간선의 관계를 표시하는 라벨을 렌더링합니다.
 * 호버 및 클릭 이벤트를 처리합니다.
 *
 * @example
 * <EdgeLabel
 *   :position="{x: 150, y: 150}"
 *   relationship="영향을 준다"
 *   :is-active="true"
 *   @click="handleClick"
 *   @mouseenter="handleMouseEnter"
 *   @mouseleave="handleMouseLeave"
 * />
 */
defineProps({
  /**
   * 라벨 위치 좌표
   */
  position: {
    type: Object,
    required: true,
    validator: (value) => typeof value.x === 'number' && typeof value.y === 'number',
  },
  /**
   * 간선 관계 텍스트
   */
  relationship: {
    type: String,
    required: true,
  },
  /**
   * 활성화 여부
   */
  isActive: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click', 'mouseenter', 'mouseleave'])
</script>
