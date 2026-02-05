<template>
  <section
    :class="[
      isActive ? 'block' : 'hidden print:!block',
      'print-keep-together duration-500 animate-in fade-in slide-in-from-bottom-4',
    ]"
    :id="'tabpanel-vocab'"
    role="tabpanel"
    :aria-labelledby="'tab-vocab'"
  >
    <h2
      class="mb-8 border-l-8 border-indigo-600 pl-4 text-2xl font-black uppercase tracking-tight text-gray-800 print:mb-4"
    >
      {{ t(language, 'keyVocabulary') }}
    </h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 print:gap-3">
      <div
        v-for="(v, i) in vocabulary"
        :key="i"
        class="rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 print:p-3"
      >
        <h3 class="mb-2 text-xl font-black text-indigo-600 print:mb-1">
          {{ v.word }}
        </h3>
        <p class="mb-3 font-bold text-gray-700 print:mb-1">● {{ v.definition }}</p>
        <p
          class="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm italic text-gray-500 print:p-2"
        >
          " {{ v.example }} "
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { t } from '../i18n.js'

defineProps({
  vocabulary: {
    type: Array,
    required: true,
  },
  language: {
    type: String,
    default: 'Korean',
  },
  isActive: {
    type: Boolean,
    required: true,
  },
})
</script>
