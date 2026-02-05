<template>
  <div
    class="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/30"
  >
    <div
      class="flex flex-col items-center justify-center gap-y-6"
      role="status"
      aria-live="polite"
      aria-label="generating materials"
    >
      <MagicBook class="scale-80" />
      <div class="flex flex-col items-center justify-center gap-y-2 rounded-3xl">
        <p
          class="text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] wave-text text-lg font-bold backdrop-blur-sm"
        >
          Magically generating your materials...
        </p>
        <p
          class="text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] animate-pulse font-medium text-[#f9f9f9] backdrop-blur-sm"
        >
          {{ loadingMessage }}
        </p>
        <div
          class="mt-4 h-3 w-64 overflow-hidden rounded-full border-2 border-blue-600 bg-gray-200"
        >
          <div
            class="h-full rounded-full bg-gradient-to-r from-color-main to-color-sub transition-all duration-500 ease-out"
            :style="{ width: `${displayProgress}%` }"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MagicBook from './MagicBook.vue'

/**
 * @component LoadingSpinner
 * @description 로딩 스피너 컴포넌트
 * 자료 생성 중임을 표시합니다.
 */
const loadingMessages = [
  'Scanning information, adjusting reading levels, and crafting questions...',
  'Gathering relevant information from Wikipedia...',
  'Drafting passages tailored to the grade level...',
  'Extracting key vocabulary and defining terms...',
  'Generating assessment questions...',
  'Building the knowledge map...',
]

const props = defineProps({
  /**
   * 외부에서 제어하는 진행률 (0-100)
   * 제공되지 않으면 내부적으로 자동 증가
   */
  progressValue: {
    type: Number,
    default: null,
  },
})

const loadingMessage = ref(loadingMessages[0])
const progress = ref(0)
let messageInterval = null
let progressInterval = null

// 외부에서 진행률을 제어하는 경우 외부 값을 사용, 아니면 내부 값을 사용
const displayProgress = computed(() => {
  return props.progressValue !== null ? props.progressValue : progress.value
})

onMounted(() => {
  let currentIndex = 0

  // 메시지 변경 인터벌
  messageInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % loadingMessages.length
    loadingMessage.value = loadingMessages[currentIndex]
  }, 3000)

  // 외부에서 진행률을 제어하지 않는 경우에만 자동 증가
  if (props.progressValue === null) {
    // 진행률 증가 인터벌
    // 초기에는 빠르게 증가하다가 점점 느려지도록
    progressInterval = setInterval(() => {
      if (progress.value < 95) {
        // 현재 진행률에 따라 증가 속도 조절
        // 낮을 때는 빠르게, 높을 때는 느리게
        const increment =
          progress.value < 30
            ? 5 // 초기: 빠르게 증가
            : progress.value < 60
              ? 3 // 중간: 보통 속도
              : 1.5 // 후반: 느리게 증가

        progress.value = Math.min(progress.value + increment, 95)
      }
    }, 500) // 0.5초마다 업데이트
  }
})

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval)
  }
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>
<style>
.wave-text {
  background: linear-gradient(90deg, #2563eb, #7f22fe, #e60076, #7f22fe, #2563eb);
  background-size: 200% 100%;
  background-position: 0% 50%;

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  animation: waveColor 2.5s ease-in-out infinite;
}

@keyframes waveColor {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
