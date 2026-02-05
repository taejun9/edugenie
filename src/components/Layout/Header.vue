<template>
  <nav class="no-print sticky top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div
          class="flex cursor-pointer items-center space-x-2 py-1 transition-opacity hover:opacity-80"
          @click="goToHome"
        >
          <img src="@/assets/images/logo.svg" alt="EduGenie Logo" class="h-full object-contain" />
        </div>
        <div class="flex select-none items-center gap-x-2">
          <!-- Today's Credit: 비로그인 ●●○🔒🔒 / 로그인 ●●●○○ -->
          <span
            v-if="!tokenUsageLoading"
            class="flex h-10 items-center gap-1 rounded-full border bg-gray-100 px-2.5 text-xs font-semibold text-[#333]"
            :title="
              callRemaining <= 0
                ? 'Daily limit reached. Try again tomorrow or log in for more.'
                : isAuthenticated
                  ? 'Remaining / Total (today)'
                  : 'Guest: 3 uses. Log in for 5.'
            "
          >
            <span class="mr-1 shrink-0">Today's Credit:</span>
            <span
              v-if="isAuthenticated"
              class="inline-flex items-center gap-0.5"
              aria-hidden="true"
            >
              <template v-for="i in 5" :key="`bulb-${i}`">
                <Bulb class="h-5 w-5" :isTurnOff="i <= callCount" />
              </template>
            </span>
            <span v-else class="inline-flex items-center gap-0.5" aria-hidden="true">
              <template v-for="i in 3" :key="`bulb-${i}`">
                <Bulb class="h-5 w-5" :isTurnOff="i <= callCount" />
                <!-- <span>{{ i <= callCount ? '💡' : '○' }}</span> -->
              </template>
              <div class="group relative cursor-default" v-for="i in 2" :key="`lock-${i}`">
                <span class="right-0 pl-0.5 opacity-70">🔒</span>
                <div
                  class="absolute -bottom-6 -left-2/3 z-50 hidden rounded-xl border border-gray-300 bg-[#999] px-2 py-1 text-center text-sm font-semibold text-white group-hover:block"
                >
                  LOCK
                </div>
              </div>
            </span>
          </span>
          <span v-else class="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-400">...</span>
          <!-- Display different UI based on login status -->
          <div v-if="isAuthenticated" class="flex items-center gap-x-2">
            <UserProfile />
          </div>
          <!-- When not logged in -->
          <GoogleLoginButton v-else :isDarkMode="false" :disabled="tokenUsageLoading" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
/**
 * @component Header
 * @description Application header component
 * Provides functionality to navigate to home when logo is clicked.
 * Displays profile or login button based on authentication status.
 */
import { useAuthStore } from '@/stores/auth.store.js'
import { useUsageStore } from '@/stores/usage.store.js'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Bulb from '../Common/Bulb.vue'
import GoogleLoginButton from './GoogleLoginButton.vue'
import UserProfile from './UserProfile.vue'

const router = useRouter()
const { user, isAuthenticated, userInitial } = useAuthStore()
const { callCount, callRemaining, tokenUsageLoading, fetchTokenUsage } = useUsageStore()

onMounted(() => {
  fetchTokenUsage()
})
watch(isAuthenticated, () => {
  fetchTokenUsage()
})

const goToHome = () => {
  router.push({ path: '/', query: {} })
}
</script>
