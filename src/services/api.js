/**
 * @file api.js
 * @description EduGenie 백엔드 API 엔드포인트 상수 정의
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api'

export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: `${API_BASE_URL}/auth/google`,
    STATUS: `${API_BASE_URL}/auth/status`,
  },
  GEMINI: {
    EDUCATIONAL_CONTENT: `${API_BASE_URL}/gemini/educational-content`,
    USAGE: `${API_BASE_URL}/gemini/usage`,
  },
  FINGERPRINT: `${API_BASE_URL}/fingerprint`,
}
