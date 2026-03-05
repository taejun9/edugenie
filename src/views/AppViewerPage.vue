<template>
  <div class="min-h-screen bg-[#EEF2FF] selection:bg-indigo-100 selection:text-indigo-900">
    <Header>
      <template #info>
        <span
          v-if="!tokenUsageLoading"
          class="relative flex h-10 items-center gap-1 rounded-full border bg-gray-100 px-2.5"
          :title="creditTitle"
          @click="showTooltip = !showTooltip"
        >
          <div class="group flex items-baseline gap-1">
            <span
              class="text-sm font-black"
              :class="callRemaining > 0 ? 'text-[#333]' : 'text-rose-500'"
            >
              {{ callCount }} / {{ callLimit }}
            </span>
            <span
              class="text-[9px] font-bold uppercase text-gray-400 transition-colors group-hover:text-indigo-500"
            >
              Credits
            </span>
          </div>
          <div
            v-if="showTooltip"
            @click="showTooltip = false"
            class="absolute left-[45px] top-[3rem] z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-gray-800 p-2 text-[11px] text-white shadow-xl"
          >
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"
            ></div>
            {{ creditTitle }}
          </div>
        </span>
      </template>
    </Header>

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="flex justify-center py-20">
        <LoadingSpinner :progress-value="false" />
      </div>

      <div v-else-if="error" class="mx-auto max-w-5xl">
        <ErrorAlert :error="error" @close="error = null" />
        <div class="mt-4 flex justify-center">
          <router-link
            to="/mypage"
            class="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to My Content
          </router-link>
        </div>
      </div>

      <div v-else-if="content" class="mt-4">
        <!-- 상단 네비게이션바 (뒤로가기 등) -->
        <div class="no-print mx-auto mb-6 flex max-w-5xl items-center justify-between">
          <router-link
            to="/mypage"
            class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to My Content
          </router-link>
        </div>

        <ResultView :content="content" @copy="handleCopy" />
      </div>
    </main>

    <!-- Toast 알림 컨테이너 -->
    <div
      class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 space-y-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import ErrorAlert from '@/components/Common/ErrorAlert.vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import Toast from '@/components/Common/Toast.vue'
import Header from '@/components/Layout/Header.vue'
import ResultView from '@/components/ResultView/index.vue'

import { useToast } from '@/helpers/useToast.js'
import { getSavedContentById } from '@/services/geminiService.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useUsageStore } from '@/stores/usage.store.js'
import { copyToClipboard } from '@/utils/clipboard.js'

const route = useRoute()
const contentId = route.params.id

const { toasts, removeToast, showSuccess, showError } = useToast()
const { isAuthenticated } = useAuthStore()
const { callCount, callRemaining, tokenUsageLoading, callLimit, fetchTokenUsage } = useUsageStore()

const isLoading = ref(true)
const content = ref(null)
const error = ref(null)

onMounted(async () => {
  fetchTokenUsage()
  await fetchContentDetails()
})

const fetchContentDetails = async () => {
  if (!contentId) return

  isLoading.value = true
  error.value = null

  try {
    const data = await getSavedContentById(contentId)
    // contents 객체를 ResultView가 기대하는 형태(passage, questions, graph, words 등)로 래핑
    // API 응답 구조가 기존 gemini payload인지 확인 (보통 data 자체가 content 형태임)
    content.value = data
  } catch (err) {
    console.error('Failed to fetch content:', err)
    error.value =
      'Failed to load content details. It may have been deleted or you do not have permission.'
    showError(error.value)
  } finally {
    isLoading.value = false
  }
}

const handleCopy = async (text) => {
  const success = await copyToClipboard(text)
  if (success) {
    showSuccess('Copied to clipboard!')
  } else {
    showError('Failed to copy. Please check your browser settings.')
  }
}

const showTooltip = ref(false)

const creditTitle = computed(() => {
  if (callRemaining.value <= 0) {
    return "You've used all credits for today. See you tomorrow!"
  }
  return `Remaining: ${callRemaining.value} / Total: ${callLimit.value} credits today`
})
</script>
