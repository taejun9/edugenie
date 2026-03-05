<template>
  <section class="bg-[#F8FAFC] py-20 sm:py-28">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-20 text-center lg:mb-24">
        <div
          class="mb-6 inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-color-main"
        >
          PROCESS
        </div>
        <h2 class="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
          Three steps to classroom magic.
        </h2>
      </div>

      <!-- Process Cards -->
      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-y-0">
        <div
          v-for="(step, i) in processSteps"
          :key="i"
          class="group relative flex cursor-default flex-col items-center rounded-3xl border-2 border-blue-400 bg-white px-6 pb-6 pt-8 text-center shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-500"
        >
          <!-- Step Number Badge -->
          <div
            class="absolute -top-7 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-color-main text-xl font-bold text-white shadow-lg group-hover:bg-blue-600"
          >
            {{ i + 1 }}
          </div>

          <h3 class="mb-4 text-xl font-bold text-gray-900 group-hover:text-black">
            {{ step.title }}
          </h3>
          <p class="leading-relaxed text-[#64748B] group-hover:text-[#333]">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const processSteps = [
  {
    title: 'Enter Topics',
    description: 'Just type any keywords from your curriculum. Any topic, any level.',
  },
  {
    title: 'AI Curation',
    description: 'EduGenie scans Wikipedia, extracts facts, and maps relationships.',
  },
  {
    title: 'Instant PDF',
    description: 'Download your classroom-ready, polished PDF learning package.',
  },
]
</script>
