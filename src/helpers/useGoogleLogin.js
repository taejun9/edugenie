/**
 * @file Google OAuth 팝업 로그인 Composable
 * @description 우측 상단에 Google 계정 선택 팝업을 띄우고,
 * 백엔드 `/auth/google` 엔드포인트와 fingerprint를 연동하여 로그인 흐름을 처리합니다.
 */
import { API_ENDPOINTS } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.store.js'

export function useGoogleLogin() {
  const { login, fetchFingerprint } = useAuthStore()

  const getOAuthUrl = async () => {
    const fp = await fetchFingerprint()
    const url = new URL(API_ENDPOINTS.AUTH.GOOGLE)
    if (fp) url.searchParams.set('fingerprint', fp)
    return url.toString()
  }

  const openGoogleLoginPopup = async () => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width)
    const top = 50

    const oauthUrl = await getOAuthUrl()
    const popup = window.open(
      oauthUrl,
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    )

    const handleMessage = (event) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === 'oauth-success' &&
        event.data?.user
      ) {
        login(event.data.user)
        window.removeEventListener('message', handleMessage)
      }
    }

    window.addEventListener('message', handleMessage)

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        window.removeEventListener('message', handleMessage)
      }
    }, 500)
  }

  return { openGoogleLoginPopup }
}
