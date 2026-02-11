<template>
  <nav class="no-print sticky top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div
          class="flex cursor-pointer items-center space-x-2 py-1 transition-opacity hover:opacity-80"
          @click="goToHome"
        >
          <img
            src="@/assets/images/logo.svg"
            alt="EduGenie Logo"
            class="hidden h-full object-contain xs-480:block"
          />
          <img
            src="@/assets/images/edu_genie.svg"
            alt="EduGenie Logo"
            class="block h-full object-contain xs-480:hidden"
          />
        </div>
        <div class="relative flex select-none items-center gap-x-2">
          <!-- Today's Credit: 비로그인 ●●○🔒🔒 / 로그인 ●●●○○ -->
          <span
            v-if="!tokenUsageLoading"
            class="flex h-10 items-center gap-1 rounded-full border bg-gray-100 px-2.5"
            :title="creditTitle"
            @click="showTooltip = !showTooltip"
          >
            <div class="group flex items-baseline gap-1">
              <span
                class="text-sm font-black"
                :class="callRemaining > 0 ? 'text-[#333]' : 'text-rose-500'"
              >
                {{ callCount }} / {{ callLimit }}
              </span>
              <span
                class="text-[9px] font-bold uppercase text-gray-400 transition-colors group-hover:text-indigo-500"
              >
                Credits
              </span>
              <span
                v-if="!isAuthenticated"
                class="ml-1 animate-pulse text-[10px] font-medium text-indigo-400"
              >
                (+2 🔓)
              </span>
            </div>
          </span>
          <span v-else class="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-400">...</span>
          <!-- Display different UI based on login status -->
          <div v-if="isAuthenticated" class="flex items-center gap-x-2">
            <UserProfile />
          </div>
          <!-- When not logged in -->
          <div v-else class="relative overflow-hidden rounded-full p-0.5">
            <GoogleLoginButton :isDarkMode="false" :disabled="tokenUsageLoading" />
            <div
              v-if="callRemaining <= 0"
              class="absolute inset-[-1000%] -z-10 animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,#6366f1_0%,#a855f7_25%,transparent_50%)]"
            ></div>
          </div>
          <div
            v-if="showTooltip"
            @click="showTooltip = false"
            class="absolute top-[3.5rem] z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-gray-800 p-2 text-[11px] text-white shadow-xl"
            :class="isAuthenticated ? 'left-[45px]' : 'left-[65px]'"
          >
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"
            ></div>
            {{ creditTitle }}
          </div>
          <div
            v-if="showTooltip"
            class="fixed inset-0 z-40 cursor-default"
            @click="showTooltip = false"
          ></div>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import GoogleLoginButton from './GoogleLoginButton.vue'
import UserProfile from './UserProfile.vue'

const router = useRouter()
const { isAuthenticated } = useAuthStore()
const { callCount, callRemaining, tokenUsageLoading, callLimit, fetchTokenUsage } = useUsageStore()

onMounted(() => {
  fetchTokenUsage()
})
watch(isAuthenticated, () => {
  fetchTokenUsage()
})

const showTooltip = ref(false)

const creditTitle = computed(() => {
  // 1. 횟수를 다 썼을 때
  if (callRemaining.value <= 0) {
    return isAuthenticated.value
      ? "You've used all credits for today. See you tomorrow!"
      : 'Daily limit reached. Log in now to get 2 more credits instantly!'
  }

  // 2. 로그인 상태일 때
  if (isAuthenticated.value) {
    return `Remaining: ${callRemaining.value} / Total: 5 credits today`
  }

  // 3. 비로그인(게스트) 상태일 때
  return `Guest: ${callRemaining.value} credits left. Log in to unlock 5 daily credits!`
})

const goToHome = () => {
  router.push({ path: '/', query: {} })
}
</script>
