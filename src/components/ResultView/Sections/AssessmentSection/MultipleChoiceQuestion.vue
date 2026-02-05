<template>
  <div class="border-l-2 border-gray-100 pl-4 print:break-inside-avoid">
    <p class="mb-4 text-lg font-bold text-gray-900 print:mb-2">
      {{ questionNumber }}. {{ question.question }}
    </p>
    <div class="ml-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <QuestionOption
        v-for="(option, optionIndex) in question.options"
        :key="optionIndex"
        :option-label="getOptionLabel(optionIndex)"
        :option-text="option"
        :answer-state="getAnswerState(optionIndex)"
        @select="handleSelect"
      />
    </div>
    <AnswerExplanation
      :class="hasAnswer || showAnswersInPrint ? '' : 'pointer-events-none opacity-0'"
      :answer="question.correctAnswer"
      :explanation="question.explanation"
      :answer-label="t(language, 'answer')"
      :summary-text="t(language, 'showAnswer')"
      :explanation-label="t(language, 'explanation')"
      :option-label="correctAnswerLabel"
      :show-in-print="showAnswersInPrint"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../../i18n.js'
import AnswerExplanation from './AnswerExplanation.vue'
import QuestionOption from './QuestionOption.vue'
import { OPTION_LABEL_START_CHAR } from './assessmentConstants.js'

/**
 * @component MultipleChoiceQuestion
 * @description 객관식 문제 컴포넌트
 * 개별 객관식 문제를 렌더링하고 답안 선택을 관리합니다.
 *
 * @example
 * <MultipleChoiceQuestion
 *   :question="{question: '문제 텍스트', options: [...], correctAnswer: 'A', explanation: '...'}"
 *   :question-number="1"
 *   language="Korean"
 *   @answer-selected="handleAnswer"
 * />
 */
const props = defineProps({
  /**
   * 문제 객체
   */
  question: {
    type: Object,
    required: true,
    validator: (value) =>
      typeof value.question === 'string' &&
      Array.isArray(value.options) &&
      typeof value.correctAnswer === 'string' &&
      typeof value.explanation === 'string',
  },
  /**
   * 문제 번호
   */
  questionNumber: {
    type: Number,
    required: true,
  },
  /**
   * 선택된 답안 라벨 (A, B, C, D...)
   */
  selectedAnswer: {
    type: String,
    default: null,
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

const emit = defineEmits(['answer-selected'])

/**
 * 선택지 라벨 생성 (A, B, C, D...)
 * @param {number} optionIndex - 옵션 인덱스
 * @returns {string} 선택지 라벨
 */
const getOptionLabel = (optionIndex) => {
  return String.fromCharCode(OPTION_LABEL_START_CHAR + optionIndex)
}

/**
 * 답안 상태 가져오기
 * @param {number} optionIndex - 옵션 인덱스
 * @returns {Object} 답안 상태 객체
 */
const getAnswerState = (optionIndex) => {
  const optionLabel = getOptionLabel(optionIndex)
  const isSelected = props.selectedAnswer === optionLabel

  if (!isSelected) {
    return {
      isSelected: false,
      isCorrect: false,
      isIncorrect: false,
    }
  }

  // 선택된 옵션의 실제 텍스트 가져오기
  const selectedText = props.question.options[optionIndex]
  const correctAnswer = String(props.question.correctAnswer).toUpperCase()
  const selectedTextNormalized = String(selectedText).toUpperCase()

  return {
    isSelected: true,
    isCorrect: selectedTextNormalized === correctAnswer,
    isIncorrect: selectedTextNormalized !== correctAnswer,
  }
}

/**
 * 답안 선택 핸들러
 * @param {string} optionLabel - 선택한 옵션 라벨
 */
const handleSelect = (optionLabel) => {
  emit('answer-selected', optionLabel)
}

/**
 * 답안이 선택되었는지 확인
 */
const hasAnswer = computed(() => {
  return props.selectedAnswer !== null
})

/**
 * 정답 여부 확인
 */
const isCorrect = computed(() => {
  if (!hasAnswer.value) return false
  const optionIndex = props.selectedAnswer.charCodeAt(0) - OPTION_LABEL_START_CHAR
  const selectedText = props.question.options[optionIndex]
  const correctAnswer = String(props.question.correctAnswer).toUpperCase()
  return String(selectedText).toUpperCase() === correctAnswer
})

/**
 * 정답의 보기 기호 (A, B, C, D...) 찾기
 * correctAnswer가 옵션 목록에 있으면 해당 기호 반환
 */
const correctAnswerLabel = computed(() => {
  const correctAnswer = String(props.question.correctAnswer).toUpperCase()
  const index = props.question.options.findIndex(
    (opt) => String(opt).toUpperCase() === correctAnswer,
  )
  if (index !== -1) {
    return getOptionLabel(index)
  }
  return null
})
</script>
