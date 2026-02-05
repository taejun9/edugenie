<template>
  <div class="min-h-screen bg-gray-50 selection:bg-indigo-100 selection:text-indigo-900">
    <Header />

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

      <div v-if="status === 'idle'" class="no-print mt-12">
        <FeatureCards />
      </div>
    </main>

    <Footer v-if="status !== 'loading' && status !== 'success'" />

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
 * @component Home
 * @description 홈 페이지 컴포넌트
 * 교육 자료 생성 애플리케이션의 메인 페이지입니다.
 */
import { nextTick, ref } from 'vue'

import ErrorAlert from '@/components/Common/ErrorAlert.vue'
import FeatureCards from '@/components/Common/FeatureCards.vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import Toast from '@/components/Common/Toast.vue'

import HeroSection from '@/components/Main/HeroSection.vue'
import InputForm from '@/components/Main/InputForm/index.vue'

import ResultView from '@/components/ResultView/index.vue'

import Footer from '@/components/Layout/Footer.vue'
import Header from '@/components/Layout/Header.vue'

import { useToast } from '@/helpers/useToast.js'
import { generateEducationalContent } from '@/services/geminiService.js'
import { useUsageStore } from '@/stores/usage.store.js'
import { copyToClipboard } from '@/utils/clipboard.js'

const { toasts, removeToast, showSuccess, showError } = useToast()
const { fetchTokenUsage } = useUsageStore()

const status = ref('idle')
const content = ref(null)
const error = ref(null)
const inputFormRef = ref(null)
const resultRef = ref(null)
const isGenerating = ref(false)
const loadingProgress = ref(0)
const tokenUsage = ref(null)
let progressInterval = null

/**
 * 상태 변경 함수
 * @param {string} newStatus - 새로운 상태
 */
const setStatus = (newStatus) => {
  status.value = newStatus
}

/**
 * 교육 자료 생성 핸들러
 * 중복 요청을 방지하고 에러 처리를 개선합니다.
 * @param {Object} params - 생성 파라미터
 */
const handleGenerate = async (params) => {
  // 중복 요청 방지
  if (isGenerating.value) {
    showError('Materials are already being generated. Please wait a moment.')
    return
  }

  // 입력 검증
  if (!params.topic || !params.topic.trim()) {
    showError('Please enter a learning topic.')
    return
  }

  isGenerating.value = true
  status.value = 'loading'
  error.value = null
  loadingProgress.value = 0
  tokenUsage.value = null

  // 진행률 자동 증가 시작 (백업용, API 콜백이 없을 때 사용)
  progressInterval = setInterval(() => {
    if (loadingProgress.value < 95) {
      const increment =
        loadingProgress.value < 30
          ? 2 // 초기: 빠르게 증가
          : loadingProgress.value < 60
            ? 1.5 // 중간: 보통 속도
            : 0.5 // 후반: 느리게 증가

      loadingProgress.value = Math.min(loadingProgress.value + increment, 95)
    }
  }, 500)

  try {
    const result = await generateEducationalContent({
      ...params,
      onProgress: (progress) => {
        // API에서 받은 실제 진행률로 업데이트
        loadingProgress.value = progress
      },
      onTokenUsage: (usage) => {
        // 토큰 사용량 저장
        tokenUsage.value = usage
      },
    })

    // 결과가 나온 후 100%로 상승
    loadingProgress.value = 100

    // 진행률 인터벌 정리
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    // 0.5초 지연 후 화면에 데이터 표시
    await new Promise((resolve) => setTimeout(resolve, 500))

    content.value = result
    status.value = 'success'
    const usage = tokenUsage.value
    const successMsg =
      usage?.totalTokenCount != null
        ? `Educational materials have been successfully generated!\n(Tokens: ${usage.totalTokenCount.toLocaleString()}, Input: ${(usage.promptTokenCount ?? 0).toLocaleString()}, Output: ${(usage.candidatesTokenCount ?? 0).toLocaleString()})`
        : 'Educational materials have been successfully generated!'
    showSuccess(successMsg)

    // 누적 토큰 사용량 갱신 (로그인 시)
    fetchTokenUsage()

    await nextTick()
    resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch (err) {
    console.error('Generation error:', err)

    // 사용자 친화적인 에러 메시지
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
    // 진행률 인터벌 정리
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    loadingProgress.value = 0
    isGenerating.value = false
    // 토큰 사용량은 유지 (결과 화면에서 표시 가능)
  }
}

/**
 * 클립보드 복사 핸들러
 * @param {string} text - 복사할 텍스트
 */
const handleCopy = async (text) => {
  const success = await copyToClipboard(text)
  if (success) {
    showSuccess('Copied to clipboard!')
  } else {
    showError('Failed to copy. Please check your browser settings.')
  }
}
</script>
