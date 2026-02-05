/**
 * 사용량(토큰/호출 수) 상태 관리 Store
 * - 디바이스 fingerprint + 사용자 이메일 기반으로 오늘 사용량을 조회합니다.
 */
import { API_ENDPOINTS } from '@/services/api.js'
import { ref } from 'vue'
import { useAuthStore } from './auth.store.js'

/**
 * 누적 토큰 사용량
 */
const totalTokenCount = ref(0)
/**
 * 오늘 API 사용 횟수
 */
const callCount = ref(0)
/**
 * 오늘 API 한도 (비로그인 3, 로그인 5)
 */
const callLimit = ref(3)
/**
 * 오늘 잔여 호출 횟수
 */
const callRemaining = ref(3)
const tokenUsageLoading = ref(false)

const resetUsage = () => {
  totalTokenCount.value = 0
  callCount.value = 0
  callLimit.value = 3
  callRemaining.value = 3
}

const fetchTokenUsage = async () => {
  const { fingerprint, fetchFingerprint, user } = useAuthStore()

  // fingerprint가 없으면 먼저 백엔드에서 획득
  const fp = fingerprint.value || (await fetchFingerprint())
  if (!fp) {
    resetUsage()
    return 0
  }

  tokenUsageLoading.value = true
  try {
    const headers = { 'X-Fingerprint': fp }
    if (user.value?.email) headers['X-User-Email'] = user.value.email
    const res = await fetch(API_ENDPOINTS.GEMINI.USAGE, { headers })
    if (!res.ok) return 0
    const data = await res.json()
    totalTokenCount.value = data.totalTokenCount ?? 0
    callCount.value = data.callCount ?? 0
    callLimit.value = data.limit ?? 3
    callRemaining.value = data.remaining ?? Math.max(0, (data.limit ?? 3) - (data.callCount ?? 0))
    return totalTokenCount.value
  } catch (err) {
    console.warn('Token usage fetch failed:', err)
    return 0
  } finally {
    tokenUsageLoading.value = false
  }
}

export const useUsageStore = () => {
  return {
    totalTokenCount,
    callCount,
    callLimit,
    callRemaining,
    tokenUsageLoading,
    fetchTokenUsage,
  }
}
