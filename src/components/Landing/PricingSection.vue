<template>
  <section id="pricing" class="bg-[#0B1120] py-20 sm:py-28">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-16 text-center lg:mb-24">
        <div
          class="mb-6 inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-white"
        >
          PRICING
        </div>
        <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Simple pricing. Infinite time saved.
        </h2>
      </div>

      <!-- Pricing Cards -->
      <div
        class="mx-auto grid h-max items-center gap-6 md:grid-cols-3 lg:gap-8"
        @mouseleave="hoveredIndex = 1"
      >
        <div
          v-for="(plan, i) in plans"
          :key="i"
          @mouseenter="hoveredIndex = i"
          class="relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 sm:p-10"
          :class="
            hoveredIndex === i
              ? 'z-10 scale-[1.02] bg-white shadow-2xl ring-2 ring-color-main'
              : 'z-0 bg-[#1E293B]/60 text-white shadow-none'
          "
        >
          <!-- Active Card Top Decorative Tab -->
          <div
            class="absolute left-1/2 top-0 h-3 w-32 -translate-x-1/2 rounded-b-xl bg-[#4F46E5] transition-opacity duration-300"
            :class="hoveredIndex === i ? 'opacity-100' : 'opacity-0'"
          ></div>

          <!-- Plan Info -->
          <p
            class="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors duration-300"
          >
            {{ plan.name }}
          </p>

          <div
            class="mb-8 font-extrabold tracking-tight transition-colors duration-300"
            :class="hoveredIndex === i ? 'text-[#0F172A]' : 'text-white'"
          >
            <span v-if="plan.priceName" class="text-3xl sm:text-4xl">{{ plan.priceName }}</span>
            <span v-else>
              <span class="text-3xl sm:text-4xl">{{ plan.price }}</span>
              <span
                v-if="plan.period"
                class="text-lg font-semibold"
                :class="hoveredIndex === i ? 'text-slate-400' : 'text-slate-500'"
              >
                {{ plan.period }}
              </span>
            </span>
          </div>

          <!-- Features -->
          <div class="mb-12 flex-1 space-y-5">
            <div
              v-for="(feat, j) in plan.features"
              :key="j"
              class="flex items-center gap-2 text-base font-medium transition-colors duration-300"
              :class="hoveredIndex === i ? 'text-slate-600' : 'text-slate-300'"
            >
              <div
                class="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                :class="hoveredIndex === i ? 'bg-slate-400' : 'bg-slate-500'"
              ></div>
              {{ feat }}
            </div>
          </div>

          <!-- CTA Button -->
          <button
            @click="handlePlanClick(plan)"
            class="w-full rounded-2xl py-4 text-lg transition-all duration-300"
            :class="
              hoveredIndex === i
                ? 'bg-[#4F46E5] font-extrabold text-white shadow-[0_8px_30px_-4px_rgba(79,70,229,0.4)] hover:bg-[#4338CA]'
                : 'bg-white/5 font-bold text-slate-300 hover:bg-white/10'
            "
          >
            {{ plan.cta }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isAuthenticated } = useAuthStore()

const hoveredIndex = ref(1) // Center highlighted by default

const plans = [
  {
    name: 'STARTER',
    priceName: 'Free',
    price: null,
    period: null,
    cta: 'Start Free',
    features: ['5 PDFs per month', 'Standard Maps', 'All Languages'],
  },
  {
    name: 'PRO TEACHER',
    priceName: null,
    price: '$12',
    period: '/mo',
    cta: 'Go Pro ✨',
    features: [
      'Unlimited Generations',
      'Advanced AI Mapping',
      'Priority Processing',
      'Personal Branding',
    ],
  },
  {
    name: 'SCHOOL',
    priceName: 'Institutional',
    price: null,
    period: null,
    cta: 'Talk to Sales',
    features: ['Admin Dashboards', 'LMS Integration', 'Custom Teacher Seats'],
  },
]

const handlePlanClick = (plan) => {
  if (plan.name === 'STARTER') {
    router.push('/app')
  } else if (plan.name === 'SCHOOL') {
    return
  } else {
    // Pro plan
    if (!isAuthenticated.value) {
      router.push('/login')
    } else {
      router.push('/pricing/checkout')
    }
  }
}
</script>
