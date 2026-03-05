<template>
  <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="bg-gradient-to-r from-color-main to-color-sub px-16 py-10">
      <div class="flex items-center gap-5">
        <div
          v-if="user?.picture"
          class="h-16 w-16 overflow-hidden rounded-full border border-gray-200"
        >
          <img :src="user.picture" :alt="user.name" class="h-full w-full object-cover" />
        </div>
        <div
          v-else
          class="flex h-16 w-16 items-center justify-center rounded-full text-sm font-semibold text-white"
          :style="{ backgroundColor: user?.profileColor || '#6366F1' }"
        >
          {{ userInitial }}
        </div>
        <div>
          <h1 class="text-2xl font-extrabold text-white">
            {{ user?.name || 'Guest User' }}
          </h1>
          <p class="text-sm text-blue-100">{{ user?.email || 'Not logged in' }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
      <div class="px-6 py-4 text-center">
        <p class="text-2xl font-extrabold text-gray-900">{{ callCount }}</p>
        <p class="text-xs text-gray-500">Used Today</p>
      </div>
      <div class="px-6 py-4 text-center">
        <p class="text-2xl font-extrabold text-gray-900">{{ callLimit }}</p>
        <p class="text-xs text-gray-500">Daily Limit</p>
      </div>
      <div class="px-6 py-4 text-center">
        <p class="text-2xl font-extrabold text-color-main">{{ callRemaining }}</p>
        <p class="text-xs text-gray-500">Remaining</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: null,
  },
  userInitial: {
    type: String,
    default: '',
  },
  callCount: {
    type: Number,
    default: 0,
  },
  callLimit: {
    type: Number,
    default: 0,
  },
  callRemaining: {
    type: Number,
    default: 0,
  },
})
</script>
