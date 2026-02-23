<template>
  <router-view />
  <Footer />
</template>

<script setup>
/**
 * @component App
 * @description 메인 애플리케이션 컴포넌트
 */
import Footer from '@/components/Layout/Footer.vue'
import { useAuthStore } from '@/stores/auth.store.js'
import { onMounted } from 'vue'

const { fetchFingerprint } = useAuthStore()

onMounted(() => {
  fetchFingerprint()
})
</script>
