<template>
  <div class="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
    <Header fixed transparent-effect>
      <template #navigation>
        <button
          v-for="tab in navTabs"
          :key="tab.id"
          @click="scrollToSection(tab.id)"
          class="text-sm font-medium text-gray-700 transition-colors duration-200 hover:scale-[1.02] hover:font-semibold hover:text-color-main"
        >
          {{ tab.label }}
        </button>
      </template>

      <template #actions>
        <button
          @click="$router.push('/app')"
          class="hidden h-[42px] rounded-full bg-color-main px-4 font-['Roboto',_arial,_sans-serif] text-sm font-semibold text-white shadow-md shadow-color-main/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-color-main/30 focus:outline-none sm:block lg:rounded-[20px] lg:px-3"
        >
          Generate Free ✨
        </button>
      </template>

      <template #mobile-menu="{ close }">
        <button
          v-for="tab in navTabs"
          :key="tab.id"
          @click="handleMobileNav(tab.id, close)"
          class="block w-full px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-color-main"
        >
          {{ tab.label }}
        </button>
        <button
          @click="handleMobileApp(close)"
          class="mt-2 w-full rounded-full bg-color-main px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Generate Free ✨
        </button>
      </template>
    </Header>

    <main class="select-none">
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <ComparisonSection />
      <ShowcaseSection />
      <ProcessSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </main>
  </div>
</template>

<script setup>
/**
 * @component Home
 * @description Landing page (Marketing page)
 * Uses the unified Header component with custom slots for navigation.
 */
import Header from '@/components/Layout/Header.vue'

import ComparisonSection from '@/components/Landing/ComparisonSection.vue'
import CtaSection from '@/components/Landing/CtaSection.vue'
import FeaturesSection from '@/components/Landing/FeaturesSection.vue'
import HeroSection from '@/components/Landing/HeroSection.vue'
import HowItWorksSection from '@/components/Landing/HowItWorksSection.vue'
import PricingSection from '@/components/Landing/PricingSection.vue'
import ProcessSection from '@/components/Landing/ProcessSection.vue'
import ShowcaseSection from '@/components/Landing/ShowcaseSection.vue'
import StatsSection from '@/components/Landing/StatsSection.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const navTabs = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'features', label: 'Features' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'pricing', label: 'Pricing' },
]

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

const handleMobileNav = (id, close) => {
  scrollToSection(id)
  close()
}

const handleMobileApp = (close) => {
  router.push('/app')
  close()
}
</script>
