<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      :class="[
        'no-print z-50 flex w-full max-w-md items-start gap-3 rounded-lg border px-8 py-6 shadow-lg',
        type === 'success'
          ? 'border-green-200 bg-green-50 text-green-800'
          : type === 'error'
            ? 'border-red-200 bg-red-50 text-red-800'
            : type === 'info'
              ? 'border-blue-200 bg-blue-50 text-blue-800'
              : 'border-gray-200 bg-gray-50 text-gray-800',
      ]"
      role="alert"
      aria-live="polite"
    >
      <div class="flex-shrink-0">
        <svg
          v-if="type === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else-if="type === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
      <button
        @click="close"
        class="flex-shrink-0 text-current opacity-60 transition-opacity hover:opacity-100"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

/**
 * @component Toast
 * @description 토스트 알림 컴포넌트
 * 성공, 에러, 정보 메시지를 표시합니다.
 *
 * @example
 * <Toast
 *   :message="'복사되었습니다!'"
 *   type="success"
 *   :duration="3000"
 *   @close="handleClose"
 * />
 */
const props = defineProps({
  /**
   * 표시할 메시지
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * 토스트 타입 (success, error, info)
   */
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value),
  },
  /**
   * 자동 닫기 시간 (밀리초, 0이면 자동 닫기 안 함)
   */
  duration: {
    type: Number,
    default: 3000,
  },
})

const emit = defineEmits(['close'])

const visible = ref(false)
let timeoutId = null

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

watch(
  () => props.message,
  () => {
    visible.value = true
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if (props.duration > 0) {
      timeoutId = setTimeout(() => {
        close()
      }, props.duration)
    }
  },
)

const close = () => {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  setTimeout(() => {
    emit('close')
  }, 200)
}
</script>
