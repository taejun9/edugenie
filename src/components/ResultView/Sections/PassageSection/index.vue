<template>
  <section
    :class="[
      isActive ? 'block' : 'hidden print:!block',
      'print-keep-together duration-500 animate-in fade-in slide-in-from-bottom-4',
    ]"
    :id="'tabpanel-passage'"
    role="tabpanel"
    :aria-labelledby="'tab-passage'"
  >
    <!-- 이미지 영역 -->
    <div v-if="content.imageUrl" class="group relative mb-10 print:mb-4">
      <div
        class="overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
      >
        <img
          :src="displayImageUrl"
          :alt="`${content.topic} 관련 이미지`"
          class="aspect-video w-full object-cover"
          loading="lazy"
          referrerpolicy="no-referrer"
          crossorigin="anonymous"
          @error="handleMainImageError"
        />
      </div>
      <!-- 이미지 변경 버튼 -->
      <button
        v-if="canEdit"
        type="button"
        class="no-print absolute right-4 top-4 hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#666] shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:text-indigo-600 hover:ring-indigo-300 group-hover:flex group-hover:items-center group-hover:gap-1"
        @click="openImageEditor"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          width="16px"
          viewBox="0 -960 960 960"
          fill="currentColor"
        >
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"
          />
        </svg>
        {{ t(content.language, 'changeImage') }}
      </button>
    </div>
    <div class="mb-6 flex items-end justify-between print:mb-3">
      <h2
        class="border-l-8 border-indigo-600 pl-4 text-2xl font-black uppercase tracking-tight text-gray-800"
      >
        {{ t(content.language, 'readingPassage') }}
      </h2>
      <div class="no-print flex items-center gap-2">
        <button
          v-if="!isEditingPassage && canEdit"
          @click="startEditPassage"
          type="button"
          class="flex items-center gap-x-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#666] shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 hover:text-indigo-600 hover:ring-indigo-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="16px"
            height="16px"
            fill="currentColor"
          >
            <path
              d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
            />
          </svg>
          {{ t(content.language, 'edit') }}
        </button>
        <template v-if="isEditingPassage && canEdit">
          <button
            type="button"
            class="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
            @click="savePassageInline"
          >
            {{ t(content.language, 'save') }}
          </button>
          <button
            type="button"
            class="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-500 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            @click="cancelPassageEdit"
          >
            {{ t(content.language, 'cancel') }}
          </button>
        </template>
        <button
          v-if="!isEditingPassage"
          @click="$emit('copy', content.adaptedReadingPassage)"
          @keydown.enter.prevent="$emit('copy', content.adaptedReadingPassage)"
          class="rounded px-2 py-1 text-sm font-bold text-indigo-600 transition-all hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :aria-label="t(content.language, 'copyText')"
        >
          {{ t(content.language, 'copyText') }}
        </button>
      </div>
    </div>
    <!-- 본문 영역 (읽기 모드: 우클릭 시 레퍼런스 편집 메뉴) -->
    <div
      v-if="!isEditingPassage"
      ref="passageContainerRef"
      class="prose prose-indigo relative max-w-none text-lg font-medium leading-relaxed text-gray-700"
      @contextmenu="onPassageContextMenu"
    >
      <p
        v-for="(p, i) in paragraphs"
        :key="i"
        class="mb-6 indent-0 print:mb-3"
        v-html="renderPassageWithCitations(p)"
      ></p>

      <!-- 본문/레퍼런스 편집 컨텍스트 메뉴 (본문 영역 내부 absolute) -->
      <div
        v-if="canEdit && showReferenceMenu"
        class="reference-menu no-print absolute z-50 w-64 rounded-xl border border-gray-200 bg-white p-3 text-xs shadow-xl"
        :style="referenceMenuStyle"
        @click.stop
      >
        <!-- 선택된 텍스트 표시 -->
        <p
          v-if="selectedRangeText"
          class="mb-2 truncate rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700"
        >
          "{{ selectedRangeText }}"
        </p>
        <p class="mb-2 text-[11px] font-semibold text-gray-500">
          {{ t(content.language, 'wikipediaReferences') }}
        </p>
        <ul class="mb-2 max-h-40 space-y-1 overflow-y-auto">
          <li
            v-for="(src, index) in content.sources || []"
            :key="index"
            :class="[
              'flex items-center justify-between rounded-lg px-2 py-1 transition-colors',
              isCitationActive(index) ? 'bg-indigo-100' : 'hover:bg-gray-50',
            ]"
          >
            <button
              type="button"
              :class="[
                'flex-1 truncate text-left text-[11px] font-medium',
                isCitationActive(index) ? 'font-bold text-indigo-700' : 'text-gray-800',
              ]"
              @click="toggleReferenceForText(index)"
            >
              [{{ index + 1 }}] {{ src.title }}
            </button>
          </li>
          <li
            v-if="!content.sources || content.sources.length === 0"
            class="px-2 py-1 text-[11px] text-gray-400"
          >
            {{ t(content.language, 'noReferences') }}
          </li>
        </ul>
        <div class="mt-1 flex flex-col gap-1">
          <button
            type="button"
            class="w-full rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
            @click="openReferenceEditor()"
          >
            + {{ t(content.language, 'addReference') }}
          </button>
          <button
            type="button"
            class="w-full rounded-lg bg-gray-50 px-2 py-1 text-[11px] font-semibold text-gray-500 hover:bg-gray-100"
            @click="clearReferenceFromText"
          >
            {{ t(content.language, 'removeCitationFromText') }}
          </button>
        </div>
      </div>
    </div>
    <!-- 본문 영역 (편집 모드) -->
    <div v-else>
      <textarea
        v-model="editablePassage"
        rows="12"
        class="w-full rounded-2xl border border-indigo-200 bg-white p-4 text-lg font-medium leading-relaxed text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>
    </div>
    <!-- 요약 영역 -->
    <div
      class="group/summary relative mt-10 rounded-3xl border border-indigo-100 bg-indigo-50/50 p-8 print:mt-4 print:p-4"
    >
      <h3 class="mb-3 flex items-center gap-2 text-lg font-black text-indigo-900 print:mb-2">
        {{ t(content.language, 'summary') }}
      </h3>
      <!-- 읽기 모드 -->
      <div v-if="!isEditingSummary" class="relative">
        <p class="font-semibold leading-relaxed text-indigo-800">
          {{ content.summary }}
        </p>
        <!-- hover 시 우측 상단 Edit 버튼 -->
        <button
          v-if="canEdit"
          type="button"
          class="no-print absolute -right-6 -top-16 hidden items-center gap-x-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#666] shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 hover:text-indigo-600 hover:ring-indigo-300 group-hover/summary:flex"
          @click="startEditSummary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            fill="currentColor"
          >
            <path
              d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
            />
          </svg>
          {{ t(content.language, 'edit') }}
        </button>
      </div>
      <!-- 편집 모드 -->
      <div v-else class="relative">
        <textarea
          v-model="editableSummary"
          rows="3"
          class="w-full rounded-2xl border border-indigo-200 bg-white p-3 text-sm font-medium text-indigo-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
        <!-- 우측 상단 Save/Cancel 버튼 -->
        <div class="absolute -right-6 -top-16 flex gap-2">
          <button
            type="button"
            class="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
            @click="saveSummary"
          >
            {{ t(content.language, 'save') }}
          </button>
          <button
            type="button"
            class="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-500 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            @click="cancelSummaryEdit"
          >
            {{ t(content.language, 'cancel') }}
          </button>
        </div>
      </div>
    </div>
    <!-- 위키피디아 참고 문헌 -->
    <div
      v-if="content.sources && content.sources.length > 0"
      class="no-print mt-12 border-t-2 border-gray-50 pt-8"
    >
      <h4 class="mb-6 text-xs font-black uppercase tracking-widest text-gray-400">
        {{ t(content.language, 'wikipediaReferences') }}
      </h4>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="(src, i) in content.sources"
          :key="i"
          class="group/ref flex cursor-default items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-indigo-300 hover:bg-white"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-black text-indigo-600 shadow-sm transition-all group-hover/ref:bg-indigo-600 group-hover/ref:text-white"
          >
            {{ i + 1 }}
          </span>
          <div class="min-w-0 flex-1 overflow-hidden">
            <p class="truncate text-sm font-bold text-gray-800">{{ src.title }}</p>
            <p class="truncate font-mono text-[10px] text-gray-400">{{ src.uri }}</p>
          </div>
          <!-- 레퍼런스 편집/삭제 아이콘 (hover 시에만 표시) -->
          <div
            v-if="canEdit"
            class="ml-auto flex gap-2 opacity-0 transition-opacity duration-200 group-hover/ref:opacity-100"
          >
            <button
              type="button"
              class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#999] ring-1 ring-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-300"
              @click.prevent.stop="openReferenceEditor(i, src)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 -960 960 960"
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
              @click.prevent.stop="deleteReference(i)"
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
        </div>
      </div>
      <!-- 레퍼런스 추가 버튼 -->
      <button
        v-if="canEdit"
        type="button"
        class="no-print mt-4 w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
        @click="openReferenceEditor()"
      >
        + {{ t(content.language, 'addReference') }}
      </button>
    </div>

    <ImageEditorModal
      v-if="canEdit"
      :show="showImageEditor"
      :language="content.language"
      :initial-image-url="content.imageUrl || ''"
      @close="closeImageEditor"
      @save="saveImage"
    />

    <ReferenceEditorModal
      v-if="canEdit"
      :show="showReferenceModal"
      :language="content.language"
      :editing-index="editingReferenceIndex"
      :form="referenceForm"
      @close="closeReferenceModal"
      @save="saveReference"
    />
  </section>
