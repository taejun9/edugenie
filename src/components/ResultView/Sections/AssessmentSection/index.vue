<template>
  <section
    :class="[
      isActive ? 'block' : 'hidden print:!block',
      'print-keep-together duration-500 animate-in fade-in slide-in-from-bottom-4',
    ]"
  >
    <!-- 섹션 헤더 -->
    <h2
      class="mb-10 border-l-8 border-indigo-600 pl-4 text-2xl font-black uppercase tracking-tight text-gray-800 print:mb-4"
    >
      {{ t(content.language, 'comprehensionAssessment') }}
    </h2>

    <div class="space-y-12 print:space-y-4">
      <!-- 지식 구조 분석 섹션 -->
      <MapAnalysisSection
        :questions="content.graphAssessmentQuestions"
        :language="content.language"
        :show-answers-in-print="showAnswersInPrint"
      />

      <!-- 객관식 퀴즈 섹션 -->
      <div class="space-y-8 print:space-y-4">
        <SectionHeader badge="01" :title="t(content.language, 'multipleChoice')" variant="gray" />
        <MultipleChoiceQuestion
          v-for="(question, index) in content.multipleChoiceQuestions"
          :key="index"
          :question="question"
          :question-number="index + 1"
          :selected-answer="selectedAnswers[index]"
          :language="content.language"
          :show-answers-in-print="showAnswersInPrint"
          @answer-selected="(label) => selectAnswer(index, label)"
        />
      </div>

      <!-- 서술형 평가 섹션 -->
      <ShortAnswerSection
        v-if="content.shortAnswerQuestions?.length"
        :questions="content.shortAnswerQuestions"
        :language="content.language"
        :show-answers-in-print="showAnswersInPrint"
      />

      <!-- 창의 사고력 문제 섹션 -->
      <OpenEndedSection
        v-if="content.openEndedQuestions?.length"
        :questions="content.openEndedQuestions"
        :language="content.language"
      />
    </div>
  </section>
</template>

<script setup>
/**
 * @component AssessmentSection
 * @description 지문 이해도 평가 섹션 컴포넌트
 *
 * 지식 구조 분석 문제와 객관식 퀴즈를 표시합니다.
 * 사용자가 답안을 선택하고 정답 해설을 확인할 수 있습니다.
 *
 * @example
 * <AssessmentSection
 *   :content="{
 *     graphAssessmentQuestions: [...],
 *     multipleChoiceQuestions: [...]
 *   }"
 *   :is-active="true"
 * />
 */
import { ref } from 'vue'
import { t } from '../../i18n.js'
import MapAnalysisSection from './MapAnalysisSection.vue'
import MultipleChoiceQuestion from './MultipleChoiceQuestion.vue'
import OpenEndedSection from './OpenEndedSection.vue'
import SectionHeader from './SectionHeader.vue'
import ShortAnswerSection from './ShortAnswerSection.vue'

const props = defineProps({
  /**
   * 평가 컨텐츠 객체
   * @property {Array} graphAssessmentQuestions - 지식맵 평가 문제 배열
   * @property {Array} multipleChoiceQuestions - 객관식 문제 배열
   * @property {Array} [shortAnswerQuestions] - 서술형 문제 배열
   * @property {Array} [openEndedQuestions] - 창의 사고력 문제 배열
   */
  content: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        Array.isArray(value.graphAssessmentQuestions) &&
        Array.isArray(value.multipleChoiceQuestions)
      )
    },
  },
  /**
   * 섹션 활성화 여부
   */
  isActive: {
    type: Boolean,
    required: true,
  },
  /**
   * 인쇄/PDF 시 정답 및 해설 포함 여부
   */
  showAnswersInPrint: {
    type: Boolean,
    default: false,
  },
})

/** 선택된 답안 객체 (questionIndex -> optionLabel) */
const selectedAnswers = ref({})

/**
 * 답안 선택 핸들러
 * @param {number} questionIndex - 문제 인덱스
 * @param {string} optionLabel - 선택한 옵션 라벨 (A, B, C, D...)
 */
const selectAnswer = (questionIndex, optionLabel) => {
  selectedAnswers.value = {
    ...selectedAnswers.value,
    [questionIndex]: optionLabel,
  }
}
</script>
