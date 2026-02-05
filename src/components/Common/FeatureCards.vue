<template>
  <div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
    <div
      v-for="(feature, index) in features"
      :key="`feature-${index}`"
      class="feature-card cursor-default rounded-2xl border border-gray-100 bg-white p-6 shadow-sm slide-in-from-top-4"
    >
      <div
        :class="[
          'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
          colorMap[feature.color],
        ]"
      >
        <component :is="feature.icon" />
      </div>
      <h3 class="mb-2 font-bold text-[#333]">
        {{ feature.title }}
      </h3>
      <p class="text-sm text-[#666]">
        {{ feature.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
}

const features = [
  {
    icon: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        [
          h('path', { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z' }),
          h('path', { d: 'M8 7h6' }),
          h('path', { d: 'M8 11h8' }),
        ],
      ),
    color: 'blue',
    title: 'Adaptive Reading Text',
    description:
      'Instantly rewrite any content to match the reading level of your students, making difficult topics accessible.',
  },
  {
    icon: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        [
          h('path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }),
          h('path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }),
        ],
      ),
    color: 'purple',
    title: 'Contextual Glossary',
    description:
      'Build vocabulary mastery with key terms, clear definitions, and real-world examples derived from the text.',
  },
  {
    icon: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        [
          h('path', { d: 'm9 11 3 3L22 4' }),
          h('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' }),
        ],
      ),
    color: 'green',
    title: 'Instant Quizzes & Tests',
    description:
      'Create diverse assessment types—from multiple choice to open-ended questions—in seconds to check understanding.',
  },
]
</script>