</template>

<script setup>
import { t } from '@/components/Common/i18n.js'
import { API_ENDPOINTS } from '@/services/api.js'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ImageEditorModal from './ImageEditorModal.vue'
import ReferenceEditorModal from './ReferenceEditorModal.vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
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

const emit = defineEmits([
  'copy',
  'update:image',
  'update:passage',
  'update:summary',
  'update:sources',
])

const paragraphs = computed(() =>
  props.content.adaptedReadingPassage.split(/\n+/).filter((p) => p.trim()),
)

const renderPassageWithCitations = (text) => {
  if (!text) return ''

  // 먼저 신규 포맷: [특정 텍스트]([1, 2]) 매칭 (콤마나 공백 포함 가능)
  // 그룹1: 특정 텍스트, 그룹2: 인용 번호 목록 (ex: "1, 2", "1")
  const newFormatRegex = /\[([^\]]+)\]\(\[([0-9,\s]+)\]\)/g

  // 신규 포맷을 임시 토큰으로 치환하여 구형 포맷 정규식과 출돌하지 않게 함
  const tokens = []
  let tempText = text.replace(newFormatRegex, (match, citedText, citationsStr) => {
    const citationNums = citationsStr.split(',').map((n) => parseInt(n.trim(), 10))
    const token = `__CITATION_TOKEN_${tokens.length}__`
    tokens.push({ type: 'new', text: citedText, nums: citationNums })
    return token
  })

  // 구형 포맷: 그냥 [1] 형태
  const oldFormatRegex = /\[(\d+)\]/g
  tempText = tempText.replace(oldFormatRegex, (match, citationStr) => {
    const citationNum = parseInt(citationStr, 10)
    const token = `__CITATION_TOKEN_${tokens.length}__`
    tokens.push({ type: 'old', text: '', nums: [citationNum] })
    return token
  })

  // 다시 토큰들을 HTML로 복원
  tokens.forEach((tokenObj, i) => {
    let replacement = ''

    if (tokenObj.type === 'new') {
      // 신규 포맷: 단어 강조 + 여러 번호 배지
      let badgesHtml = ''
      tokenObj.nums.forEach((num) => {
        const sourceIndex = num - 1
        const source = props.content.sources?.[sourceIndex]
        if (source?.uri) {
          badgesHtml += `<a
              href="${source.uri}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm no-print ml-0.5"
              title="${source.title}"
              data-citation-num="${num}"
            >
              ${num}
            </a>`
        }
      })

      if (badgesHtml) {
        replacement = `<span class="inline-flex items-baseline transition-all has-[a:hover]:text-indigo-700 has-[a:hover]:underline has-[a:hover]:font-semibold" data-cited-text="${tokenObj.text}">
          <span class="transition-colors">${tokenObj.text}</span>
          <sup class="align-top flex items-center">
            ${badgesHtml}
          </sup>
        </span>`
      } else {
        replacement = tokenObj.text
      }
    } else {
      // 기존 포맷
      const num = tokenObj.nums[0]
      const sourceIndex = num - 1
      const source = props.content.sources?.[sourceIndex]
      if (source?.uri) {
        replacement = `<sup class="px-0.5 align-top">
          <a
            href="${source.uri}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm no-print"
            title="${source.title}"
            data-citation-num="${num}"
          >
            ${num}
          </a>
        </sup>`
      }
    }
    tempText = tempText.replace(`__CITATION_TOKEN_${i}__`, replacement)
  })

  return tempText
}

