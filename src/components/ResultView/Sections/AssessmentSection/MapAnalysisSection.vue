<template>
  <div
    v-if="questions && questions.length > 0"
    class="space-y-8 border-b border-gray-50 pb-10 print:space-y-4 print:pb-4"
  >
    <SectionHeader badge="MAP" :title="t(language, 'mapAnalysis')" variant="indigo" />
    <div
      class="space-y-6 rounded-3xl border border-indigo-100 bg-indigo-50/50 p-8"
      :class="showAnswersInPrint ? 'print:space-y-4 print:pb-2' : 'print:space-y-12 print:pb-12'"
    >
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="space-y-3 print:break-inside-avoid print:space-y-2"
      >
        <p class="text-lg font-black text-indigo-900">{{ index + 1 }}. {{ question.question }}</p>
        <AnswerExplanation
          :answer="question.answer"
          :explanation="question.explanation"
          :answer-label="t(language, 'sampleAnswer')"
          :summary-text="t(language, 'showAnswer')"
          :explanation-label="t(language, 'explanation')"
          :show-in-print="showAnswersInPrint"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '../../i18n.js'
import AnswerExplanation from './AnswerExplanation.vue'
import SectionHeader from './SectionHeader.vue'

/**
 * @component MapAnalysisSection
 * @description 지식 구조 분석 섹션 컴포넌트
 * 지식맵 관련 평가 문제를 표시합니다.
 *
 * @example
 * <MapAnalysisSection
 *   :questions="[
 *     {question: '문제', answer: '답안', explanation: '해설'}
 *   ]"
 *   language="Korean"
 * />
 */
defineProps({
  /**
   * 지식맵 평가 문제 배열
   */
  questions: {
    type: Array,
    default: () => [],
  },
  /**
   * 출력 언어
   */
  language: {
    type: String,
    default: 'Korean',
  },
  /**
   * 인쇄/PDF 시 정답 및 해설 포함 여부
   */
  showAnswersInPrint: {
    type: Boolean,
    default: false,
  },
})
</script>
