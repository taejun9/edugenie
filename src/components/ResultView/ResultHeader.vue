<template>
  <div class="mb-12 print:mb-4">
    <div class="mb-3 flex items-center gap-3 print:mb-2">
      <h1 class="text-4xl font-black tracking-tight text-gray-900 print:text-2xl">
        {{ content.topic }}
      </h1>
      <span
        class="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-700"
      >
        WIKIPEDIA BASED
      </span>
    </div>
    <div class="flex items-center space-x-6 text-sm font-medium text-gray-500">
      <span class="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        {{ content.gradeLevel }}
      </span>
      <span class="flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m5 12 5 5L20 7" />
        </svg>
        {{ t(content.language, 'language') }}: {{ content.language }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { t } from './i18n.js'

defineProps({
  content: {
    type: Object,
    required: true,
  },
})
</script>
