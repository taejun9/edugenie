/**
 * @fileoverview Toast 알림 관리 Composable
 */

import { ref } from 'vue'

/**
 * Toast 메시지 타입
 * @typedef {'success' | 'error' | 'info'} ToastType
 */

/**
 * Toast 메시지 객체
 * @typedef {Object} ToastMessage
 * @property {string} id - 고유 ID
 * @property {string} message - 메시지 텍스트
 * @property {ToastType} type - 메시지 타입
 * @property {number} duration - 표시 시간 (밀리초)
 */

const toasts = ref([])

/**
 * Toast 알림 관리 Composable
 * @returns {Object} Toast 관련 함수들
 */
export function useToast() {
  /**
   * Toast 메시지 표시
   * @param {string} message - 메시지 텍스트
   * @param {ToastType} type - 메시지 타입
   * @param {number} duration - 표시 시간 (밀리초)
   */
  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString()
    toasts.value.push({
      id,
      message,
      type,
      duration,
    })

    // 자동 제거
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  /**
   * Toast 메시지 제거
   * @param {string} id - Toast ID
   */
  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * 성공 메시지 표시
   * @param {string} message - 메시지 텍스트
   */
  const showSuccess = (message) => {
    showToast(message, 'success')
  }

  /**
   * 에러 메시지 표시
   * @param {string} message - 메시지 텍스트
   */
  const showError = (message) => {
    showToast(message, 'error', 5000)
  }

  /**
   * 정보 메시지 표시
   * @param {string} message - 메시지 텍스트
   */
  const showInfo = (message) => {
    showToast(message, 'info')
  }

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  }
}
