<template>
  <div
    class="result-view relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl print:overflow-visible"
  >
    <EdgeDetailModal
      :edge="selectedEdge"
      :nodes="content.keywordGraph?.nodes || []"
      :language="content.language"
      @close="selectedEdge = null"
    />

    <ResultTabs
      :active-tab="activeTab"
      :show-answers-in-print="showAnswersInPrint"
      @tab-change="activeTab = $event"
      @update:show-answers-in-print="showAnswersInPrint = $event"
    />

    <div class="mx-auto max-w-4xl p-8 print:p-4">
      <ResultHeader :content="localContent" />

      <div class="space-y-12 print:space-y-4">
        <PassageSection
          :content="localContent"
          :can-edit="canEdit"
          @copy="copyToClipboard"
          :is-active="activeTab === 'passage'"
          @update:image="(val) => handleContentPatch({ imageUrl: val })"
          @update:passage="(val) => handleContentPatch({ adaptedReadingPassage: val })"
          @update:summary="(val) => handleContentPatch({ summary: val })"
          @update:sources="(val) => handleContentPatch({ sources: val })"
        />

        <MapSection
          v-if="localContent.keywordGraph"
          :content="localContent"
          :is-active="activeTab === 'map'"
          @edge-click="setSelectedEdge"
        />

        <VocabularySection
          :vocabulary="localContent.vocabulary"
          :language="localContent.language"
          :can-edit="canEdit"
          :is-active="activeTab === 'vocab'"
          @add-vocabulary="addVocabulary"
          @update-vocabulary="updateVocabulary"
          @delete-vocabulary="deleteVocabulary"
        />

        <AssessmentSection
          :content="localContent"
          :is-active="activeTab === 'assessment'"
          :show-answers-in-print="showAnswersInPrint"
          :can-edit="canEdit"
          @add-multiple-choice="addMultipleChoice"
          @update-multiple-choice="updateMultipleChoice"
          @delete-multiple-choice="deleteMultipleChoice"
          @add-short-answer="addShortAnswer"
          @update-short-answer="updateShortAnswer"
          @delete-short-answer="deleteShortAnswer"
          @add-open-ended="addOpenEnded"
          @update-open-ended="updateOpenEnded"
          @delete-open-ended="deleteOpenEnded"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store.js'
import { computed, ref, toRaw, watch } from 'vue'
import EdgeDetailModal from './EdgeDetailModal.vue'
import ResultHeader from './ResultHeader.vue'
import ResultTabs from './ResultTabs.vue'

import { updateEducationalContent } from '@/services/geminiUpdateService.js'
import AssessmentSection from './Sections/AssessmentSection/index.vue'
import MapSection from './Sections/MapSection/index.vue'
import PassageSection from './Sections/PassageSection/index.vue'
import VocabularySection from './Sections/VocabularySection/index.vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['copy'])
const { isAuthenticated } = useAuthStore()

const activeTab = ref('passage')
const selectedEdge = ref(null)
const showAnswersInPrint = ref(false)

// 로컬 편집용 content 복사본
const localContent = ref(
  structuredClone
    ? structuredClone(toRaw(props.content))
    : JSON.parse(JSON.stringify(toRaw(props.content))),
)

watch(
  () => props.content,
  (val) => {
    localContent.value = structuredClone
      ? structuredClone(toRaw(val))
      : JSON.parse(JSON.stringify(toRaw(val)))
  },
  { deep: true },
)

// contentId는 상위에서 내려준다고 가정 (SavedContentEntity.contentId)
const contentId = computed(() => props.content?.contentId || props.content?.content_id)
const canEdit = computed(() => true)

const isUpdating = ref(false)
const lastError = ref(null)

const applyPatchToLocalContent = (patch) => {
  localContent.value = {
    ...localContent.value,
    ...patch,
  }
}

