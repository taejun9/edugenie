<template>
  <section class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-4xl px-4 text-center">
      <h2 class="mb-6 text-5xl font-black tracking-tight text-[#0F172A] sm:text-6xl md:text-7xl">
        Ready to get
        <br class="hidden sm:block" />
        your time back?
      </h2>

      <p class="mb-12 text-lg font-medium text-[#64748B] sm:text-xl">
        Create your first lesson in 60 seconds — free.
      </p>

      <div class="flex flex-col items-center justify-center">
        <button
          @click="$router.push('/app')"
          class="group relative mb-8 overflow-hidden rounded-full bg-[#3B5998] bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] px-10 py-5 text-xl font-bold text-white shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_50px_-10px_rgba(79,70,229,0.9)]"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            Generate My First Lesson Now
            <span class="text-2xl leading-none">✨</span>
          </span>
        </button>

        <p class="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">
          NO CREDIT CARD REQUIRED • JOIN 1,200+ EDUCATORS
        </p>
      </div>
    </div>
  </section>
</template>

<script setup></script>
