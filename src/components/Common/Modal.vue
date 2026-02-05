<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="no-print no-print fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click="handleBackdropClick"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          class="w-full max-w-md transform overflow-hidden rounded-3xl shadow-2xl duration-300 animate-in zoom-in-95"
          :class="bgColorClass"
          @click.stop
        >
          <!-- 헤더 -->
          <div class="relative overflow-hidden p-4 pr-4 text-white">
            <!-- 배경 패턴 -->
            <div class="absolute inset-0 opacity-10">
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] [background-size:20px_20px]"
              ></div>
            </div>

            <div class="relative flex items-start justify-between">
              <div class="min-w-0 flex-1 p-4">
                <p id="modal-title" class="mb-2 text-2xl font-bold leading-tight">
                  {{ title }}
                </p>
              </div>
              <button
                v-if="closable"
                @click="handleClose"
                @keydown.esc="handleClose"
                class="rounded-lg border border-white/20 bg-white/10 p-1 backdrop-blur-sm transition-all hover:border-black/10 hover:bg-black/20 focus:outline-none active:scale-90"
                aria-label="모달 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 본문 -->
          <div v-if="message" class="p-8">
            <p class="whitespace-pre-line text-base font-medium leading-relaxed text-white/90">
              {{ message }}
            </p>
            <slot name="content"></slot>
          </div>
          <div v-else-if="!message" class="p-8">
            <slot name="content"></slot>
          </div>

          <!-- 푸터 -->
          <div
            v-if="buttons && buttons.length > 0"
            class="flex gap-3 px-8 py-6"
            :class="buttons.length === 1 ? 'justify-center' : 'justify-end'"
          >
            <button
              v-for="(button, index) in buttons"
              :key="index"
              @click="handleButtonClick(button)"
              class="transform rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
              :class="getButtonClass(button)"
            >
              {{ button.label }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * @component Modal
 * @description 공용 모달 컴포넌트
 * 다양한 상황에 사용할 수 있는 재사용 가능한 모달 컴포넌트입니다.
 * 성공, 에러, 정보 등 타입에 따라 색상이 자동으로 변경됩니다.
 *
 * @example
 * // 기본 사용법
 * <Modal
 *   :visible="showModal"
 *   title="알림"
 *   message="이 작업을 계속하시겠습니까?"
 *   type="info"
 *   :buttons="[
 *     { label: '취소', action: 'cancel', variant: 'secondary' },
 *     { label: '확인', action: 'confirm', variant: 'primary' }
 *   ]"
 *   @close="showModal = false"
 *   @action="handleAction"
 * />
 *
 * @example
 * // 성공 모달
 * <Modal
 *   :visible="showModal"
 *   title="성공"
 *   message="작업이 완료되었습니다!"
 *   type="success"
 *   :buttons="[{ label: '확인', action: 'confirm' }]"
 *   @close="showModal = false"
 *   @action="handleAction"
 * />
 */
import { computed, h } from 'vue'

const props = defineProps({
  /**
   * 모달 표시 여부
   */
  visible: {
    type: Boolean,
    default: false,
  },
  /**
   * 모달 제목
   */
  title: {
    type: String,
    default: '알림',
  },
  /**
   * 모달 메시지
   */
  message: {
    type: String,
    default: '',
  },
  /**
   * 모달 타입 (success, error, info, warning)
   */
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value),
  },
  /**
   * 버튼 배열
   * @example [{ label: '취소', action: 'cancel', variant: 'secondary' }, { label: '확인', action: 'confirm', variant: 'primary' }]
   */
  buttons: {
    type: Array,
    default: () => [
      {
        label: '확인',
        action: 'confirm',
        variant: 'primary',
      },
    ],
    validator: (buttons) => {
      return buttons.every(
        (btn) =>
          typeof btn === 'object' &&
          typeof btn.label === 'string' &&
          typeof btn.action === 'string',
      )
    },
  },
  /**
   * 닫기 버튼 표시 여부
   */
  closable: {
    type: Boolean,
    default: true,
  },
  /**
   * 배경 클릭 시 닫기 여부
   */
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close', 'action'])

/**
 * 타입에 따른 헤더 색상 클래스
 */
const bgColorClass = computed(() => {
  const colors = {
    success: 'bg-gradient-to-r from-green-600 to-emerald-600',
    error: 'bg-gradient-to-r from-red-700 to-rose-700',
    info: 'bg-gradient-to-r from-indigo-600 to-cyan-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  }
  return colors[props.type] || colors.info
})

/**
 * 포커스 링 색상 클래스
 */
const focusRingClass = computed(() => {
  const colors = {
    success: 'focus:ring-green-500',
    error: 'focus:ring-red-500',
    info: 'focus:ring-indigo-500',
    warning: 'focus:ring-yellow-500',
  }
  return colors[props.type] || colors.info
})

/**
 * 타입에 따른 아이콘 컴포넌트
 */
const iconComponent = computed(() => {
  const icons = {
    success: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        [h('path', { d: 'M20 6 9 17l-5-5' })],
      ),
    error: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        [
          h('circle', { cx: '12', cy: '12', r: '10' }),
          h('path', { d: 'm15 9-6 6' }),
          h('path', { d: 'm9 9 6 6' }),
        ],
      ),
    info: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        [
          h('circle', { cx: '12', cy: '12', r: '10' }),
          h('path', { d: 'M12 16v-4' }),
          h('path', { d: 'M12 8h.01' }),
        ],
      ),
    warning: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        [
          h('path', {
            d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
          }),
          h('path', { d: 'M12 9v4' }),
          h('path', { d: 'M12 17h.01' }),
        ],
      ),
  }
  return icons[props.type] || icons.info
})

/**
 * 버튼 클래스 반환
 * @param {Object} button - 버튼 객체
 * @returns {string} 버튼 클래스
 */
const getButtonClass = (button) => {
  const variant = button.variant || 'primary'
  const baseClasses = 'focus:ring-offset-2'

  if (variant === 'primary') {
    const typeColors = {
      success:
        'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 shadow-lg shadow-green-500/30',
      error:
        'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-500 shadow-lg shadow-red-500/30',
      info: 'bg-gradient-to-r from-indigo-500 to-cyan-600 text-white hover:from-indigo-600 hover:to-cyan-700 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30',
      warning:
        'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-500 shadow-lg shadow-yellow-500/30',
    }
    return `${baseClasses} ${typeColors[props.type] || typeColors.info}`
  } else if (variant === 'secondary') {
    return `${baseClasses} text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm`
  } else if (variant === 'danger') {
    return `${baseClasses} bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-500 shadow-lg shadow-red-500/30`
  } else {
    return `${baseClasses} text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm`
  }
}

/**
 * 배경 클릭 핸들러
 */
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

/**
 * 모달 닫기 핸들러
 */
const handleClose = () => {
  emit('close')
}

/**
 * 버튼 클릭 핸들러
 * @param {Object} button - 클릭된 버튼 객체
 */
const handleButtonClick = (button) => {
  emit('action', button.action, button)
  // 기본적으로 확인 액션은 모달을 닫습니다
  if (button.action === 'confirm' || button.close !== false) {
    handleClose()
  }
}
</script>
