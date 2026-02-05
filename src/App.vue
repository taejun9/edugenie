<template>
  <router-view />
</template>

<script setup>
/**
 * @component App
 * @description 메인 애플리케이션 컴포넌트
 */
import { useAuthStore } from '@/stores/auth.store.js'
import { onMounted } from 'vue'

const { fetchFingerprint } = useAuthStore()

onMounted(() => {
  fetchFingerprint()
})
</script>
