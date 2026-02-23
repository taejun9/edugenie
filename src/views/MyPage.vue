<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div class="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="bg-gradient-to-r from-color-main to-color-sub px-8 py-10">
          <div class="flex items-center gap-5">
            <!-- Avatar -->
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm"
            >
              {{ userInitial || '?' }}
            </div>
            <div>
              <h1 class="text-2xl font-extrabold text-white">
                {{ user?.name || 'Guest User' }}
              </h1>
              <p class="text-sm text-blue-100">{{ user?.email || 'Not logged in' }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
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

      <!-- Menu Cards -->
      <div class="grid gap-4 sm:grid-cols-2">
        <router-link
          to="/mypage/contents"
          class="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Generated Contents</h3>
            <p class="text-sm text-gray-500">View, edit, and manage your lessons</p>
          </div>
          <svg
            class="ml-auto h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link
          to="/app"
          class="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Create New Lesson</h3>
            <p class="text-sm text-gray-500">Generate educational materials</p>
          </div>
          <svg
            class="ml-auto h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Layout/Header.vue'
import { useAuthStore } from '@/stores/auth.store.js'
import { useUsageStore } from '@/stores/usage.store.js'

const { user, userInitial } = useAuthStore()
const { callCount, callLimit, callRemaining } = useUsageStore()
</script>
