<template>
  <button
    @click="$emit('select', optionLabel)"
    :class="[
      'group flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all',
      containerClass,
    ]"
  >
    <span
      :class="[
        'flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black transition-all',
        labelClass,
      ]"
    >
      {{ optionLabel }}
    </span>
    <span :class="['text-sm font-medium transition-all', textClass]">
      {{ optionText }}
    </span>
    <span v-if="answerState.isCorrect" class="ml-auto font-black text-green-600">✓</span>
    <span v-else-if="answerState.isIncorrect" class="ml-auto font-black text-red-600">✗</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { ANSWER_STYLES } from './assessmentConstants.js'

/**
 * @component QuestionOption
 * @description 객관식 선택지 버튼 컴포넌트
 * 객관식 문제의 개별 선택지를 렌더링합니다.
 * 선택 상태와 정답 여부에 따라 스타일이 변경됩니다.
 *
 * @example
 * <QuestionOption
 *   option-label="A"
 *   option-text="선택지 텍스트"
 *   :answer-state="{isSelected: true, isCorrect: true, isIncorrect: false}"
 *   @select="handleSelect"
 * />
 */
const props = defineProps({
  /**
   * 선택지 라벨 (A, B, C, D...)
   */
  optionLabel: {
    type: String,
    required: true,
  },
  /**
   * 선택지 텍스트
   */
  optionText: {
    type: String,
    required: true,
  },
  /**
   * 답안 상태 객체
   * @property {boolean} isSelected - 선택 여부
   * @property {boolean} isCorrect - 정답 여부
   * @property {boolean} isIncorrect - 오답 여부
   */
  answerState: {
    type: Object,
    required: true,
    validator: (value) =>
      typeof value.isSelected === 'boolean' &&
      typeof value.isCorrect === 'boolean' &&
      typeof value.isIncorrect === 'boolean',
  },
})

defineEmits(['select'])

/**
 * 컨테이너 클래스 계산
 */
const containerClass = computed(() => {
  if (props.answerState.isCorrect) return ANSWER_STYLES.correct.container
  if (props.answerState.isIncorrect) return ANSWER_STYLES.incorrect.container
  if (props.answerState.isSelected) return ANSWER_STYLES.selected.container
  return ANSWER_STYLES.default.container
})

/**
 * 라벨 클래스 계산
 */
const labelClass = computed(() => {
  if (props.answerState.isCorrect) return ANSWER_STYLES.correct.label
  if (props.answerState.isIncorrect) return ANSWER_STYLES.incorrect.label
  if (props.answerState.isSelected) return ANSWER_STYLES.selected.label
  return ANSWER_STYLES.default.label
})

/**
 * 텍스트 클래스 계산
 */
const textClass = computed(() => {
  if (props.answerState.isCorrect) return ANSWER_STYLES.correct.text
  if (props.answerState.isIncorrect) return ANSWER_STYLES.incorrect.text
  return props.answerState.isSelected ? ANSWER_STYLES.selected.text : ANSWER_STYLES.default.text
})
</script>
