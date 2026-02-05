<template>
  <div class="relative select-none" ref="dropdownRef">
    <!-- Profile Button (Google Login Button Style) -->
    <button
      @click="toggleDropdown"
      class="flex h-10 items-center gap-2 rounded-full border border-[#747775] bg-white px-1 pl-1 pr-3 transition-colors hover:bg-gray-50 focus:outline-none"
      :class="{ 'bg-gray-100': isOpen }"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <!-- Avatar -->
      <div v-if="user?.picture" class="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
        <img :src="user.picture" :alt="user.name" class="h-full w-full object-cover" />
      </div>
      <div
        v-else
        class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
        :style="{ backgroundColor: user?.profileColor || '#6366F1' }"
      >
        {{ userInitial }}
      </div>

      <!-- Name -->
      <span class="font-['Roboto',_arial,_sans-serif] text-sm font-medium text-[#1f1f1f]">
        {{ user.name }}
      </span>

      <!-- Chevron Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="border-b border-gray-100 px-4 py-2">
        <p class="truncate text-sm font-medium text-gray-900">{{ user.name }}</p>
        <p class="truncate text-xs text-gray-500">{{ user.email }}</p>
      </div>

      <button
        @click="handleLogout"
        class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mr-2 h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
        Sign out
      </button>
    </div>

    <!-- Backdrop for clicking outside -->
    <div v-if="isOpen" class="fixed inset-0 z-40 cursor-default" @click="isOpen = false"></div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, userInitial, logout } = useAuthStore()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  isOpen.value = false
  logout()
  router.push({ path: '/', query: {} })
}
</script>
