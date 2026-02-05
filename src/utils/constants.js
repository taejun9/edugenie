/**
 * @file constants.js
 * @description 애플리케이션 전역 상수 정의
 * InputForm 컴포넌트에서 드롭다운 옵션으로 사용되는 학년, 언어, 지문 길이, 맵 복잡도 등의 상수를 정의합니다.
 * Gemini API 프롬프트 생성에도 활용됩니다.
 */

/**
 * 대상 학년 목록
 * @type {string[]}
 * @description 초등 2학년부터 대학교/일반까지 총 12개 수준의 학년을 정의합니다.
 * InputForm의 학년 드롭다운과 생성된 자료의 메타데이터에 사용됩니다.
 */
export const GRADE_LEVELS = [
  '2nd Grade', // 초등 2학년
  '3rd Grade', // 초등 3학년
  '4th Grade', // 초등 4학년
  '5th Grade', // 초등 5학년
  '6th Grade', // 초등 6학년
  '7th Grade', // 중등 1학년
  '8th Grade', // 중등 2학년
  '9th Grade', // 중등 3학년 (Freshman)
  '10th Grade', // 고등 1학년 (Sophomore)
  '11th Grade', // 고등 2학년 (Junior)
  '12th Grade', // 고등 3학년 (Senior)
  'Adult', // 대학교/일반
]

/**
 * 지원하는 언어 목록
 * @type {Array<{code: string; name: string}>}
 * @description 지문과 평가 문항을 생성할 때 사용할 언어를 정의합니다.
 * code는 API 요청에 사용되고, name은 UI에 표시됩니다.
 * 현재 지원: 한국어, 영어, 스페인어, 프랑스어, 일본어
 */
export const LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Korean', name: '한국어(Korean)' },
  { code: 'Spanish', name: 'Español(Spanish)' },
  { code: 'French', name: 'Français(French)' },
  { code: 'Japanese', name: '日本語(Japanese)' },
]

/**
 * 지문 길이 옵션
 * @type {Array<{id: string; label: string; prompt: string}>}
 * @description 생성할 읽기 지문의 길이를 3가지 옵션으로 제시합니다.
 * - id: 내부 식별자
 * - label: UI에 표시되는 레이블 (사용자 친화적)
 * - prompt: Gemini API에 전달되는 프롬프트 (영문)
 */
export const PASSAGE_LENGTHS = [
  {
    id: 'short',
    label: 'Short(300)',
    prompt: 'Make it a short and concise passage around 300 characters.',
  },
  {
    id: 'medium',
    label: 'Medium(600)',
    prompt: 'Make it a medium-length passage around 600 characters.',
  },
  {
    id: 'long',
    label: 'Long(1000+)',
    prompt: 'Make it a detailed and long passage over 1000 characters.',
  },
]

/**
 * 지식맵 복잡도 옵션
 * @type {Array<{id: string; label: string; prompt: string}>}
 * @description 생성할 지식맵(키워드 그래프)의 복잡도를 3가지 수준으로 제시합니다.
 * 복잡도가 높을수록 더 많은 노드와 복잡한 관계를 포함합니다.
 * - simple: 4개 주요 노드 (입문자 수준)
 * - standard: 6개 균형잡힌 노드 (기본 수준)
 * - detailed: 8개 상세한 노드 (심화 학습)
 */
export const MAP_COMPLEXITIES = [
  {
    id: 'simple',
    label: 'Simple(4 nodes)',
    prompt: 'Create a simple keyword graph with exactly 4 major nodes and key relationships.',
  },
  {
    id: 'standard',
    label: 'Standard(6 nodes)',
    prompt: 'Create a balanced keyword graph with 6 nodes showing clear relationships.',
  },
  {
    id: 'detailed',
    label: 'Detailed(8 nodes)',
    prompt:
      'Create a detailed keyword graph with 8 nodes, including secondary concepts and intricate relationships.',
  },
]