// ── 2. Reading Passage 인라인 편집 ──
const isEditingPassage = ref(false)
const editablePassage = ref('')

const startEditPassage = () => {
  if (!props.canEdit) return
  editablePassage.value = props.content.adaptedReadingPassage || ''
  isEditingPassage.value = true
}

const savePassageInline = () => {
  if (!props.canEdit) return
  emit('update:passage', editablePassage.value)
  isEditingPassage.value = false
}

const cancelPassageEdit = () => {
  isEditingPassage.value = false
}

// ── 4. 요약 편집 상태 ──
const isEditingSummary = ref(false)
const editableSummary = ref('')

const startEditSummary = () => {
  if (!props.canEdit) return
  isEditingSummary.value = true
  editableSummary.value = props.content.summary || ''
}

const saveSummary = () => {
  if (!props.canEdit) return
  emit('update:summary', editableSummary.value.trim())
  isEditingSummary.value = false
}

const cancelSummaryEdit = () => {
  isEditingSummary.value = false
}

// ── 1. 이미지 편집 (URL + 파일 업로드) ──
const showImageEditor = ref(false)
const displayImageUrl = ref('')
const imageFallbackCandidates = ref([])
const imageFallbackIndex = ref(0)

const extractGoogleDriveFileId = (imageUrl) => {
  if (!imageUrl) return imageUrl
  if (/^[a-zA-Z0-9_-]{10,}$/.test(imageUrl)) return imageUrl

  let parsed
  try {
    parsed = new URL(imageUrl)
  } catch {
    return null
  }

  const host = parsed.hostname.toLowerCase()
  if (!host.includes('drive.google.com') && !host.includes('docs.google.com')) {
    return null
  }

  const byQueryId = parsed.searchParams.get('id')?.trim()
  const byPathFile = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1]?.trim()
  const fileId = byPathFile || byQueryId || null

  return fileId || null
}

