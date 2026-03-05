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
    'ngrok-skip-browser-warning': 'true',
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

  const generated = data?.content ?? data
  if (!generated || typeof generated !== 'object') {
    return generated
  }

  const contentId =
    generated.contentId ?? generated.content_id ?? data?.contentId ?? data?.content_id

  return {
    ...generated,
    ...(contentId ? { contentId } : {}),
  }
}

/**
 * 저장된 교육 컨텐츠 목록 조회
 */
export async function getSavedContents() {
  const { user } = useAuthStore()
  const userEmail = user?.value?.email

  if (!userEmail) throw new Error('You must be logged in to view saved contents.')

  const headers = {
    'Content-Type': 'application/json',
    'X-User-Email': userEmail,
  }

  const res = await fetch(API_ENDPOINTS.GEMINI.SAVED_CONTENTS, {
    method: 'GET',
    headers,
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch saved contents (${res.status})`)
  }

  return await res.json()
}

/**
 * 특정 교육 컨텐츠 상세 조회
 * @param {string} id - 컨텐츠 ID
 */
export async function getSavedContentById(id) {
  const { user } = useAuthStore()
  const userEmail = user?.value?.email

  if (!userEmail) throw new Error('You must be logged in to view this content.')

  const headers = {
    'Content-Type': 'application/json',
    'X-User-Email': userEmail,
  }

  const res = await fetch(API_ENDPOINTS.GEMINI.SAVED_CONTENT_BY_ID(id), {
    method: 'GET',
    headers,
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch content details (${res.status})`)
  }

  return await res.json()
}

/**
 * 특정 교육 컨텐츠 삭제 (Soft Delete)
 * @param {string} id - 컨텐츠 ID
 */
export async function deleteSavedContent(id) {
  const { user } = useAuthStore()
  const userEmail = user?.value?.email

  if (!userEmail) throw new Error('You must be logged in to delete this content.')

  const headers = {
    'Content-Type': 'application/json',
    'X-User-Email': userEmail,
  }

  const res = await fetch(API_ENDPOINTS.GEMINI.DELETE_CONTENT(id), {
    method: 'DELETE',
    headers,
  })

  if (!res.ok) {
    throw new Error(`Failed to delete content (${res.status})`)
  }

  return await res.json()
}
