<template>
  <h3
    :class="[
      'flex items-center gap-2 text-lg font-black uppercase tracking-widest print:break-after-avoid',
      textColorClass,
    ]"
  >
    <span :class="['flex h-8 w-8 items-center justify-center rounded-full text-xs', badgeClass]">
      {{ badge }}
    </span>
    {{ title }}
  </h3>
</template>

<script setup>
import { computed } from 'vue'

/**
 * @component SectionHeader
 * @description 섹션 헤더 컴포넌트
 * 평가 섹션의 각 하위 섹션 헤더를 표시합니다.
 *
 * @example
 * <SectionHeader
 *   badge="MAP"
 *   title="지식 구조 분석"
 *   variant="indigo"
 * />
 */
const props = defineProps({
  /**
   * 배지 텍스트
   */
  badge: {
    type: String,
    required: true,
  },
  /**
   * 제목 텍스트
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * 색상 변형 (indigo, gray)
   */
  variant: {
    type: String,
    default: 'gray',
    validator: (value) => ['indigo', 'gray'].includes(value),
  },
})

/**
 * 텍스트 색상 클래스 계산
 */
const textColorClass = computed(() => {
  return props.variant === 'indigo' ? 'text-indigo-600' : 'text-gray-500'
})

/**
 * 배지 색상 클래스 계산
 */
const badgeClass = computed(() => {
  return props.variant === 'indigo' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
})
</script>
