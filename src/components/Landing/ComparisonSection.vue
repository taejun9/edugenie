<template>
  <section id="comparison" class="bg-[#F8FAFC] py-20 sm:py-28">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-12 text-center lg:mb-16">
        <div
          class="mb-6 inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-color-main"
        >
          COMPARISON
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
          Lesson Prep. Before vs After.
        </h2>
      </div>

      <!-- Feature Cards -->
      <div class="mx-auto grid gap-6 sm:grid-cols-2 lg:gap-8">
        <!-- Before Card -->
        <div
          class="flex flex-col rounded-3xl border border-gray-100 bg-white px-10 py-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
        >
          <p class="mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            Before Edugenie
          </p>
          <div class="flex-1 space-y-4">
            <div
              v-for="(item, index) in beforeItems"
              :key="index"
              class="flex items-start gap-3 sm:gap-4"
            >
              <div
                class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500"
              >
                <svg
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span class="text-[15px] font-medium leading-relaxed text-slate-600">
                {{ item }}
              </span>
            </div>
          </div>
        </div>

        <!-- After Card -->
        <div
          class="flex flex-col rounded-3xl bg-color-main px-10 py-8 shadow-[0_8px_30px_-4px_rgba(37,99,235,0.4)]"
        >
          <p class="mb-8 text-xs font-bold uppercase tracking-widest text-blue-200">
            After Edugenie
          </p>
          <div class="flex-1 space-y-4">
            <div
              v-for="(item, index) in afterItems"
              :key="index"
              class="flex items-start gap-3 sm:gap-4"
            >
              <div
                class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white"
              >
                <svg
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span class="text-[15px] font-bold leading-relaxed text-white">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom text -->
      <div class="mt-12 text-center sm:mt-16">
        <p class="text-[15px] font-bold text-slate-500 sm:text-base">
          Spend your time teaching. Not formatting.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const beforeItems = [
  '2-3 hours searching for right sources',
  'Exhausting manual formatting',
  'Writing quizzes and answer keys manually',
]

const afterItems = [
  '60 seconds from topic to pack',
  'Full article + map + quiz instantly',
  'Ready-to-print, polished PDF',
]
</script>
