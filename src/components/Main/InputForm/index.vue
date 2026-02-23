<template>
  <!--
    @component InputForm
    @description Learning material generation input form component
    Collects learning topic and various settings from users to request customized educational material generation.
    
    Input fields:
    - Learning Topic (required): Text input
    - Target Grade: Dropdown selection
    - Passage Length: Dropdown selection (Short/Medium/Long)
    - Knowledge Map Complexity: Dropdown selection (Simple/Standard/Detailed)
    - Output Language: Dropdown selection (Korean/English etc.)
    
    @example
    <InputForm
      :is-loading="isGenerating"
      @generate="handleGenerate"
    />
  -->
  <form
    @submit.prevent="handleSubmit"
    class="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all"
  >
    <div class="grid grid-cols-1 gap-6 md:grid-cols-12">
      <!-- Learning Topic Input Field -->
      <FormField
        label="TYPE ANY TOPIC TO START MAGIC"
        :col-span="12"
        :label-style="'text-sm font-extrabold text-color-main'"
      >
        <div class="relative">
          <input
            type="text"
            v-model="inputTopic"
            @keydown.enter.prevent
            placeholder="e.g., Photosynthesis, Industrial Revolution, Principles of AI..."
            :disabled="isLoading"
            :maxlength="200"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/70"
            :class="isLoading ? 'cursor-not-allowed opacity-50' : ''"
            aria-label="Learning topic input"
          />
          <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
            <div
              class="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
            ></div>
          </div>
        </div>
      </FormField>

      <!-- Target Grade Selection Field -->
      <FormField label="GRADE" :col-span="3">
        <SelectField v-model="gradeLevel" :options="GRADE_LEVELS" :disabled="isLoading" />
      </FormField>

      <!-- Passage Length Selection Field -->
      <FormField label="PASSAGE LENGTH" :col-span="3">
        <SelectField
          v-model="passageLength"
          :options="PASSAGE_LENGTHS"
          option-value="id"
          option-label="label"
          :disabled="isLoading"
        />
      </FormField>

      <!-- Knowledge Map Complexity Selection Field -->
      <FormField label="MAP COMPLEXITY" :col-span="3">
        <SelectField
          v-model="mapComplexity"
          :options="MAP_COMPLEXITIES"
          option-value="id"
          option-label="label"
          :disabled="isLoading"
        />
      </FormField>

      <!-- Output Language Selection Field -->
      <FormField label="LANGUAGE" :col-span="3">
        <SelectField
          v-model="language"
          :options="LANGUAGES"
          option-value="code"
          option-label="name"
          :disabled="isLoading"
        />
      </FormField>

      <!-- Submit Button (한도 초과 시 클릭하면 모달) -->
      <div class="mt-2 flex justify-center md:col-span-12">
        <button
          type="submit"
          :disabled="isLoading || !inputTopic?.trim()"
          :class="[
            'w-full transform rounded-2xl px-6 py-4 text-lg font-extrabold tracking-tight text-white shadow-lg transition-all active:scale-95',
            isLoading || !inputTopic?.trim()
              ? 'cursor-not-allowed bg-gray-300 shadow-none'
              : 'bg-gradient-to-r from-color-main to-color-sub shadow-lg shadow-color-main/30 hover:from-blue-700 hover:to-violet-700',
          ]"
        >
          {{ isLoading ? 'Generating...' : 'Generate My Lesson  ✨' }}
        </button>
      </div>
    </div>
    <p class="mt-4 text-center text-sm font-bold text-[#94A3B8]">
      ⚡ READY IN UNDER 60 SECONDS • PDF INCLUDED
    </p>
    <!-- 한도 초과 모달: 비로그인 시 로그인 유도, 로그인 시 크레딧 소진 안내 -->
    <Modal
      :visible="showLimitModal"
      :title="limitModalTitle"
      :message="limitModalMessage"
      type="info"
      :buttons="[{ label: 'OK', action: 'confirm', variant: 'primary' }]"
      :closable="true"
      @close="showLimitModal = false"
      @action="handleLimitModalAction"
    />
  </form>
</template>

<script setup>
/**
 * @component InputForm
 * @description Learning material generation input form component
 *
 * This component collects all input values from users for learning material generation.
 * When input values are valid, it emits a 'generate' event to pass them to the parent component.
 *
 * State management:
 * - inputTopic: Learning topic (required input)
 * - gradeLevel: Target grade (default: Grade 6 Elementary)
 * - language: Output language (default: Korean)
 * - passageLength: Passage length (default: Medium)
 * - mapComplexity: Knowledge map complexity (default: Standard)
 */
