<template>
  <section
    :class="[
      isActive ? 'block' : 'hidden print:!block',
      'print-keep-together duration-500 animate-in fade-in slide-in-from-bottom-4',
    ]"
    :id="'tabpanel-vocab'"
    role="tabpanel"
    :aria-labelledby="'tab-vocab'"
  >
    <div class="mb-8 flex items-center justify-between print:mb-4">
      <h2
        class="border-l-8 border-indigo-600 pl-4 text-2xl font-black uppercase tracking-tight text-gray-800"
      >
        {{ t(language, 'keyVocabulary') }}
      </h2>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 print:gap-3">
      <div
        v-for="(v, i) in vocabulary"
        :key="i"
        class="group relative rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 print:p-3"
      >
        <!-- hover 액션 아이콘 -->
        <div
          v-if="canEdit"
          class="no-print pointer-events-none absolute right-4 top-4 hidden gap-1 group-hover:pointer-events-auto group-hover:flex"
        >
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#999] ring-1 ring-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-300"
            @click.stop="openEditPopup(i, v)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-red-500 ring-1 ring-red-200 hover:bg-red-50"
            @click.stop="onDelete(i)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#EA3323"
            >
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </button>
        </div>
        <h3 class="mb-2 text-xl font-black text-indigo-600 print:mb-1">
          {{ v.word }}
        </h3>
        <p class="mb-3 font-bold text-gray-700 print:mb-1">● {{ v.definition }}</p>
        <p
          class="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm italic text-gray-500 print:p-2"
        >
          " {{ v.example }} "
        </p>
      </div>
    </div>
    <!-- 모바일/하단용 ADD 버튼 -->
    <button
      v-if="canEdit"
      type="button"
      class="no-print mt-6 w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
      @click="openAddPopup"
    >
      + ADD
    </button>

    <VocabularyEditorModal
      v-if="canEdit"
      :show="showPopup"
      :language="language"
      :editing-index="editingIndex"
      :form="form"
      @close="closePopup"
      @save="saveVocabulary"
    />
  </section>
</template>

<script setup>
import { t } from '@/components/Common/i18n.js'
import { ref } from 'vue'
import VocabularyEditorModal from './VocabularyEditorModal.vue'

const props = defineProps({
  vocabulary: {
    type: Array,
    required: true,
  },
  language: {
    type: String,
    default: 'Korean',
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add-vocabulary', 'update-vocabulary', 'delete-vocabulary'])

const showPopup = ref(false)
const editingIndex = ref(null)
const form = ref({
  word: '',
  definition: '',
  example: '',
})

const openAddPopup = () => {
  if (!props.canEdit) return
  editingIndex.value = null
  form.value = {
    word: '',
    definition: '',
    example: '',
  }
  showPopup.value = true
}

const openEditPopup = (index, vocab) => {
  if (!props.canEdit) return
  editingIndex.value = index
  form.value = {
    word: vocab.word || '',
    definition: vocab.definition || '',
    example: vocab.example || '',
  }
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const saveVocabulary = () => {
  if (!props.canEdit) return
  const payload = {
    word: form.value.word.trim(),
    definition: form.value.definition.trim(),
    example: form.value.example.trim(),
  }

  if (!payload.word || !payload.definition || !payload.example) {
    return
  }

  if (editingIndex.value === null) {
    emit('add-vocabulary', payload)
  } else {
    emit('update-vocabulary', { index: editingIndex.value, value: payload })
  }

  showPopup.value = false
}

const onDelete = (index) => {
  if (!props.canEdit) return
  emit('delete-vocabulary', index)
}
</script>
