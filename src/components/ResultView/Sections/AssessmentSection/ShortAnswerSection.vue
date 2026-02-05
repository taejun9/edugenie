<template>
  <div class="space-y-8 border-t border-gray-50 pt-10 print:space-y-4 print:pt-4">
    <SectionHeader badge="02" :title="t(language, 'shortAnswer')" variant="gray" />
    <div
      v-for="(item, index) in questions"
      :key="index"
      class="space-y-4 print:break-inside-avoid print:space-y-2"
    >
      <p class="text-lg font-bold text-gray-900">{{ index + 1 }}. {{ item.question }}</p>
      <!-- 인쇄용 답안 작성 공간 -->
      <div
        class="hidden h-24 w-full rounded-3xl border-2 border-gray-100 bg-gray-50/50 print:block print:h-16"
      ></div>
      <!-- 정답 및 해설 -->
      <AnswerExplanation
        :answer="item.answer"
        :explanation="item.explanation"
        :answer-label="t(language, 'answer')"
        :summary-text="t(language, 'showAnswer')"
        :explanation-label="t(language, 'explanation')"
        :show-in-print="showAnswersInPrint"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * @component ShortAnswerSection
 * @description 서술형 평가 섹션 컴포넌트
 * 서술형 문제 목록을 표시하고 인쇄 시 답안 작성 공간을 제공합니다.
 *
 * @example
 * <ShortAnswerSection
 *   :questions="[
 *     { question: '질문1', answer: '정답1', explanation: '해설1' },
 *     { question: '질문2', answer: '정답2', explanation: '해설2' }
 *   ]"
 *   language="Korean"
 * />
 */
import { t } from '../../i18n.js'
import AnswerExplanation from './AnswerExplanation.vue'
import SectionHeader from './SectionHeader.vue'

defineProps({
  /**
   * 서술형 문제 배열
   * @property {string} question - 문제
   * @property {string} answer - 정답
   * @property {string} explanation - 해설
   */
  questions: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every(
        (q) =>
          typeof q.question === 'string' &&
          typeof q.answer === 'string' &&
          typeof q.explanation === 'string',
      ),
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
