<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md text-center">
      <div v-if="loading" class="space-y-4">
        <div
          class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"
        ></div>
        <p class="text-gray-600">로그인 처리 중...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900">로그인 실패</h2>
        <p class="text-gray-600">{{ error }}</p>
        <button
          @click="retryLogin"
          class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @component AuthCallback
 * @description OAuth 콜백 처리 컴포넌트
 * 백엔드에서 리다이렉트된 사용자 정보를 받아 처리합니다.
 */
import { API_ENDPOINTS } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { login, fetchFingerprint } = useAuthStore()

const loading = ref(true)
const error = ref(null)

/**
 * OAuth 콜백 처리
 * URL 쿼리 파라미터에서 사용자 정보를 추출하고 저장합니다.
 */
onMounted(() => {
  try {
    const { name, email, picture, provider } = route.query

    if (!name || !email || !provider) {
      throw new Error('필수 사용자 정보가 없습니다.')
    }

    const userData = {
      name: decodeURIComponent(name),
      email: decodeURIComponent(email),
      picture: picture ? decodeURIComponent(picture) : '',
      provider: decodeURIComponent(provider),
    }

    // 팝업으로 열린 경우: 부모 창에 전달 후 닫기
    if (window.opener) {
      window.opener.postMessage({ type: 'oauth-success', user: userData }, window.location.origin)
      window.close()
      return
    }

    // 일반 페이지로 열린 경우: 스토어에 저장 후 홈으로 이동
    login(userData)
    setTimeout(() => {
      router.push({ path: '/', query: {} })
    }, 1000)
  } catch (err) {
    console.error('OAuth 콜백 처리 오류:', err)
    error.value = err.message || '로그인 처리 중 오류가 발생했습니다.'
    loading.value = false
  }
})

/**
 * 로그인 다시 시도 (같은 창에서 OAuth로 리다이렉트)
 */
const retryLogin = async () => {
  const fp = await fetchFingerprint()
  const url = new URL(API_ENDPOINTS.AUTH.GOOGLE)
  if (fp) url.searchParams.set('fingerprint', fp)
  window.location.href = url.toString()
}
</script>
