<template>
  <div v-if="show" class="no-print fixed inset-0 z-40 flex items-center justify-center bg-black/40">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <h3 class="mb-4 text-base font-bold text-gray-900">
        {{ t(language, 'changeImage') }}
      </h3>
      <div class="mb-4 flex rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          :class="[
            'flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-all',
            imageEditorTab === 'url'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="imageEditorTab = 'url'"
        >
          {{ t(language, 'imageUrl') }}
        </button>
        <button
          type="button"
          :class="[
            'flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-all',
            imageEditorTab === 'upload'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="imageEditorTab = 'upload'"
        >
          {{ t(language, 'uploadImage') }}
        </button>
      </div>

      <div v-if="imageEditorTab === 'url'">
        <label class="mb-2 block text-xs font-semibold text-gray-500">Image URL</label>
        <input
          v-model="editableImageUrl"
          type="text"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div v-else>
        <div
          class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors"
          :class="{ 'border-indigo-400 bg-indigo-50': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="handleFileDrop"
        >
          <div v-if="uploadPreview" class="mb-3 w-full">
            <img
              :src="uploadPreview"
              class="mx-auto max-h-40 rounded-lg object-contain"
              alt="Preview"
            />
          </div>
          <template v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#9ca3af"
              class="mb-2"
            >
              <path
                d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
              />
            </svg>
            <p class="mb-1 text-sm font-semibold text-gray-600">
              {{ t(language, 'orDragDrop') }}
            </p>
          </template>
          <button
            type="button"
            class="mt-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-200"
            @click="fileInputRef?.click()"
          >
            {{ t(language, 'selectFile') }}
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
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
          @click="onSave"
        >
          {{ t(language, 'save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@/components/Common/i18n.js'
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: 'Korean',
  },
  initialImageUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'save'])

const fileInputRef = ref(null)
const imageEditorTab = ref('url')
const editableImageUrl = ref('')
const uploadPreview = ref(null)
const isDragOver = ref(false)
const uploadedDataUrl = ref(null)

watch(
  () => props.show,
  (show) => {
    if (!show) return
    imageEditorTab.value = 'url'
    editableImageUrl.value = props.initialImageUrl || ''
    uploadPreview.value = null
    uploadedDataUrl.value = null
    isDragOver.value = false
  },
  { immediate: true },
)

const processFile = (file) => {
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadPreview.value = e.target.result
    uploadedDataUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) processFile(file)
}

const handleFileDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) processFile(file)
}

const onSave = () => {
  if (imageEditorTab.value === 'upload' && uploadedDataUrl.value) {
    emit('save', uploadedDataUrl.value)
    return
  }
  emit('save', editableImageUrl.value.trim() || null)
}
</script>
