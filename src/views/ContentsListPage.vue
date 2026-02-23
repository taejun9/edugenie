<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <router-link to="/mypage" class="hover:text-color-main">My Page</router-link>
        <span>/</span>
        <span class="text-gray-900">Generated Contents</span>
      </nav>

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-extrabold text-gray-900">Generated Contents</h1>
        <router-link
          to="/app"
          class="inline-flex items-center gap-2 rounded-full bg-color-main px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Lesson
        </router-link>
      </div>

      <!-- Content List (Skeleton/Placeholder) -->
      <div class="space-y-4">
        <div
          v-for="item in sampleItems"
          :key="item.id"
          class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="flex items-center justify-between px-6 py-5">
            <div class="min-w-0 flex-1">
              <h3 class="mb-1 truncate text-base font-bold text-gray-900">{{ item.title }}</h3>
              <div class="flex items-center gap-3 text-xs text-gray-400">
                <span>{{ item.date }}</span>
                <span class="h-1 w-1 rounded-full bg-gray-300"></span>
                <span>{{ item.grade }}</span>
                <span class="h-1 w-1 rounded-full bg-gray-300"></span>
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="
                    item.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  "
                >
                  {{ item.status === 'completed' ? 'Completed' : 'Draft' }}
                </span>
              </div>
            </div>

            <!-- Action buttons -->
            <div
              class="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <button
                class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-color-main"
              >
                Edit
              </button>
              <button
                class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state (if no items) -->
      <div
        v-if="sampleItems.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center"
      >
        <svg
          class="mb-4 h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <p class="mb-2 font-bold text-gray-900">No contents yet</p>
        <p class="text-sm text-gray-500">Create your first lesson to see it here.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Layout/Header.vue'

// Placeholder 데이터 (실제 백엔드 연동 전 샘플)
const sampleItems = [
  {
    id: 1,
    title: 'The Solar System — Grade 5 Science',
    date: '2026-02-12',
    grade: 'Grade 5',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Introduction to Fractions — Grade 3 Math',
    date: '2026-02-11',
    grade: 'Grade 3',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Climate Change and Environment — Grade 8',
    date: '2026-02-10',
    grade: 'Grade 8',
    status: 'draft',
  },
]
</script>