import Modal from '@/components/Common/Modal.vue'
import { useGoogleLogin } from '@/helpers/useGoogleLogin.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useUsageStore } from '@/stores/usage.store.js'
import { GRADE_LEVELS, LANGUAGES, MAP_COMPLEXITIES, PASSAGE_LENGTHS } from '@/utils/constants.js'
import { computed, onMounted, ref } from 'vue'

// Sub-component imports
import FormField from './FormField.vue'
import SelectField from './SelectField.vue'

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.path === '/app' && route.query?.topic) {
    const query = route.query
    console.log(query, 'query')
    inputTopic.value = query.topic
    gradeLevel.value = query.gradeLevel
    language.value = query.language
    passageLength.value = query.passageLength
    mapComplexity.value = query.mapComplexity

    router.replace({
      path: route.path,
      query: {},
    })

    emit('generate', query)
  }
})

const props = defineProps({
  /**
   * Loading state display flag
   * When true, input fields and button are disabled.
   */
  isLoading: {
    type: Boolean,
    required: true,
  },
})

/**
 * Generation request event
 * Emitted when all input values are valid.
 * @event generate
 * @param {Object} params - Generation parameters object
 * @param {string} params.topic - Learning topic
 * @param {string} params.gradeLevel - Target grade
 * @param {string} params.language - Output language code
 * @param {string} params.passageLength - Passage length ID
 * @param {string} params.mapComplexity - Knowledge map complexity ID
 */
const emit = defineEmits(['generate'])

const { isAuthenticated } = useAuthStore()
const { callRemaining } = useUsageStore()
const { openGoogleLoginPopup } = useGoogleLogin()
const isOverLimit = () => callRemaining.value <= 0

const showLimitModal = ref(false)
const limitModalKind = ref('guest') // 'guest' | 'loggedIn'

const limitModalTitle = computed(() =>
  limitModalKind.value === 'guest' ? 'Daily limit reached' : 'Credits used',
)
const limitModalMessage = computed(() =>
  limitModalKind.value === 'guest'
    ? 'If you log in now, you can use it 2 more times today.'
    : 'You have used all available credits.',
)

const handleLimitModalAction = (action) => {
  if (action === 'confirm' && limitModalKind.value === 'guest') {
    openGoogleLoginPopup()
  }
}

// Form state management
/**
 * Learning topic input value
 * @type {import('vue').Ref<string>}
 */
const inputTopic = ref('')

/**
 * Selected grade level
 * Default: Grade 6 Elementary (GRADE_LEVELS[4])
 * @type {import('vue').Ref<string>}
 */
const gradeLevel = ref(GRADE_LEVELS[4])

/**
 * Selected output language code
 * Default: Korean (LANGUAGES[0].code)
 * @type {import('vue').Ref<string>}
 */
const language = ref(LANGUAGES[0].code)

/**
 * Selected passage length ID
 * Default: Medium (PASSAGE_LENGTHS[1].id)
 * @type {import('vue').Ref<string>}
 */
const passageLength = ref(PASSAGE_LENGTHS[1].id)

/**
 * Selected knowledge map complexity ID
 * Default: Standard (MAP_COMPLEXITIES[1].id)
 * @type {import('vue').Ref<string>}
 */
const mapComplexity = ref(MAP_COMPLEXITIES[1].id)

/**
 * Form submission handler
 * Validates that learning topic is entered, then passes all input values via generate event.
 * Does not emit event if learning topic is empty.
 */
const handleSubmit = () => {
  // Validate that learning topic is entered
  const trimmedTopic = inputTopic.value.trim()
  if (!trimmedTopic) {
    return
  }

  // Maximum length validation
  if (trimmedTopic.length > 200) {
    return
  }

  if (route.path !== '/app') {
    router.push({
      path: '/app',
      query: {
        topic: trimmedTopic,
        gradeLevel: gradeLevel.value,
        language: language.value,
        passageLength: passageLength.value,
        mapComplexity: mapComplexity.value,
      },
    })
    return
  }

  if (isOverLimit()) {
    limitModalKind.value = isAuthenticated.value ? 'loggedIn' : 'guest'
    showLimitModal.value = true
    return
  }

  emit('generate', {
    topic: trimmedTopic,
    gradeLevel: gradeLevel.value,
    language: language.value,
    passageLength: passageLength.value,
    mapComplexity: mapComplexity.value,
  })
}
</script>
