<template>
  <details :class="['group mt-2', showInPrint ? 'print:block' : 'no-print']" :open="showInPrint">
    <summary
      v-show="!showInPrint"
      class="flex cursor-pointer select-none items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline"
    >
      <!-- 회전하는 화살표 아이콘 -->
      <svg
        class="h-3 w-3 transition-transform duration-300 ease-out group-open:rotate-90"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      {{ summaryText }}
    </summary>
    <div
      class="mt-4 origin-top space-y-2 rounded-2xl bg-emerald-50/50 p-4 duration-300 animate-in fade-in slide-in-from-top-2"
    >
      <p class="font-bold text-emerald-700">
        <span class="mr-2">✓ {{ answerLabel }}:</span>
        <span
          v-if="optionLabel"
          class="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white"
        >
          {{ optionLabel }}
        </span>
        {{ answer }}
      </p>
      <p class="text-sm text-emerald-600">
        <span class="mr-2 font-semibold">💡 {{ explanationLabel }}:</span>
        {{ explanation }}
      </p>
    </div>
  </details>
</template>

<script setup>
/**
 * @component AnswerExplanation
 * @description 정답 해설 컴포넌트
 * 문제의 정답과 해설을 접기/펼치기로 표시하는 컴포넌트입니다.
 *
 * @example
 * <AnswerExplanation
 *   answer="A"
 *   explanation="이유는..."
 *   answer-label="정답"
 * />
 */
defineProps({
  /**
   * 정답 텍스트
   */
  answer: {
    type: String,
    required: true,
  },
  /**
   * 해설 텍스트
   */
  explanation: {
    type: String,
    required: true,
  },
  /**
   * 정답 라벨 텍스트 (예: "정답", "정답 예시")
   */
  answerLabel: {
    type: String,
    default: '정답',
  },
  /**
   * 요약 텍스트
   */
  summaryText: {
    type: String,
    default: '정답 해설 보기',
  },
  /**
   * 해설 라벨 텍스트
   */
  explanationLabel: {
    type: String,
    default: '해설',
  },
  /**
   * 보기 기호 (A, B, C, D 등) - 객관식 문제에서 사용
   */
  optionLabel: {
    type: String,
    default: null,
  },
  /**
   * 인쇄/PDF 시 정답 및 해설 표시 여부
   */
  showInPrint: {
    type: Boolean,
    default: false,
  },
})
</script>
