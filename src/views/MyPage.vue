<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-8 md:flex-row">
        <!-- Sidebar Navigation -->
        <aside class="w-full shrink-0 md:w-64">
          <nav class="space-y-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <router-link
              to="/mypage"
              class="group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="
                $route.name === 'MyContent'
                  ? 'bg-blue-50 text-color-main'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              My Content
            </router-link>
            <router-link
              to="/mypage/payment-history"
              class="group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="
                $route.name === 'PaymentHistory'
                  ? 'bg-blue-50 text-color-main'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              Payment History
            </router-link>
            <router-link
              to="/mypage/delete-account"
              class="group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="
                $route.name === 'DeleteAccount'
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              "
            >
              Delete Account
            </router-link>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Layout/Header.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
