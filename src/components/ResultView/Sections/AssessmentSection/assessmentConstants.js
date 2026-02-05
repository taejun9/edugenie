/**
 * 평가 섹션 관련 상수값
 */

/** 선택지 라벨 시작 문자 (A, B, C, D...) */
export const OPTION_LABEL_START_CHAR = 65 // 'A'

/** 색상 클래스 상수 */
export const ANSWER_STYLES = {
  correct: {
    container: 'bg-green-50 border-green-300',
    label: 'bg-green-200 text-green-700',
    text: 'text-green-700 font-black',
    explanation: 'bg-green-50 border-green-100 text-green-800',
    icon: 'text-green-600',
  },
  incorrect: {
    container: 'bg-red-50 border-red-300',
    label: 'bg-red-200 text-red-700',
    text: 'text-red-700 font-black',
    explanation: 'bg-amber-50 border-amber-100 text-amber-800',
    icon: 'text-red-600',
  },
  selected: {
    container: 'bg-indigo-50 border-indigo-300',
    label: 'bg-indigo-200 text-indigo-700',
    text: 'text-gray-700',
  },
  default: {
    container: 'bg-gray-50 border-gray-100 hover:bg-white hover:border-indigo-300',
    label: 'bg-white text-gray-400 group-hover:text-indigo-600',
    text: 'text-gray-700',
  },
}
