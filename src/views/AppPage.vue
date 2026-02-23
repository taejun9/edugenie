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
            <span
              v-if="!isAuthenticated"
              class="ml-1 animate-pulse text-[10px] font-medium text-indigo-400"
            >
              (+2 🔓)
            </span>
          </div>
          <div
            v-if="showTooltip"
            @click="showTooltip = false"
            class="absolute top-[3rem] z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-gray-800 p-2 text-[11px] text-white shadow-xl"
            :class="isAuthenticated ? 'left-[45px]' : 'left-[65px]'"
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
      <div class="no-print mx-auto max-w-5xl">
        <HeroSection />

        <InputForm
          ref="inputFormRef"
          @generate="handleGenerate"
          :is-loading="status === 'loading'"
        />

        <ErrorAlert
          v-if="status === 'error'"
          :error="error || 'An unknown error occurred.'"
          @close="setStatus('idle')"
        />

        <LoadingSpinner v-if="status === 'loading'" :progress-value="loadingProgress" />
      </div>

      <div v-if="status === 'success' && content" ref="resultRef" class="mt-4">
        <ResultView :content="content" @copy="handleCopy" />
      </div>

      <div v-if="status === 'idle'" class="no-print mx-auto mt-12 max-w-5xl">
        <FeatureCards />
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
/**
 * @component AppPage
 * @description 서비스 메인 페이지 (기존 Home.vue 로직 이전)
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import ErrorAlert from '@/components/Common/ErrorAlert.vue'
import FeatureCards from '@/components/Common/FeatureCards.vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import Toast from '@/components/Common/Toast.vue'

import HeroSection from '@/components/Main/HeroSection.vue'
import InputForm from '@/components/Main/InputForm/index.vue'

import ResultView from '@/components/ResultView/index.vue'

import Header from '@/components/Layout/Header.vue'

import { useToast } from '@/helpers/useToast.js'
import { generateEducationalContent } from '@/services/geminiService.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useUsageStore } from '@/stores/usage.store.js'
import { copyToClipboard } from '@/utils/clipboard.js'

const { toasts, removeToast, showSuccess, showError } = useToast()
const { isAuthenticated } = useAuthStore()
const { callCount, callRemaining, tokenUsageLoading, callLimit, fetchTokenUsage } = useUsageStore()

const status = ref('idle')
const content = ref(null)
const error = ref(null)
const inputFormRef = ref(null)
const resultRef = ref(null)
const isGenerating = ref(false)
const loadingProgress = ref(0)
const tokenUsage = ref(null)
let progressInterval = null

onMounted(() => {
  fetchTokenUsage()
})
watch(isAuthenticated, () => {
  fetchTokenUsage()
})

const setStatus = (newStatus) => {
  status.value = newStatus
}

const handleGenerate = async (params) => {
  if (isGenerating.value) {
    showError('Materials are already being generated. Please wait a moment.')
    return
  }

  if (!params.topic || !params.topic.trim()) {
    showError('Please enter a learning topic.')
    return
  }

  isGenerating.value = true
  status.value = 'loading'
  error.value = null
  loadingProgress.value = 0
  tokenUsage.value = null

  progressInterval = setInterval(() => {
    if (loadingProgress.value < 95) {
      const increment = loadingProgress.value < 30 ? 2 : loadingProgress.value < 60 ? 1.5 : 0.5

      loadingProgress.value = Math.min(loadingProgress.value + increment, 95)
    }
  }, 500)

  try {
    const result = await generateEducationalContent({
      ...params,
      onProgress: (progress) => {
        loadingProgress.value = progress
      },
      onTokenUsage: (usage) => {
        tokenUsage.value = usage
      },
    })

    loadingProgress.value = 100

    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    content.value = result
    status.value = 'success'
    const usage = tokenUsage.value
    const successMsg =
      usage?.totalTokenCount != null
        ? `Educational materials have been successfully generated!\n(Tokens: ${usage.totalTokenCount.toLocaleString()}, Input: ${(usage.promptTokenCount ?? 0).toLocaleString()}, Output: ${(usage.candidatesTokenCount ?? 0).toLocaleString()})`
        : 'Educational materials have been successfully generated!'
    showSuccess(successMsg)

    fetchTokenUsage()

    await nextTick()
    resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch (err) {
    console.error('Generation error:', err)

    let errorMessage = 'An unexpected error occurred while generating materials.'

    if (err.message) {
      if (err.message.includes('API key')) {
        errorMessage = 'API key is not configured. Please check your environment variables.'
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Please check your network connection.'
      } else if (err.message.includes('parse')) {
        errorMessage = 'An error occurred while processing the server response. Please try again.'
      } else {
        errorMessage = err.message
      }
    }

    error.value = errorMessage
    status.value = 'error'
    showError(errorMessage)
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    loadingProgress.value = 0
    isGenerating.value = false
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
  // 1. 횟수를 다 썼을 때
  if (callRemaining.value <= 0) {
    return isAuthenticated.value
      ? "You've used all credits for today. See you tomorrow!"
      : 'Daily limit reached. Log in now to get 2 more credits instantly!'
  }

  // 2. 로그인 상태일 때
  if (isAuthenticated.value) {
    return `Remaining: ${callRemaining.value} / Total: 5 credits today`
  }

  // 3. 비로그인(게스트) 상태일 때
  return `Guest: ${callRemaining.value} credits left. Log in to unlock 5 daily credits!`
})
</script>
