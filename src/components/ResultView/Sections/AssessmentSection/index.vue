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
          :can-edit="canEdit"
          @answer-selected="(label) => selectAnswer(index, label)"
          @edit="openMultipleChoiceEditor(index, question)"
          @delete="requestDeleteMultipleChoice(index)"
        />
        <button
          v-if="canEdit"
          type="button"
          class="no-print w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
          @click="openMultipleChoiceEditor()"
        >
          + {{ t(content.language, 'addQuestion') }}
        </button>
      </div>

      <!-- 서술형 평가 섹션 -->
      <div v-if="content.shortAnswerQuestions?.length" class="space-y-4">
        <ShortAnswerSection
          :questions="content.shortAnswerQuestions"
          :language="content.language"
          :show-answers-in-print="showAnswersInPrint"
          :can-edit="canEdit"
          @edit-question="openShortAnswerEditor"
          @delete-question="requestDeleteShortAnswer"
        />
        <button
          v-if="canEdit"
          type="button"
          class="no-print w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
          @click="openShortAnswerEditor()"
        >
          + {{ t(content.language, 'addQuestion') }}
        </button>
      </div>

      <!-- 창의 사고력 문제 섹션 -->
      <div v-if="content.openEndedQuestions?.length" class="space-y-4">
        <OpenEndedSection
          :questions="content.openEndedQuestions"
          :language="content.language"
          :can-edit="canEdit"
          @edit-question="openOpenEndedEditor"
          @delete-question="requestDeleteOpenEnded"
        />
        <button
          v-if="canEdit"
          type="button"
          class="no-print w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
          @click="openOpenEndedEditor()"
        >
          + {{ t(content.language, 'addQuestion') }}
        </button>
      </div>
    </div>

    <MultipleChoiceEditorModal
      v-if="canEdit"
      :show="showMultipleChoiceModal"
      :language="content.language"
      :editing-index="multipleChoiceEditingIndex"
      :form="multipleChoiceForm"
      @close="closeMultipleChoiceModal"
      @save="saveMultipleChoice"
      @add-option="addMultipleChoiceOption"
      @remove-option="removeMultipleChoiceOption"
    />

    <ShortAnswerEditorModal
      v-if="canEdit"
      :show="showShortAnswerModal"
      :language="content.language"
      :editing-index="shortAnswerEditingIndex"
      :form="shortAnswerForm"
      @close="closeShortAnswerModal"
      @save="saveShortAnswer"
    />

    <OpenEndedEditorModal
      v-if="canEdit"
      :show="showOpenEndedModal"
      :language="content.language"
      :editing-index="openEndedEditingIndex"
      :form="openEndedForm"
      @close="closeOpenEndedModal"
      @save="saveOpenEnded"
    />
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
import { t } from '@/components/Common/i18n.js'
import { ref } from 'vue'
import MapAnalysisSection from './MapAnalysisSection.vue'
import MultipleChoiceEditorModal from './Modal/MultipleChoiceEditorModal.vue'
import OpenEndedEditorModal from './Modal/OpenEndedEditorModal.vue'
import ShortAnswerEditorModal from './Modal/ShortAnswerEditorModal.vue'
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
  canEdit: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'add-multiple-choice',
  'update-multiple-choice',
  'delete-multiple-choice',
  'add-short-answer',
  'update-short-answer',
  'delete-short-answer',
  'add-open-ended',
  'update-open-ended',
  'delete-open-ended',
])

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

// 객관식 편집 상태
const showMultipleChoiceModal = ref(false)
const multipleChoiceEditingIndex = ref(null)
const multipleChoiceForm = ref({
  question: '',
  options: ['', ''],
  correctIndex: 0,
  explanation: '',
})

const openMultipleChoiceEditor = (index = null, question = null) => {
  if (!props.canEdit) return
  multipleChoiceEditingIndex.value = index
  if (question) {
    const opts =
      Array.isArray(question.options) && question.options.length ? [...question.options] : ['', '']
    const correctIndex = Math.max(
      0,
      opts.findIndex(
        (opt) => String(opt).toUpperCase() === String(question.correctAnswer).toUpperCase(),
      ),
    )
    multipleChoiceForm.value = {
      question: question.question || '',
      options: opts,
      correctIndex,
      explanation: question.explanation || '',
    }
  } else {
    multipleChoiceForm.value = {
      question: '',
      options: ['', ''],
      correctIndex: 0,
      explanation: '',
    }
  }
  showMultipleChoiceModal.value = true
}

const closeMultipleChoiceModal = () => {
  showMultipleChoiceModal.value = false
}

const addMultipleChoiceOption = () => {
  if (multipleChoiceForm.value.options.length >= 6) return
  multipleChoiceForm.value.options.push('')
}

