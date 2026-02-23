/**
 * @file geminiService.js
 * @description 백엔드 Gemini API 호출 서비스
 */
import { API_ENDPOINTS } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.store.js'

/**
 * 교육 컨텐츠 생성
 * @param {Object} params - topic, gradeLevel, language, passageLength, mapComplexity, onProgress, onTokenUsage
 */
export async function generateEducationalContent(params) {
  if (params.onProgress) params.onProgress(10)

  const { fetchFingerprint, user } = useAuthStore()
  const fingerprint = await fetchFingerprint()
  const userEmail = user?.value?.email

  const headers = {
    'Content-Type': 'application/json',
  }
  if (fingerprint) headers['X-Fingerprint'] = fingerprint
  if (userEmail) headers['X-User-Email'] = userEmail

  const res = await fetch(API_ENDPOINTS.GEMINI.EDUCATIONAL_CONTENT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      topic: params.topic,
      gradeLevel: params.gradeLevel,
      language: params.language,
      passageLength: params.passageLength,
      mapComplexity: params.mapComplexity,
    }),
  })

  if (!res.ok) {
    let message = `Backend request failed (${res.status})`
    try {
      const data = await res.json()
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
      }
      // 403 = 일일 호출 한도 초과 (비로그인 3회, 로그인 5회)
    } catch {
      /* ignore */
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  const data = await res.json()

  // 진행률 업데이트 (백엔드 응답 수신)
  if (params.onProgress) {
    params.onProgress(95)
  }

  if (data?.usageMetadata && params.onTokenUsage) {
    params.onTokenUsage({
      promptTokenCount: data.usageMetadata.promptTokenCount || 0,
      candidatesTokenCount: data.usageMetadata.candidatesTokenCount || 0,
      totalTokenCount: data.usageMetadata.totalTokenCount || 0,
    })
  }

  // 진행률 업데이트 (완료)
  if (params.onProgress) {
    params.onProgress(100)
  }

  return data.content
}
