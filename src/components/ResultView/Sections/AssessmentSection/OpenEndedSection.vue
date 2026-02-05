<template>
  <div class="space-y-8 border-t border-gray-50 pt-10 print:space-y-4 print:pt-4">
    <SectionHeader badge="03" :title="t(language, 'creativeThinking')" variant="gray" />
    <div
      v-for="(question, index) in questions"
      :key="index"
      class="rounded-3xl border border-amber-100 bg-amber-50/50 p-8 print:break-inside-avoid print:p-4"
    >
      <p class="mb-6 text-lg font-black text-amber-900 print:mb-3">💡 {{ question }}</p>
      <div
        class="hidden h-40 w-full rounded-2xl border-2 border-amber-200/50 bg-white/50 print:block print:h-24"
      ></div>
    </div>
  </div>
</template>

<script setup>
/**
 * @component OpenEndedSection
 * @description 창의 사고력 문제 섹션 컴포넌트
 * 열린 질문 목록을 표시하고 인쇄 시 답안 작성 공간을 제공합니다.
 *
 * @example
 * <OpenEndedSection
 *   :questions="['창의적 질문1', '창의적 질문2']"
 *   language="Korean"
 * />
 */
import { t } from '../../i18n.js'
import SectionHeader from './SectionHeader.vue'

defineProps({
  /**
   * 창의 사고력 문제 배열
   */
  questions: {
    type: Array,
    required: true,
    validator: (value) => value.every((q) => typeof q === 'string'),
  },
  /**
   * 출력 언어
   */
  language: {
    type: String,
    default: 'Korean',
  },
})
</script>
