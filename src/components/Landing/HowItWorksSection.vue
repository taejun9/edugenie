<template>
  <section id="how-it-works" class="bg-white py-20 sm:py-28">
    <div class="mx-auto max-w-6xl px-4">
      <!-- Section Header -->
      <div class="mx-auto mb-16 text-center">
        <div
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-tight text-color-main"
        >
          HOW IT WORKS
        </div>
        <p
          class="mb-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-6xl"
        >
          Not worksheets. Not templates.
          <br />
          A full lesson — ready to teach.
        </p>
        <p class="text-[#64748B]">Everything you need. Generated instantly.</p>
      </div>

      <!-- Steps -->
      <div class="flex w-full flex-col items-center justify-between py-12">
        <div
          v-for="(step, i) in steps"
          :key="`how-it-work-${i}`"
          class="relative w-full text-center"
        >
          <!-- Step number -->
          <div class="flex h-max w-full items-center justify-center">
            <!-- Image placeholder(짝수) -->
            <div v-if="i % 2 !== 0" class="h-full w-1/2 p-6">
              <img
                src="https://picsum.photos/600/320"
                class="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm contain-content"
              />
            </div>

            <div
              class="h-full w-1/2 border-[#DBEAFE] p-6"
              :class="i % 2 === 0 ? 'border-r' : 'border-l'"
            >
              <div class="flex w-full flex-col items-start gap-y-6">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl border text-xl font-extrabold"
                  :class="step.numBg"
                >
                  0{{ i + 1 }}
                </div>

                <p class="text-4xl font-extrabold text-[#0F172A]">{{ step.title }}</p>
                <p class="text-left text-xl text-[#64748B]">
                  {{ step.description }}
                </p>
                <!-- TAGS -->
                <div v-if="step.tags.length > 0" class="item-center flex gap-x-2">
                  <p
                    class="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-2 text-xs font-bold text-[#64748B]"
                    v-for="tag in step.tags"
                    :key="`${i}-${tag}`"
                  >
                    {{ tag }}
                  </p>
                </div>
                <!-- ORDERED LIST -->
                <div v-if="step.orderedList.length > 0" class="w-full space-y-2">
                  <div
                    v-for="order in step.orderedList"
                    :key="`${i}-${order}`"
                    class="flex w-full items-center justify-start gap-x-2"
                  >
                    <div class="h-4 w-4 rounded-full" :class="step.orderBg"></div>
                    <p class="font-bold text-[#334155]">{{ order }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image placeholder(홀수) -->
            <div v-if="i % 2 === 0" class="h-full w-1/2 p-6">
              <img
                src="https://picsum.photos/600/320"
                class="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm contain-content"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: 'AI Reading Articles',
    description: `Verified Wikipedia facts rewritten to match your student's Lexile range instantly. No more AI hallucinations—just grounded facts.`,
    placeholder: 'Input screenshot placeholder',
    numBg: ['bg-[#EFF6FF]', 'border-[#DBEAFE]', 'text-[#2563EB]'],
    tags: ['Fact Checked', 'Grade-adapted'],
    orderedList: [],
    orderBg: [],
  },
  {
    title: 'Knowledge Maps',
    description:
      'Visualize concept relationships instantly. Our maps help students understand the logical flow between complex ideas at a glance.',
    placeholder: 'Generation process placeholder',
    numBg: ['bg-[#FAF5FF]', 'border-[#F3E8FF]', 'text-[#7f22fe]'],
    tags: [],
    orderedList: ['Visualized Logic', 'Faster Comprehension'],
    orderBg: ['bg-[#A855F7]'],
  },
  {
    title: 'Smart Assessments',
    description:
      'Automatically generate quizzes, critical thinking prompts, and glossaries. Complete with an answer key for effortless grading.',
    placeholder: 'Result output placeholder',
    numBg: ['bg-[#ECFDF5]', 'border-[#D1FAE5]', 'text-[#059669]'],
    tags: ['Auto-Quiz', 'Integrated Keys'],
    orderedList: [],
    orderBg: [],
  },
]
</script>
