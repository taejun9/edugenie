<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">Generated Contents</h2>
      <router-link
        to="/app"
        class="inline-flex items-center gap-2 rounded-full bg-color-main px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/25"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Lesson
      </router-link>
    </div>

    <div class="space-y-4">
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="h-8 w-8 animate-spin text-color-main" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <template v-else>
        <div
          v-for="item in contents"
          :key="item.id"
          class="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <h3 class="mb-1 truncate font-bold text-gray-900">{{ item.topic }}</h3>
              <div class="flex items-center gap-3 text-xs text-gray-400">
                <span>{{ formatDate(item.createdAt) }}</span>
                <span class="h-1 w-1 rounded-full bg-gray-300"></span>
                <span>{{ item.gradeLevel }}</span>
                <span class="h-1 w-1 rounded-full bg-gray-300"></span>
                <span
                  class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600"
                >
                  Saved
                </span>
              </div>
            </div>
            <div
              v-if="canManage"
              class="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <router-link
                :to="`/app/${item.contentId}`"
                class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-color-main"
              >
                Edit
              </router-link>
              <button
                @click="emit('request-delete', item.contentId)"
                class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="contents.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center"
        >
          <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p class="mb-2 font-bold text-gray-900">No contents yet</p>
          <p class="text-sm text-gray-500">Create your first lesson to see it here.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  contents: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  canManage: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['request-delete'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
</script>
