<template>
  <div
    class="mb-8 flex items-start space-x-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 animate-in fade-in slide-in-from-top-2"
    role="alert"
    aria-live="assertive"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="mt-0.5 h-6 w-6 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <div class="min-w-0 flex-1">
      <p class="mb-1 font-bold">Material generation failed.</p>
      <p class="break-words text-sm opacity-90">{{ error }}</p>
      <button
        @click="$emit('close')"
        class="mt-3 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="closed error alert"
      >
        CLOSE
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    required: true,
  },
})

defineEmits(['close'])
</script>