const handleContentPatch = async (patch) => {
  if (!canEdit.value) return

  applyPatchToLocalContent(patch)

  // 비로그인 상태이거나 contentId가 없으면 로컬 편집만 수행
  if (!isAuthenticated.value || !contentId.value) return

  try {
    isUpdating.value = true
    lastError.value = null
    const updated = await updateEducationalContent({
      contentId: contentId.value,
      content: localContent.value,
    })
    // 백엔드에서 최신 content를 돌려주면 로컬에도 반영
    if (updated) {
      localContent.value = updated
    }
  } catch (e) {
    // 실패 시 에러만 기록 (간단 처리)
    lastError.value = e instanceof Error ? e.message : String(e)
  } finally {
    isUpdating.value = false
  }
}

// Vocabulary 편집
const addVocabulary = async (item) => {
  const next = Array.isArray(localContent.value.vocabulary)
    ? [...localContent.value.vocabulary, item]
    : [item]
  await handleContentPatch({ vocabulary: next })
}

const updateVocabulary = async ({ index, value }) => {
  const next = Array.isArray(localContent.value.vocabulary)
    ? [...localContent.value.vocabulary]
    : []
  next.splice(index, 1, value)
  await handleContentPatch({ vocabulary: next })
}

const deleteVocabulary = async (index) => {
  const next = Array.isArray(localContent.value.vocabulary)
    ? [...localContent.value.vocabulary]
    : []
  next.splice(index, 1)
  await handleContentPatch({ vocabulary: next })
}

// Assessment - Multiple Choice
const addMultipleChoice = async (item) => {
  const next = Array.isArray(localContent.value.multipleChoiceQuestions)
    ? [...localContent.value.multipleChoiceQuestions, item]
    : [item]
  await handleContentPatch({ multipleChoiceQuestions: next })
}

const updateMultipleChoice = async ({ index, value }) => {
  const next = Array.isArray(localContent.value.multipleChoiceQuestions)
    ? [...localContent.value.multipleChoiceQuestions]
    : []
  next.splice(index, 1, value)
  await handleContentPatch({ multipleChoiceQuestions: next })
}

const deleteMultipleChoice = async ({ index }) => {
  const next = Array.isArray(localContent.value.multipleChoiceQuestions)
    ? [...localContent.value.multipleChoiceQuestions]
    : []
  next.splice(index, 1)
  await handleContentPatch({ multipleChoiceQuestions: next })
}

// Assessment - Short Answer
const addShortAnswer = async (item) => {
  const next = Array.isArray(localContent.value.shortAnswerQuestions)
    ? [...localContent.value.shortAnswerQuestions, item]
    : [item]
  await handleContentPatch({ shortAnswerQuestions: next })
}

const updateShortAnswer = async ({ index, value }) => {
  const next = Array.isArray(localContent.value.shortAnswerQuestions)
    ? [...localContent.value.shortAnswerQuestions]
    : []
  next.splice(index, 1, value)
  await handleContentPatch({ shortAnswerQuestions: next })
}

const deleteShortAnswer = async ({ index }) => {
  const next = Array.isArray(localContent.value.shortAnswerQuestions)
    ? [...localContent.value.shortAnswerQuestions]
    : []
  next.splice(index, 1)
  await handleContentPatch({ shortAnswerQuestions: next })
}

// Assessment - Open Ended
const addOpenEnded = async (item) => {
  const next = Array.isArray(localContent.value.openEndedQuestions)
    ? [...localContent.value.openEndedQuestions, item]
    : [item]
  await handleContentPatch({ openEndedQuestions: next })
}

const updateOpenEnded = async ({ index, value }) => {
  const next = Array.isArray(localContent.value.openEndedQuestions)
    ? [...localContent.value.openEndedQuestions]
    : []
  next.splice(index, 1, value)
  await handleContentPatch({ openEndedQuestions: next })
}

const deleteOpenEnded = async ({ index }) => {
  const next = Array.isArray(localContent.value.openEndedQuestions)
    ? [...localContent.value.openEndedQuestions]
    : []
  next.splice(index, 1)
  await handleContentPatch({ openEndedQuestions: next })
}

/**
 * 클립보드 복사 핸들러
 * 부모 컴포넌트의 복사 함수를 호출합니다.
 * @param {string} text - 복사할 텍스트
 */
const copyToClipboard = (text) => {
  emit('copy', text)
}

const setSelectedEdge = (edge) => {
  selectedEdge.value = edge
}
</script>
