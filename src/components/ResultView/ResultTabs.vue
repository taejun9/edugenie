<template>
  <div
    class="no-print flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 p-4"
    role="tablist"
    aria-label="Result section tabs"
  >
    <div class="flex space-x-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('tab-change', tab.id)"
        @keydown.enter.prevent="$emit('tab-change', tab.id)"
        @keydown.space.prevent="$emit('tab-change', tab.id)"
        :class="[
          'rounded-xl px-5 py-2.5 text-sm font-bold transition-all focus:outline-none',
          activeTab === tab.id
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
            : 'text-gray-500 hover:bg-gray-200',
        ]"
        :role="'tab'"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`tabpanel-${tab.id}`"
        :id="`tab-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex min-w-[150px] items-center justify-between font-semibold">
        <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#333]">
          <div
            class="flex h-5 w-9 items-center rounded-full border"
            :class="[
              isIncludeAnswers ? 'border-color-main bg-color-main/20' : 'border-[#999] bg-white',
            ]"
          >
            <input
              class="peer hidden"
              type="checkbox"
              v-model="isIncludeAnswers"
              :checked="showAnswersInPrint"
              @change="$emit('update:showAnswersInPrint', $event.target.checked)"
            />
            <div
              class="h-4 w-4 translate-x-0.5 rounded-full bg-[#c9c9c9] transition-transform peer-checked:translate-x-4 peer-checked:bg-color-main peer-disabled:cursor-not-allowed peer-disabled:bg-[#f2f2f2]"
            ></div>
          </div>
          <span class="w-[105px] text-right font-medium">
            {{ isIncludeAnswers ? 'Include' : 'Exclude' }} answers
          </span>
        </label>
      </div>
      <!-- <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          :checked="showAnswersInPrint"
          @change="$emit('update:showAnswersInPrint', $event.target.checked)"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span>Include answers</span>
      </label> -->
      <button
        @click="handlePrint"
        @keydown.enter.prevent="handlePrint"
        class="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold transition-all hover:bg-gray-100 focus:outline-none"
        aria-label="Print or save as PDF"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect width="12" height="8" x="6" y="14" />
        </svg>
        Print / Save PDF
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * @component ResultTabs
 * @description 결과 뷰 탭 네비게이션 컴포넌트
 * 각 섹션 간 이동을 위한 탭을 제공합니다.
 */
const props = defineProps({
  /**
   * 현재 활성화된 탭 ID
   */
  activeTab: {
    type: String,
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

defineEmits(['tab-change', 'update:showAnswersInPrint'])

/**
 * 탭 ID 목록
 */
const tabs = [
  { id: 'passage', label: 'Passage & Summary' },
  { id: 'map', label: 'Knowledge Map' },
  { id: 'vocab', label: 'Vocabulary' },
  { id: 'assessment', label: 'Assessment' },
]

/**
 * 인쇄 핸들러
 */
const handlePrint = () => {
  window.print()
}

const isIncludeAnswers = ref(false)
</script>
