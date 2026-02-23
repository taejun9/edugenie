<template>
  <section
    class="relative cursor-default overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-24"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_70%)]"
    ></div>
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4">
      <p
        class="text-center font-sans text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        Teachers are not machines.
        <br />
        <span class="text-[#60A5FA]">So why prepare lessons like one?</span>
      </p>
      <p class="mb-8 text-lg text-[#94A3B8]">
        Lesson prep shouldn’t steal your energy. Teaching should.
      </p>
      <div class="mx-auto flex items-center justify-center gap-16">
        <div
          v-for="stat in stats"
          :key="`stat-${stat.title}`"
          class="group space-y-4 text-start tracking-tight transition-transform duration-300 hover:scale-105"
        >
          <div
            class="text-3xl font-extrabold text-[#3B82F6] group-hover:text-[#1960F4] sm:text-4xl"
          >
            {{ stat.title }}
          </div>
          <div class="text-md font-extrabold text-[#F1F5F9] group-hover:text-white sm:text-lg">
            {{ stat.summary }}
          </div>
          <div
            class="mt-1 whitespace-pre text-sm text-[#94A3B8] transition-colors duration-300 group-hover:text-blue-300"
          >
            {{ stat.description }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const stats = [
  {
    title: '12h+ / week',
    summary: 'Lost to formatting',
    description: `Average hours lost every single week to\ncontent curation and worksheet design.`,
  },
  {
    title: '60%',
    summary: 'Level Mismatch',
    description: 'Materials that don’t match students real\nreading levels, causing disengagement.',
  },
  {
    title: 'Endless',
    summary: 'Creative Burnout',
    description: 'Designing new quizzes and visuals from\nscratch for every lesson is exhausting.',
  },
]
</script>