const buildGoogleDriveImageCandidates = (imageUrl) => {
  const fileId = extractGoogleDriveFileId(imageUrl)
  if (!fileId) return [imageUrl]

  return [
    API_ENDPOINTS.GOOGLE_DRIVE.PROXY(fileId),
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ]
}

const normalizeGoogleDriveImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl
  const fileId = extractGoogleDriveFileId(imageUrl)
  return fileId || imageUrl
}

const resetMainImageSrc = (imageUrl) => {
  const candidates = buildGoogleDriveImageCandidates(imageUrl)
  imageFallbackCandidates.value = candidates
  imageFallbackIndex.value = 0
  displayImageUrl.value = candidates[0] || ''
}

const handleMainImageError = () => {
  const next = imageFallbackIndex.value + 1
  if (next >= imageFallbackCandidates.value.length) return
  imageFallbackIndex.value = next
  displayImageUrl.value = imageFallbackCandidates.value[next]
}

watch(
  () => props.content.imageUrl,
  (val) => {
    resetMainImageSrc(val || '')
  },
  { immediate: true },
)

const openImageEditor = () => {
  if (!props.canEdit) return
  showImageEditor.value = true
}

const closeImageEditor = () => {
  showImageEditor.value = false
}

const saveImage = (value) => {
  if (!props.canEdit) return
  if (value && typeof value === 'string' && value.startsWith('data:image/')) {
    emit('update:image', value)
    showImageEditor.value = false
    return
  }

  const normalized = normalizeGoogleDriveImageUrl((value || '').trim())
  emit('update:image', normalized || null)
  showImageEditor.value = false
}

