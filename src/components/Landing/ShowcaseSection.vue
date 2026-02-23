<template>
  <section id="showcase" class="bg-white py-20 sm:py-28">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-12 text-center lg:mb-16">
        <div
          class="mb-6 inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-color-main"
        >
          SHOWCASE
        </div>
        <h2
          class="mb-6 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl"
        >
          Experience the Magic
        </h2>
        <p class="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-[#64748B] sm:text-xl">
          Watch how EduGenie handles complex Wikipedia concepts and visualizes them into a
          structured lesson in under 60 seconds.
        </p>
      </div>

      <!-- Browser mockup container -->
      <div class="mx-auto max-w-[1000px]">
        <div class="overflow-hidden rounded-[2rem] border-[8px] border-slate-50 bg-white shadow-lg">
          <!-- Browser Top Bar -->
          <div class="flex items-center gap-4 border-b border-gray-100 bg-white px-6 py-4">
            <!-- Window Controls -->
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
              <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
              <div class="h-3 w-3 rounded-full bg-[#27C93F]"></div>
            </div>

            <!-- Address Bar -->
            <div
              class="flex h-8 w-full max-w-sm items-center rounded-md border border-gray-100 bg-slate-50 px-4"
            >
              <span class="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                {{ windowUrl }}
              </span>
            </div>
          </div>

          <!-- Video Area -->
          <div class="relative aspect-video w-full bg-[#1A202C]">
            <!-- Actual Video Tag -->
            <video
              ref="videoPlayer"
              class="h-full w-full object-cover"
              :controls="isPlaying"
              @loadedmetadata="onVideoLoaded"
              @play="isPlaying = true"
              @pause="isPlaying = false"
              @ended="isPlaying = false"
              preload="metadata"
            >
              <!-- TODO: 실제 비디오 경로로 변경 필요 -->
              <source src="" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <!-- Play Button Container (Overlay when not playing) -->
            <div
              v-if="!isPlaying"
              class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-opacity duration-300"
              @click="playVideo"
            >
              <button
                class="group relative mb-6 flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <div
                  class="absolute flex h-full w-full items-center justify-center group-hover:hidden"
                >
                  <div
                    class="h-2/3 w-2/3 animate-ping rounded-full bg-white/20 transition-all duration-300"
                  ></div>
                </div>
                <!-- Inner white circle for play icon -->
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <svg class="h-8 w-8 text-color-main" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>

              <!-- Title and Time -->
              <h3 class="mb-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Click to Watch Demo
              </h3>
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400">
                FULL TOUR • {{ formattedPlayTime }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const windowUrl = ref('HTTPS://EDUGENIE.AI/DEMO-PREVIEW')
const duration = ref(0)
const isPlaying = ref(false)
const videoPlayer = ref(null)

// 비디오 메타데이터가 로드되었을 때 길이를 업데이트
const onVideoLoaded = (event) => {
  duration.value = event.target.duration
}

const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play()
    isPlaying.value = true
  }
}

// 초 단위의 시간을 MM:SS 형식으로 변환
const formattedPlayTime = computed(() => {
  if (!duration.value) return '0:00'
  const minutes = Math.floor(duration.value / 60)
  const seconds = Math.floor(duration.value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>
