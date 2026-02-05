/**
 * @fileoverview 답안 상태 관리 Composable
 * 객관식 문제의 답안 선택 및 검증 로직을 관리합니다.
 */

import { ref } from 'vue'
import { OPTION_LABEL_START_CHAR } from './assessmentConstants.js'

/**
 * 답안 상태 관리 Composable
 * @param {import('vue').Ref<Array>} questions - 객관식 문제 배열
 * @returns {Object} 답안 상태 관리 함수 및 상태
 */
export function useAnswerState(questions) {
  /** 선택된 답안 객체 (questionIndex -> optionLabel) */
  const selectedAnswers = ref({})

  /**
   * 답안 선택
   * @param {number} questionIndex - 문제 인덱스
   * @param {string} optionLabel - 선택한 옵션 라벨 (A, B, C, D...)
   */
  const selectAnswer = (questionIndex, optionLabel) => {
    selectedAnswers.value = {
      ...selectedAnswers.value,
      [questionIndex]: optionLabel,
    }
  }

  /**
   * 선택지 라벨 생성 (A, B, C, D...)
   * @param {number} optionIndex - 옵션 인덱스 (0부터 시작)
   * @returns {string} 선택지 라벨
   */
  const getOptionLabel = (optionIndex) => {
    return String.fromCharCode(OPTION_LABEL_START_CHAR + optionIndex)
  }

  /**
   * 선택된 옵션의 실제 텍스트 가져오기
   * @param {number} questionIndex - 문제 인덱스
   * @param {string} optionLabel - 옵션 라벨
   * @returns {string} 선택된 옵션의 실제 텍스트
   */
  const getSelectedOptionText = (questionIndex, optionLabel) => {
    if (!optionLabel || !questions.value[questionIndex]) return ''
    const index = optionLabel.charCodeAt(0) - OPTION_LABEL_START_CHAR
    return questions.value[questionIndex].options?.[index] || ''
  }

  /**
   * 정답 텍스트 정규화 (대문자 변환)
   * @param {string} answer - 정답 텍스트
   * @returns {string} 정규화된 정답 텍스트
   */
  const normalizeAnswer = (answer) => {
    return String(answer).toUpperCase()
  }

  /**
   * 답안 상태 계산
   * @param {number} questionIndex - 문제 인덱스
   * @param {number} optionIndex - 옵션 인덱스
   * @returns {Object} 답안 상태 객체
   */
  const getAnswerState = (questionIndex, optionIndex) => {
    const question = questions.value[questionIndex]
    if (!question) {
      return {
        isSelected: false,
        isCorrect: false,
        isIncorrect: false,
      }
    }

    const optionLabel = getOptionLabel(optionIndex)
    const selected = selectedAnswers.value[questionIndex]
    const isSelected = selected === optionLabel

    if (!isSelected) {
      return {
        isSelected: false,
        isCorrect: false,
        isIncorrect: false,
      }
    }

    const selectedText = getSelectedOptionText(questionIndex, selected)
    const correctAnswer = normalizeAnswer(question.correctAnswer)
    const selectedTextNormalized = normalizeAnswer(selectedText)

    return {
      isSelected: true,
      isCorrect: selectedTextNormalized === correctAnswer,
      isIncorrect: selectedTextNormalized !== correctAnswer,
    }
  }

  /**
   * 문제의 답안이 정답인지 확인
   * @param {number} questionIndex - 문제 인덱스
   * @returns {boolean} 정답 여부
   */
  const isQuestionCorrect = (questionIndex) => {
    const question = questions.value[questionIndex]
    if (!question) return false

    const selected = selectedAnswers.value[questionIndex]
    if (!selected) return false

    const selectedText = getSelectedOptionText(questionIndex, selected)
    const correctAnswer = normalizeAnswer(question.correctAnswer)
    const selectedTextNormalized = normalizeAnswer(selectedText)

    return selectedTextNormalized === correctAnswer
  }

  /**
   * 문제에 답안이 선택되었는지 확인
   * @param {number} questionIndex - 문제 인덱스
   * @returns {boolean} 선택 여부
   */
  const hasAnswer = (questionIndex) => {
    return questionIndex in selectedAnswers.value
  }

  return {
    selectedAnswers,
    selectAnswer,
    getOptionLabel,
    getAnswerState,
    isQuestionCorrect,
    hasAnswer,
  }
}
