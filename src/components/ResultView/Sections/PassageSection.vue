<template>
  <section
    :class="[
      isActive ? 'block' : 'hidden print:!block',
      'print-keep-together duration-500 animate-in fade-in slide-in-from-bottom-4',
    ]"
    :id="'tabpanel-passage'"
    role="tabpanel"
    :aria-labelledby="'tab-passage'"
  >
    <div v-if="content.imageUrl" class="group relative mb-10 print:mb-4">
      <div
        class="overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
      >
        <img
          :src="content.imageUrl"
          :alt="`${content.topic} 관련 이미지`"
          class="aspect-video w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
    <div class="mb-6 flex items-end justify-between print:mb-3">
      <h2
        class="border-l-8 border-indigo-600 pl-4 text-2xl font-black uppercase tracking-tight text-gray-800"
      >
        {{ t(content.language, 'readingPassage') }}
      </h2>
      <button
        @click="$emit('copy', content.adaptedReadingPassage)"
        @keydown.enter.prevent="$emit('copy', content.adaptedReadingPassage)"
        class="no-print rounded px-2 py-1 text-sm font-bold text-indigo-600 transition-all hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :aria-label="t(content.language, 'copyText')"
      >
        {{ t(content.language, 'copyText') }}
      </button>
    </div>
    <div class="prose prose-indigo max-w-none text-lg font-medium leading-relaxed text-gray-700">
      <p
        v-for="(p, i) in paragraphs"
        :key="i"
        class="mb-6 indent-0 print:mb-3"
        v-html="renderPassageWithCitations(p)"
      ></p>
    </div>
    <div
      class="mt-10 rounded-3xl border border-indigo-100 bg-indigo-50/50 p-8 print:mt-4 print:p-4"
    >
      <h3 class="mb-3 flex items-center gap-2 text-lg font-black text-indigo-900 print:mb-2">
        {{ t(content.language, 'summary') }}
      </h3>
      <p class="font-semibold leading-relaxed text-indigo-800">
        {{ content.summary }}
      </p>
    </div>
    <!-- 위키피디아 참고 문헌 -->
    <div
      v-if="content.sources && content.sources.length > 0"
      class="no-print mt-12 border-t-2 border-gray-50 pt-8"
    >
      <h4 class="mb-6 text-xs font-black uppercase tracking-widest text-gray-400">
        {{ t(content.language, 'wikipediaReferences') }}
      </h4>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          v-for="(src, i) in content.sources"
          :key="i"
          :href="src.uri"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-indigo-300 hover:bg-white"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-black text-indigo-600 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white"
          >
            {{ i + 1 }}
          </span>
          <div class="overflow-hidden">
            <p class="truncate text-sm font-bold text-gray-800">{{ src.title }}</p>
            <p class="truncate font-mono text-[10px] text-gray-400">{{ src.uri }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../i18n.js'

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

defineEmits(['copy'])

const paragraphs = computed(() =>
  props.content.adaptedReadingPassage.split(/\n+/).filter((p) => p.trim()),
)

const renderPassageWithCitations = (text) => {
  if (!text) return ''
  const parts = text.split(/(\[\d+\])/g)
  return parts
    .map((part) => {
      const match = part.match(/\[(\d+)\]/)
      if (match) {
        const citationNum = parseInt(match[1], 10)
        const sourceIndex = citationNum - 1
        const source = props.content.sources?.[sourceIndex]
        // 소스와 URI가 있을 때만 링크로 변환, 없으면 인용 마커 제거
        if (source?.uri) {
          return `<sup class="px-0.5 align-top">
            <a
              href="${source.uri}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm no-print"
            >
              ${citationNum}
            </a>
          </sup>`
        }
        // URI가 없는 인용은 제거
        return ''
      }
      return part
    })
    .join('')
}
</script>
