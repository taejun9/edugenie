<template>
  <section id="features" class="bg-white py-20 sm:py-28">
    <div class="mx-auto w-full px-6 sm:px-8 lg:px-10">
      <!-- Section Header -->
      <div class="mx-auto mb-16 text-center lg:mb-20">
        <div
          class="mb-6 inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-color-main"
        >
          FEATURES
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
          Built for modern educators.
        </h2>
      </div>

      <!-- Feature Cards -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, i) in featuresData"
          :key="i"
          class="flex flex-col rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6"
        >
          <div class="mb-6 text-[#1E293B]">
            <component :is="feature.icon" class="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h3 class="mb-3 text-lg font-bold text-[#0F172A] sm:text-xl">{{ feature.title }}</h3>
          <p class="text-[15px] leading-relaxed text-[#64748B]">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const GradeIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M12 14l9-5-9-5-9 5 9 5z',
    }),
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    }),
  ])

const MapIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
    }),
  ])

const LanguageIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M4 6.66667H20M12 4V6.66667M13.3973 19.3333C11.3441 17.2078 9.70064 14.7218 8.54933 12',
    }),
  ])

const QuizIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    }),
  ])

const PdfIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    }),
  ])

const TimeIcon = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M13 10V3L4 14h7v7l9-11h-7z',
    }),
  ])

const featuresData = [
  {
    icon: GradeIcon,
    title: 'Grade-level adaptation',
    description:
      'Content is automatically rewritten to match student comprehension from K-12 to University.',
  },
  {
    icon: MapIcon,
    title: 'Knowledge mapping',
    description:
      'Visual relationship graphs explain complex conceptual links at a glance for better retention.',
  },
  {
    icon: LanguageIcon,
    title: '20+ Languages',
    description:
      'Perfectly translated content for global classrooms with educational nuance maintained.',
  },
  {
    icon: QuizIcon,
    title: 'AI-generated quizzes',
    description:
      'Instant assessments including multiple choice, short answer, and critical thinking prompts.',
  },
  {
    icon: PdfIcon,
    title: 'One-click PDF',
    description:
      'No formatting required. Export as a professional-looking print-ready document instantly.',
  },
  {
    icon: TimeIcon,
    title: '60-second generation',
    description:
      'High-speed processing ensures your lesson prep is finished faster than your morning coffee.',
  },
]
</script>
