/**
 * @file geminiUpdateService.js
 * @description Gemini 저장 컨텐츠 업데이트용 서비스 (PATCH /gemini/content/:id)
 */
import { API_ENDPOINTS } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.store.js'

/**
 * 저장된 교육 컨텐츠 업데이트
 * @param {Object} params
 * @param {string} params.contentId - SavedContentEntity.contentId
 * @param {Object} params.content - 수정된 EducationalContentDto 전체 객체
 */
export async function updateEducationalContent({ contentId, content }) {
  const { user } = useAuthStore()
  const userEmail = user?.value?.email

  if (!userEmail) {
    throw new Error('Login is required.')
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-User-Email': userEmail,
    'ngrok-skip-browser-warning': 'true',
  }

  const res = await fetch(`${API_ENDPOINTS.GEMINI.EDUCATIONAL_CONTENT}/${contentId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      ...content,
    }),
  })

  if (!res.ok) {
    let message = `Failed to update content (${res.status})`
    try {
      const data = await res.json()
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
      }
    } catch {
      /* ignore */
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  const data = await res.json()
  // 백엔드에서 SavedContentEntity를 반환하므로, content만 다시 돌려준다
  const updated = data?.content ?? content
  const updatedContentId =
    updated?.contentId ?? updated?.content_id ?? data?.contentId ?? data?.content_id

  return {
    ...updated,
    ...(updatedContentId ? { contentId: updatedContentId } : {}),
  }
}
