<template>
  <section class="relative overflow-hidden bg-[#EEF2FF] pb-16 pt-28 sm:pb-24 sm:pt-36">
    <!-- Background gradient -->
    <!-- <div
      class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 via-white to-white"
    ></div>
    <div
      class="pointer-events-none absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/40 to-violet-100/30 blur-3xl"
    ></div> -->

    <div class="mx-auto max-w-4xl px-4 text-center">
      <!-- Badge -->
      <div
        class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5"
      >
        <span class="h-2 w-2 rounded-full bg-color-main"></span>
        <span class="text-xs font-semibold tracking-tight text-color-main">
          THE SMARTEST AI ASSISTANT
        </span>
      </div>

      <!-- Title -->
      <p
        class="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-7xl"
      >
        From topic to full lesson
        <br />
        <span class="bg-gradient-to-r from-color-main to-color-sub bg-clip-text text-transparent">
          — in 60 seconds.
        </span>
      </p>

      <!-- Subtitle -->
      <p class="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
        Articles, knowledge maps, and quizzes generated instantly.
        <br />
        No formatting. No prep burnout.
      </p>

      <!-- CTA Buttons -->
      <div class="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          @click="$router.push('/app')"
          class="rounded-2xl bg-color-main px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-color-main/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-color-main/30"
        >
          Generate My First Lesson Free ✨
        </button>
        <button
          @click="scrollToShowcase"
          class="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-[#475569] transition-all duration-300 hover:scale-[1.02] hover:border-gray-400 hover:bg-gray-50 hover:shadow-xl hover:shadow-gray-500/30"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Watch 1-min Demo</span>
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-5xl px-10 py-4">
      <InputForm :isLoading="false" />
    </div>
  </section>
</template>

<script setup>
import InputForm from '@/components/Main/InputForm/index.vue'

const scrollToShowcase = () => {
  const el = document.getElementById('showcase')
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>
