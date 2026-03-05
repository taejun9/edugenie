<template>
  <div class="flex min-h-screen select-none flex-col items-center justify-center bg-slate-900 p-4">
    <div class="flex h-full w-full flex-col items-center gap-8">
      <img
        src="@/assets/images/error.jpg"
        alt="Error Image"
        class="h-full rounded-3xl object-contain shadow-2xl shadow-white/20"
      />

      <router-link
        to="/"
        class="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-[#d9d9d9] shadow-lg shadow-indigo-500/40 transition-colors hover:bg-indigo-600 md:text-base"
      >
        Go to Home
      </router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
