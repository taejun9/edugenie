<template>
  <div class="space-y-8 border-t border-gray-50 pt-10 print:space-y-4 print:pt-4">
    <SectionHeader badge="03" :title="t(language, 'creativeThinking')" variant="gray" />
    <div
      v-for="(question, index) in questions"
      :key="index"
      class="group relative rounded-3xl border border-amber-100 bg-amber-50/50 p-8 print:break-inside-avoid print:p-4"
    >
      <!-- hover 액션 아이콘 -->
      <div
        v-if="canEdit"
        class="no-print pointer-events-none absolute right-4 top-4 hidden gap-1 group-hover:pointer-events-auto group-hover:flex"
      >
        <button
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50"
          @click.stop="$emit('edit-question', { index, question })"
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
      <p class="mb-6 pr-10 text-lg font-black text-amber-900 print:mb-3">💡 {{ question }}</p>
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
import { t } from '@/components/Common/i18n.js'
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
  canEdit: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['edit-question', 'delete-question'])
</script>