// ── 3. 우클릭 컨텍스트 메뉴 & 레퍼런스 토글 ──
const passageContainerRef = ref(null)
const showReferenceMenu = ref(false)
const referenceMenuPosition = ref({ x: 0, y: 0 })
const selectedRangeText = ref('')
const contextParagraphIndex = ref(null)

// 컨텍스트 메뉴 위치 스타일 (absolute, 컨테이너 기준)
const referenceMenuStyle = computed(() => {
  const menuWidth = 256
  let x = referenceMenuPosition.value.x
  let y = referenceMenuPosition.value.y

  // 컨테이너 너비 기준으로 오른쪽 밖 방지
  if (passageContainerRef.value) {
    const containerWidth = passageContainerRef.value.offsetWidth
    if (x + menuWidth > containerWidth) x = containerWidth - menuWidth
  }
  if (x < 0) x = 0
  if (y < 0) y = 0
  return { top: `${y}px`, left: `${x}px` }
})

// 현재 선택된 텍스트(또는 문단)에 해당 citation이 이미 있는지 확인
const isCitationActive = (index) => {
  const citationNum = index + 1
  const original = props.content.adaptedReadingPassage || ''

  if (selectedRangeText.value) {
    const escapedTarget = selectedRangeText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // 신규 포맷 체크: [text]([1, 2]) 에서 해당 번호가 있는지 확인
    const newFormatRegex = new RegExp(
      `\\[${escapedTarget}\\]\\(\\[([0-9,\\s]*?)\\b${citationNum}\\b([0-9,\\s]*?)\\]\\)`,
    )
    // 구형 포맷 체크: text [1]
    const oldFormatRegex = new RegExp(`${escapedTarget}\\s*\\[${citationNum}\\]`)

    return newFormatRegex.test(original) || oldFormatRegex.test(original)
  } else if (contextParagraphIndex.value !== null) {
    const paras = original.split(/\n+/).filter((p) => p.trim())
    const pi = contextParagraphIndex.value
    if (pi >= 0 && pi < paras.length) {
      // 끝에 `[1]` 형태(구형) 또는 `]([1,2])` 형태(신규)가 존재하는지 대략 확인
      const endRegexOld = new RegExp(`\\[${citationNum}\\]\\s*$`)
      const endRegexNew = new RegExp(`\\]\\(\\[.*\\b${citationNum}\\b.*\\]\\)\\s*$`)
      return endRegexOld.test(paras[pi]) || endRegexNew.test(paras[pi])
    }
  }
  return false
}

const closeReferenceMenu = () => {
  showReferenceMenu.value = false
}

