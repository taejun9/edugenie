<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <h3 class="mb-4 text-lg font-bold text-gray-900">Delete Content</h3>
      <p class="mb-6 text-sm text-gray-600">
        Are you sure you want to delete this content? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="emit('cancel')"
          class="mb-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          :disabled="isDeleting"
        >
          Cancel
        </button>
        <button
          @click="emit('confirm')"
          class="mb-0 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          :disabled="isDeleting"
        >
          <svg
            v-if="isDeleting"
            class="h-4 w-4 animate-spin text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
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
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'confirm'])
</script>