const removeMultipleChoiceOption = (index) => {
  if (multipleChoiceForm.value.options.length <= 2) return
  multipleChoiceForm.value.options.splice(index, 1)
  if (multipleChoiceForm.value.correctIndex >= multipleChoiceForm.value.options.length) {
    multipleChoiceForm.value.correctIndex = 0
  }
}

const saveMultipleChoice = () => {
  if (!props.canEdit) return
  const q = multipleChoiceForm.value
  const trimmedOptions = q.options.map((o) => o.trim()).filter((o) => o)

  if (!q.question.trim()) return
  if (trimmedOptions.length < 2 || trimmedOptions.length > 6) return
  if (!q.explanation.trim()) return
  if (q.correctIndex == null || q.correctIndex < 0 || q.correctIndex >= q.options.length) return

  const normalizedOptions = q.options.map((o) => o.trim())
  const correctAnswerText = normalizedOptions[q.correctIndex]
  if (!correctAnswerText) return

  const payload = {
    question: q.question.trim(),
    options: normalizedOptions,
    correctAnswer: correctAnswerText,
    explanation: q.explanation.trim(),
  }

  if (multipleChoiceEditingIndex.value == null) {
    emit('add-multiple-choice', payload)
  } else {
    emit('update-multiple-choice', {
      index: multipleChoiceEditingIndex.value,
      value: payload,
    })
  }

  showMultipleChoiceModal.value = false
}

const requestDeleteMultipleChoice = (index) => {
  if (!props.canEdit) return
  const currentLength = props.content.multipleChoiceQuestions?.length || 0
  if (currentLength <= 1) return
  emit('delete-multiple-choice', { index })
}

// 서술형 편집 상태
const showShortAnswerModal = ref(false)
const shortAnswerEditingIndex = ref(null)
const shortAnswerForm = ref({
  question: '',
  answer: '',
  explanation: '',
})

const openShortAnswerEditor = (payload = null) => {
  if (!props.canEdit) return
  if (payload && typeof payload.index === 'number') {
    shortAnswerEditingIndex.value = payload.index
    shortAnswerForm.value = {
      question: payload.item?.question || '',
      answer: payload.item?.answer || '',
      explanation: payload.item?.explanation || '',
    }
  } else {
    shortAnswerEditingIndex.value = null
    shortAnswerForm.value = {
      question: '',
      answer: '',
      explanation: '',
    }
  }
  showShortAnswerModal.value = true
}

const closeShortAnswerModal = () => {
  showShortAnswerModal.value = false
}

const saveShortAnswer = () => {
  if (!props.canEdit) return
  const q = shortAnswerForm.value
  if (!q.question.trim() || !q.answer.trim() || !q.explanation.trim()) return

  const payload = {
    question: q.question.trim(),
    answer: q.answer.trim(),
    explanation: q.explanation.trim(),
  }

  if (shortAnswerEditingIndex.value == null) {
    emit('add-short-answer', payload)
  } else {
    emit('update-short-answer', {
      index: shortAnswerEditingIndex.value,
      value: payload,
    })
  }

  showShortAnswerModal.value = false
}

const requestDeleteShortAnswer = (payload) => {
  if (!props.canEdit) return
  const currentLength = props.content.shortAnswerQuestions?.length || 0
  if (currentLength <= 1) return
  if (payload && typeof payload.index === 'number') {
    emit('delete-short-answer', { index: payload.index })
  }
}

// 창의 사고력 편집 상태
const showOpenEndedModal = ref(false)
const openEndedEditingIndex = ref(null)
const openEndedForm = ref({
  question: '',
})

const openOpenEndedEditor = (payload = null) => {
  if (!props.canEdit) return
  if (payload && typeof payload.index === 'number') {
    openEndedEditingIndex.value = payload.index
    openEndedForm.value = {
      question: payload.question || '',
    }
  } else {
    openEndedEditingIndex.value = null
    openEndedForm.value = {
      question: '',
    }
  }
  showOpenEndedModal.value = true
}

const closeOpenEndedModal = () => {
  showOpenEndedModal.value = false
}

const saveOpenEnded = () => {
  if (!props.canEdit) return
  const q = openEndedForm.value
  if (!q.question.trim()) return

  const payload = q.question.trim()

  if (openEndedEditingIndex.value == null) {
    emit('add-open-ended', payload)
  } else {
    emit('update-open-ended', {
      index: openEndedEditingIndex.value,
      value: payload,
    })
  }

  showOpenEndedModal.value = false
}

const requestDeleteOpenEnded = (payload) => {
  if (!props.canEdit) return
  const currentLength = props.content.openEndedQuestions?.length || 0
  if (currentLength <= 1) return
  if (payload && typeof payload.index === 'number') {
    emit('delete-open-ended', { index: payload.index })
  }
}
</script>
