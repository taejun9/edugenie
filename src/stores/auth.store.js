/**
 * 인증 및 사용자 상태 관리 Store
 * - 로그인 사용자 정보
 * - 디바이스 fingerprint (백엔드에서 획득)
 */
import { API_ENDPOINTS } from '@/services/api.js'
import { computed, ref } from 'vue'

/**
 * 사용자 정보
 * @type {import('vue').Ref<{name: string, email: string, provider: string, profileColor: string, picture?: string} | null>}
 */
const user = ref(null)

/**
 * 랜덤 프로필 색상 생성
 * @returns {string} Hex 색상 코드
 */
const generateRandomColor = () => {
  // 밝고 선명한 색상들을 위한 색상 팔레트
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#EF4444', // red
    '#06B6D4', // cyan
    '#F97316', // orange
    '#6366F1', // indigo
    '#14B8A6', // teal
    '#A855F7', // purple
    '#84CC16', // lime
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 로그인 상태 확인
 * @type {import('vue').ComputedRef<boolean>}
 */
const isAuthenticated = computed(() => user.value !== null)

/**
 * 사용자 이름의 첫 글자 (프로필 아바타용)
 * @type {import('vue').ComputedRef<string>}
 */
const userInitial = computed(() => {
  if (!user.value) return ''
  return user.value.name.charAt(0).toUpperCase()
})

/**
 * 로그인 함수
 * @param {Object} userData - 사용자 데이터
 * @param {string} userData.name - 사용자 이름
 * @param {string} userData.email - 사용자 이메일
 * @param {string} userData.provider - 로그인 제공자 (google, apple, kakao, naver)
 * @param {string} [userData.picture] - 사용자 프로필 사진 URL
 */
const login = (userData) => {
  // 기존 사용자 정보가 있으면 프로필 색상 유지, 없으면 새로 생성
  const existingUser = user.value
  const profileColor = existingUser?.profileColor || generateRandomColor()

  user.value = {
    name: userData.name,
    email: userData.email || '',
    provider: userData.provider,
    picture: userData.picture || '',
    profileColor: profileColor,
  }
  // 로컬 스토리지에 저장 (새로고침 시 유지)
  localStorage.setItem('user', JSON.stringify(user.value))
}

/**
 * 로그아웃 함수
 */
const logout = () => {
  user.value = null
  localStorage.removeItem('user')
}

/**
 * 저장된 사용자 정보 불러오기
 * 페이지 새로고침 시 로컬 스토리지에서 사용자 정보를 복원합니다.
 */
const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (error) {
      console.error('Failed to load user from storage:', error)
      localStorage.removeItem('user')
    }
  }
}

// 초기화 시 저장된 사용자 정보 불러오기
loadUserFromStorage()

/**
 * Fingerprint (백엔드에서 획득)
 */
const fingerprint = ref(null)
const fingerprintLoading = ref(false)
let fingerprintFetchPromise = null

const fetchFingerprint = async () => {
  if (fingerprint.value) return fingerprint.value
  if (fingerprintFetchPromise) return fingerprintFetchPromise

  fingerprintLoading.value = true
  fingerprintFetchPromise = (async () => {
    try {
      const res = await fetch(API_ENDPOINTS.FINGERPRINT)
      if (!res.ok) throw new Error(`Fingerprint fetch failed: ${res.status}`)
      const data = await res.json()
      const value = data?.fingerprint ?? null
      fingerprint.value = value
      return value
    } catch (err) {
      console.warn('Fingerprint fetch failed:', err)
      return null
    } finally {
      fingerprintLoading.value = false
      fingerprintFetchPromise = null
    }
  })()

  return fingerprintFetchPromise
}

export const useAuthStore = () => {
  return {
    user,
    isAuthenticated,
    userInitial,
    login,
    logout,
    fingerprint,
    fingerprintLoading,
    fetchFingerprint,
  }
}
