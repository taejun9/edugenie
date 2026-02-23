<template>
  <footer class="bg-gray-900 py-12 text-white">
    <div class="mx-auto max-w-7xl px-4">
      <div class="grid gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="md:col-span-1">
          <img
            src="@/assets/images/logo.svg"
            alt="EduGenie Logo"
            class="mb-4 h-8 brightness-0 invert"
          />
          <p class="text-sm leading-relaxed text-gray-400">
            AI-powered lesson generation for modern educators. Save time, teach better.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Product</h4>
          <ul class="!ml-0 space-y-2">
            <li>
              <button
                @click="scrollTo('features')"
                class="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Features
              </button>
            </li>
            <li>
              <button
                @click="scrollTo('pricing')"
                class="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Pricing
              </button>
            </li>
            <li>
              <button
                @click="scrollTo('demo')"
                class="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Demo
              </button>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
            Resources
          </h4>
          <ul class="!ml-0 space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-400 transition-colors hover:text-white">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-400 transition-colors hover:text-white">Blog</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-400 transition-colors hover:text-white">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Legal</h4>
          <ul class="!ml-0 space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-400 transition-colors hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-400 transition-colors hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-gray-800 pt-8 text-center">
        <p class="text-sm text-gray-500">&copy; {{ year }} EduGenie. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>