const onPassageContextMenu = (event) => {
  if (!props.canEdit) return
  event.preventDefault()
  // 1. A태그(또는 그 래퍼) 우클릭 시, 해당 텍스트를 자동 선택된 것으로 취급
  const citationWrapper = event.target.closest('[data-cited-text]')
  if (citationWrapper) {
    const text = citationWrapper.dataset.citedText
    selectedRangeText.value = text
    contextParagraphIndex.value = null

    showReferenceMenu.value = true
    nextTick(() => {
      if (!passageContainerRef.value) return
      const containerRect = passageContainerRef.value.getBoundingClientRect()
      referenceMenuPosition.value = {
        x: event.clientX - containerRect.left - 128, // 메뉴 너비 절반
        y: event.clientY - containerRect.top + 10,
      }
    })
    return
  }

  const selection = window.getSelection()
  let selectedText = selection ? selection.toString().trim() : ''

  // 4. 드래그 없이 우클릭한 경우: 커서 위치의 단어를 자동 선택
  if (!selectedText) {
    // 클릭한 위치에서 가장 가까운 텍스트 노드의 단어를 자동 선택
    const range = document.caretRangeFromPoint
      ? document.caretRangeFromPoint(event.clientX, event.clientY)
      : null

    if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textContent = range.startContainer.textContent || ''
      const offset = range.startOffset

      // 단어 경계를 찾아서 자동 선택 (공백/특수문자 기준)
      let wordStart = offset
      let wordEnd = offset
      while (wordStart > 0 && /\S/.test(textContent[wordStart - 1])) wordStart--
      while (wordEnd < textContent.length && /\S/.test(textContent[wordEnd])) wordEnd++

      const word = textContent.slice(wordStart, wordEnd).trim()
      // citation 마커는 제외
      if (word && !/^\[\d+\]$/.test(word)) {
        selectedText = word
        // 시각적으로도 선택 상태 표시
        const newRange = document.createRange()
        newRange.setStart(range.startContainer, wordStart)
        newRange.setEnd(range.startContainer, wordEnd)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
  }

  selectedRangeText.value = selectedText

  // 문단 인덱스도 저장 (문단 끝 추가 fallback용)
  const targetP = event.target.closest('p')
  if (targetP) {
    const allPs = event.currentTarget.querySelectorAll('p')
    contextParagraphIndex.value = Array.from(allPs).indexOf(targetP)
  } else {
    contextParagraphIndex.value = null
  }

  // 선택 영역 바로 아래에 메뉴 표시 (컨테이너 기준 absolute 좌표)
  showReferenceMenu.value = true
  nextTick(() => {
    if (!passageContainerRef.value) return
    const containerRect = passageContainerRef.value.getBoundingClientRect()

    if (selection && selection.rangeCount > 0 && selectedText) {
      const selRect = selection.getRangeAt(0).getBoundingClientRect()
      // 선택 영역의 중앙 x, 바로 아래 y (컨테이너 좌표 기준)
      const centerX = selRect.left + selRect.width / 2 - containerRect.left - 128
      referenceMenuPosition.value = {
        x: centerX,
        y: selRect.bottom - containerRect.top + 4,
      }
    } else {
      referenceMenuPosition.value = {
        x: event.clientX - containerRect.left - 128,
        y: event.clientY - containerRect.top,
      }
    }
  })
}

// 레퍼런스 토글 (텍스트 선택 시 다중 인용 지원 포맷 사용: [text]([1, 2]))
const toggleReferenceForText = (index) => {
  if (!props.canEdit) return
  const citationNum = index + 1
  const citationMarker = `[${citationNum}]`
  let original = props.content.adaptedReadingPassage || ''

  if (selectedRangeText.value) {
    const target = selectedRangeText.value

    if (!original.includes(target)) {
      closeReferenceMenu()
      return
    }

    const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // 1. 이미 존재하는 신규 포맷 [text]([x, y]) 찾기
    const newFormatGlobalRegex = new RegExp(`\\[${escapedTarget}\\]\\(\\[([0-9,\\s]+)\\]\\)`, 'g')

    // 신규 포맷 치환
    if (newFormatGlobalRegex.test(original)) {
      original = original.replace(newFormatGlobalRegex, (match, numsStr) => {
        let nums = numsStr
          .split(',')
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n))
        if (nums.includes(citationNum)) {
          // 제거
          nums = nums.filter((n) => n !== citationNum)
        } else {
          // 추가
          nums.push(citationNum)
          nums.sort((a, b) => a - b)
        }

        if (nums.length === 0) {
          return target // 번호 없으면 마크다운 해제
        }
        return `[${target}]([${nums.join(', ')}])`
      })
      emit('update:passage', original)
      closeReferenceMenu()
      return
    }

    // 2. 구형 포맷 text [1] 찾기
    const oldFormatRegex = new RegExp(`(${escapedTarget})\\s*\\[${citationNum}\\]`, 'g')
    if (oldFormatRegex.test(original)) {
      const updated = original.replace(oldFormatRegex, '$1') // text [1] -> text
      emit('update:passage', updated)
      closeReferenceMenu()
      return
    }

    // 3. 없으면 새로 추가 [text]([1])
    const addRegex = new RegExp(`(?<!\\[)${escapedTarget}(?!\\]\\(\\[[0-9,\\s]+\\]\\))`, 'g')
    const updated = original.replace(addRegex, `[${target}]([${citationNum}])`)
    emit('update:passage', updated)
  } else if (contextParagraphIndex.value !== null) {
    // 문단 끝 추가 (구형 포맷 사용 - fallback)
    const paras = original.split(/\n+/).filter((p) => p.trim())
    const pi = contextParagraphIndex.value
    if (pi >= 0 && pi < paras.length) {
      const endRegexOld = new RegExp(`\\s*\\[${citationNum}\\]\\s*$`)
      if (endRegexOld.test(paras[pi])) {
        paras[pi] = paras[pi].replace(endRegexOld, '')
      } else {
        paras[pi] = paras[pi].trimEnd() + ` ${citationMarker}`
      }
      emit('update:passage', paras.join('\n\n'))
    }
  }
  closeReferenceMenu()
}

