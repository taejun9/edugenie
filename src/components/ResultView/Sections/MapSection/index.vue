<template>
  <section
    v-if="content.keywordGraph"
    :class="[
      isActive ? 'block' : 'hidden print:!block',
      'print-keep-together duration-500 animate-in fade-in slide-in-from-bottom-4',
    ]"
  >
    <h2
      class="mb-8 border-l-8 border-indigo-600 pl-4 text-2xl font-black uppercase tracking-tight text-gray-800 print:mb-4"
    >
      {{ t(content.language, 'knowledgeMap') }}
    </h2>
    <ConceptMap
      :graph="content.keywordGraph"
      :language="content.language"
      @edge-click="(edge) => emit('edge-click', edge)"
    />
  </section>
</template>

<script setup>
import { t } from '../../i18n.js'
import ConceptMap from './ConceptMap.vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['edge-click'])
</script>
