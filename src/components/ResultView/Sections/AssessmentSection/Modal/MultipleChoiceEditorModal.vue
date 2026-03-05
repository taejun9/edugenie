<template>
  <div v-if="show" class="no-print fixed inset-0 z-40 flex items-center justify-center bg-black/40">
    <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
      <h3 class="mb-4 text-base font-bold text-gray-900">
        {{ editingIndex != null ? t(language, 'edit') : t(language, 'addQuestion') }}
      </h3>
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500">
            {{ t(language, 'question') }}
          </label>
          <textarea
            v-model="form.question"
            rows="2"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500">
            {{ t(language, 'options') }} (2-6)
          </label>
          <div class="space-y-2">
            <div v-for="(opt, idx) in form.options" :key="idx" class="flex items-center gap-2">
              <input
                v-model="form.options[idx]"
                type="text"
                class="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="radio"
                :value="idx"
                v-model="form.correctIndex"
                class="h-4 w-4 text-indigo-600"
                :aria-label="t(language, 'answer')"
              />
              <button
                type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-red-500 ring-1 ring-red-200 hover:bg-red-50"
                @click="emit('remove-option', idx)"
                :disabled="form.options.length <= 2"
              >
                -
              </button>
            </div>
            <button
              type="button"
              class="mt-1 inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100"
              @click="emit('add-option')"
              :disabled="form.options.length >= 6"
            >
              + {{ t(language, 'addOption') }}
            </button>
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-500">
            {{ t(language, 'explanation') }}
          </label>
          <textarea
            v-model="form.explanation"
            rows="2"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-500 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          @click="emit('close')"
        >
          {{ t(language, 'cancel') }}
        </button>
        <button
          type="button"
          class="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          @click="emit('save')"
        >
          {{ t(language, 'save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@/components/Common/i18n.js'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: 'Korean',
  },
  editingIndex: {
    type: Number,
    default: null,
  },
  form: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'save', 'add-option', 'remove-option'])
</script>
