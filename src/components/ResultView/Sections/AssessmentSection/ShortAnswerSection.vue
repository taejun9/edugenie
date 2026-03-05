<template>
  <div class="space-y-8 border-t border-gray-50 pt-10 print:space-y-4 print:pt-4">
    <SectionHeader badge="02" :title="t(language, 'shortAnswer')" variant="gray" />
    <div
      v-for="(item, index) in questions"
      :key="index"
      class="group relative space-y-4 print:break-inside-avoid print:space-y-2"
    >
      <!-- hover 액션 아이콘 -->
      <div
        v-if="canEdit"
        class="no-print pointer-events-none absolute right-0 top-0 hidden gap-1 group-hover:pointer-events-auto group-hover:flex"
      >
        <button
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-gray-500 ring-1 ring-gray-200 hover:bg-indigo-50 hover:text-indigo-600"
          @click.stop="$emit('edit-question', { index, item })"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path
              d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-red-500 ring-1 ring-red-200 hover:bg-red-50"
          @click.stop="$emit('delete-question', { index })"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#EA3323"
          >
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
            />
          </svg>
        </button>
      </div>
      <p class="pr-10 text-lg font-bold text-gray-900">{{ index + 1 }}. {{ item.question }}</p>
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
import { t } from '@/components/Common/i18n.js'
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
  canEdit: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['edit-question', 'delete-question'])
</script>