const clearReferenceFromText = () => {
  if (!props.canEdit) return
  if (!selectedRangeText.value) {
    closeReferenceMenu()
    return
  }

  const original = props.content.adaptedReadingPassage || ''

  // 신/구 포맷 모두 제거
  let cleaned = original.replace(/\[([^\]]+)\]\(\[[0-9,\s]+\]\)/g, '$1') // [text]([1, 2]) -> text
  cleaned = cleaned.replace(/\[\d+\]/g, '') // [1] -> ''

  emit('update:passage', cleaned)
  closeReferenceMenu()
}

// ── 5. 레퍼런스 추가/수정/삭제 ──
const editingReferenceIndex = ref(null)
const referenceForm = ref({
  title: '',
  uri: '',
})

const openReferenceEditor = (index = null, src = null) => {
  if (!props.canEdit) return
  editingReferenceIndex.value = index
  if (src) {
    referenceForm.value = {
      title: src.title || '',
      uri: src.uri || '',
    }
  } else {
    referenceForm.value = {
      title: '',
      uri: '',
    }
  }
  showReferenceMenu.value = false
  showReferenceModal.value = true
}

const deleteReference = (index) => {
  if (!props.canEdit) return
  const current = Array.isArray(props.content.sources) ? [...props.content.sources] : []
  current.splice(index, 1)
  emit('update:sources', current)
}

const showReferenceModal = ref(false)

const saveReference = () => {
  if (!props.canEdit) return
  const current = Array.isArray(props.content.sources) ? [...props.content.sources] : []
  const payload = {
    title: referenceForm.value.title.trim(),
    uri: referenceForm.value.uri.trim(),
  }

  if (!payload.title || !payload.uri) {
    return
  }

  if (editingReferenceIndex.value != null && editingReferenceIndex.value >= 0) {
    current.splice(editingReferenceIndex.value, 1, payload)
  } else {
    current.push(payload)
  }

  emit('update:sources', current)
  showReferenceModal.value = false
}

const closeReferenceModal = () => {
  showReferenceModal.value = false
}

const handleGlobalClick = (event) => {
  if (showReferenceMenu.value) {
    const target = event.target
    if (!(target.closest && target.closest('.reference-menu'))) {
      showReferenceMenu.value = false
    }
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>
