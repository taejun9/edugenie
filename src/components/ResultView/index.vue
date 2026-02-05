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
      <ResultHeader :content="content" />

      <div class="space-y-12 print:space-y-4">
        <PassageSection
          :content="content"
          @copy="copyToClipboard"
          :is-active="activeTab === 'passage'"
        />

        <MapSection
          v-if="content.keywordGraph"
          :content="content"
          :is-active="activeTab === 'map'"
          @edge-click="setSelectedEdge"
        />

        <VocabularySection
          :vocabulary="content.vocabulary"
          :language="content.language"
          :is-active="activeTab === 'vocab'"
        />

        <AssessmentSection
          :content="content"
          :is-active="activeTab === 'assessment'"
          :show-answers-in-print="showAnswersInPrint"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EdgeDetailModal from './EdgeDetailModal.vue'
import ResultHeader from './ResultHeader.vue'
import ResultTabs from './ResultTabs.vue'

import AssessmentSection from './Sections/AssessmentSection/index.vue'
import MapSection from './Sections/MapSection/index.vue'
import PassageSection from './Sections/PassageSection.vue'
import VocabularySection from './Sections/VocabularySection.vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['copy'])

const activeTab = ref('passage')
const selectedEdge = ref(null)
const showAnswersInPrint = ref(false)

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
