<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="edge"
        class="no-print fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md"
        @click="$emit('close')"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          class="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border-4 border-indigo-50 bg-white shadow-2xl duration-300 animate-in zoom-in-95"
          @click.stop
        >
          <div
            class="flex items-start justify-between bg-gradient-to-r from-indigo-600 to-cyan-600 p-5 text-white"
          >
            <div class="flex flex-col items-start justify-center gap-2 pl-3 pt-3">
              <span class="text-sm font-black font-semibold uppercase tracking-[0.2em] opacity-80">
                {{ t(language, 'relationshipDetail') }}
              </span>
              <h3 id="modal-title" class="flex items-center gap-3 text-2xl font-black">
                {{ getNodeLabel(edge.source) }}
                <span class="rounded-lg bg-white/20 p-1" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
                {{ getNodeLabel(edge.target) }}
              </h3>
            </div>
            <button
              @click="$emit('close')"
              @keydown.esc="$emit('close')"
              class="rounded-xl bg-white/10 p-2 transition-all hover:bg-white/20 focus:outline-none active:scale-90"
              :aria-label="t(language, 'closeModal')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div class="max-h-[70vh] space-y-10 overflow-y-auto p-10">
            <div class="space-y-4">
              <h4
                class="flex items-center gap-2 text-sm font-black font-semibold uppercase tracking-widest text-indigo-500"
              >
                <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
                {{ t(language, 'contextSnippet') }}
              </h4>
              <div
                class="rounded-[2rem] border-2 border-indigo-100 bg-indigo-50/50 p-7 italic shadow-inner"
              >
                <p class="relative text-xl font-bold leading-relaxed text-slate-800">
                  <span class="absolute -left-2 -top-4 text-4xl text-indigo-200 opacity-50">"</span>
                  {{ edge.contextSnippet }}
                  <span class="absolute -bottom-8 -right-2 text-4xl text-indigo-200 opacity-50">
                    "
                  </span>
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <h4
                class="flex items-center gap-2 text-sm font-black font-semibold uppercase tracking-widest text-cyan-500"
              >
                <span class="h-2 w-2 rounded-full bg-cyan-500"></span>
                {{ t(language, 'deepExplanation') }}
              </h4>
              <div class="prose prose-indigo max-w-none">
                <p class="text-lg font-semibold leading-relaxed text-slate-600">
                  {{ edge.explanation }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex select-none justify-center p-4">
            <button
              @click="$emit('close')"
              @keydown.enter.prevent="$emit('close')"
              class="rounded-2xl bg-indigo-600 px-6 py-3 font-black text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 focus:outline-none active:scale-95"
            >
              {{ t(language, 'confirmClose') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, Teleport, watch } from 'vue'
import { t } from './i18n.js'

/**
 * @component EdgeDetailModal
 * @description 간선 상세 정보 모달 컴포넌트
 * 지식맵의 간선을 클릭했을 때 관계의 상세 정보를 표시합니다.
 */
const props = defineProps({
  /**
   * 표시할 간선 객체
   */
  edge: {
    type: Object,
    default: null,
  },
  /**
   * 노드 배열 (라벨 조회용)
   */
  nodes: {
    type: Array,
    required: true,
  },
  /**
   * 출력 언어
   */
  language: {
    type: String,
    default: 'Korean',
  },
})

defineEmits(['close'])

/**
 * 노드 ID로 라벨 조회
 * @param {string} id - 노드 ID
 * @returns {string} 노드 라벨
 */
const getNodeLabel = (id) => props.nodes.find((n) => n.id === id)?.label || id

// 모달이 열릴 때 포커스 관리
watch(
  () => props.edge,
  async (newEdge) => {
    if (newEdge) {
      await nextTick()
      const modal = document.querySelector('[role="dialog"]')
      if (modal) {
        const focusableElement = modal.querySelector('button')
        if (focusableElement) {
          focusableElement.focus()
        }
      }
    }
  },
)
</script>
