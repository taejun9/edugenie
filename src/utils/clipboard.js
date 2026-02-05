/**
 * @fileoverview 클립보드 유틸리티 함수
 */

/**
 * 텍스트를 클립보드에 복사
 * @param {string} text - 복사할 텍스트
 * @returns {Promise<boolean>} 성공 여부
 */
export async function copyToClipboard(text) {
  if (!text) {
    return false
  }

  try {
    // 최신 Clipboard API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback: 구형 브라우저 지원
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  } catch (err) {
    console.error('Failed to copy text:', err)
    return false
  }
}
