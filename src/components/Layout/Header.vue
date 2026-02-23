<template>
  <nav :class="headerClasses">
    <div
      class="mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8"
      :class="fullWidth ? 'w-full' : 'max-w-7xl justify-between'"
    >
      <!-- Logo -->
      <div
        class="flex cursor-pointer items-center py-1 transition-opacity hover:scale-[1.02]"
        @click="goHome"
      >
        <img
          src="@/assets/images/logo.svg"
          alt="EduGenie Logo"
          class="hidden h-10 object-contain xs-480:block"
        />
        <img
          src="@/assets/images/edu_genie.svg"
          alt="EduGenie Logo"
          class="block h-10 object-contain xs-480:hidden"
        />
      </div>

      <!-- Center Navigation (Desktop) -->
      <div class="hidden flex-1 items-center justify-end gap-8 pr-8 md:flex">
        <slot name="navigation"></slot>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <!-- Info Slot (e.g. Credits) -->
        <slot name="info"></slot>

        <!-- User Profile / Login -->
        <div v-if="isAuthenticated" class="flex items-center gap-x-2">
          <UserProfile />
        </div>
        <div v-else>
          <GoogleLoginButton :isDarkMode="false" />
        </div>

        <!-- Mobile menu button -->
        <button
          v-if="hasMobileMenu"
          @click="mobileOpen = !mobileOpen"
          class="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              v-if="!mobileOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Actions Slot (e.g. Extra Buttons) -->
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="mobileOpen && hasMobileMenu"
        class="border-t border-gray-100 bg-white/95 px-4 pb-4 pt-2 shadow-lg backdrop-blur-lg md:hidden"
      >
        <slot name="mobile-menu" :close="closeMobileMenu"></slot>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import GoogleLoginButton from '@/components/Layout/GoogleLoginButton.vue'
import UserProfile from '@/components/Layout/UserProfile.vue'
import { useAuthStore } from '@/stores/auth.store.js'
import { computed, ref, useSlots } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
  transparentEffect: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const slots = useSlots()
const { isAuthenticated } = useAuthStore()

const mobileOpen = ref(false)

const hasMobileMenu = computed(() => !!slots['mobile-menu'])

const headerClasses = computed(() => {
  const base = 'top-0 z-50 w-full transition-all duration-300'
  const pos = props.fixed ? 'fixed' : 'sticky'

  if (props.transparentEffect) {
    return [base, pos, 'bg-white/90 shadow-sm backdrop-blur-lg']
  }

  return [base, pos, 'border-b border-[#F1F5F9] bg-white shadow-sm']
})

const goHome = () => {
  if (router.currentRoute.value.path === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const closeMobileMenu = () => {
  mobileOpen.value = false
}
</script>
