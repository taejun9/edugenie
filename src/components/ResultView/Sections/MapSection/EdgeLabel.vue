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
      :x="-width / 2"
      :y="-height / 2"
      :width="width"
      :height="height"
      :rx="height / 2"
      fill="white"
      :stroke="isActive ? COLORS.edgeLabel.stroke.active : COLORS.edgeLabel.stroke.default"
      :stroke-width="isActive ? 2.5 : 1.5"
      class="shadow-lg transition-all duration-300"
    />
    <text
      text-anchor="middle"
      :dy="lines.length > 1 ? -2 : 5"
      :class="[
        'text-[10px] font-black uppercase tracking-tighter transition-all duration-300',
        isActive ? 'fill-indigo-700' : 'fill-slate-500',
      ]"
    >
      <template v-if="lines.length > 1">
        <tspan x="0" dy="0">{{ lines[0] }}</tspan>
        <tspan x="0" dy="12">{{ lines[1] }}</tspan>
      </template>
      <template v-else>
        {{ lines[0] }}
      </template>
    </text>
  </g>
</template>

<script setup>
import { computed } from 'vue'
import { COLORS } from './graphConstants.js'

/**
 * @component EdgeLabel
 * @description 간선 라벨 컴포넌트
 * 간선의 관계를 표시하는 라벨을 렌더링합니다.
 * - 긴 텍스트(>10자)에 공백이 있으면 두 줄로 표시
 * - 그 외에는 너비를 늘려서 한 줄로 표시
 */
const props = defineProps({
  position: {
    type: Object,
    required: true,
    validator: (value) => typeof value.x === 'number' && typeof value.y === 'number',
  },
  relationship: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click', 'mouseenter', 'mouseleave'])

/** 한 글자당 대략적인 픽셀 너비 (Arial 10px 기준 추정) */
const CHAR_WIDTH = 6
/** 기본 좌우 패딩 */
const PADDING_X = 24
/** 기본 높이 */
const BASE_HEIGHT = 28

/**
 * 텍스트 라인 분리 및 포맷팅
 */
const lines = computed(() => {
  const text = props.relationship.trim()
  // 10자 초과하고 공백이 있는 경우 2줄로 분리
  if (text.length > 10 && text.includes(' ')) {
    const mid = Math.floor(text.length / 2)
    const leftSpace = text.lastIndexOf(' ', mid)
    const rightSpace = text.indexOf(' ', mid)

    // 중간에 더 가까운 공백 찾기
    let splitIndex = -1
    if (leftSpace === -1) splitIndex = rightSpace
    else if (rightSpace === -1) splitIndex = leftSpace
    else {
      splitIndex = mid - leftSpace < rightSpace - mid ? leftSpace : rightSpace
    }

    if (splitIndex !== -1) {
      return [text.slice(0, splitIndex), text.slice(splitIndex + 1)]
    }
  }
  return [text]
})

/**
 * 라벨 너비 계산
 */
const width = computed(() => {
  const maxLineLength = Math.max(...lines.value.map((l) => l.length))
  const calculatedWidth = maxLineLength * CHAR_WIDTH + PADDING_X * 2
  return Math.max(96, calculatedWidth) // 최소 너비 96px 유지
})

/**
 * 라벨 높이 계산
 */
const height = computed(() => {
  return lines.value.length > 1 ? BASE_HEIGHT + 14 : BASE_HEIGHT
})
</script>
