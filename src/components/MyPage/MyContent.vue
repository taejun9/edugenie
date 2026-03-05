<template>
  <div class="space-y-6">
    <ContentProfileStats
      :user="user"
      :user-initial="userInitial"
      :call-count="callCount"
      :call-limit="callLimit"
      :call-remaining="callRemaining"
    />

    <MyContentList
      :contents="contents"
      :is-loading="isLoading"
      :can-manage="isAuthenticated"
      @request-delete="promptDelete"
    />

    <DeleteContentModal
      :show="showDeleteModal"
      :is-deleting="isDeleting"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import ContentProfileStats from '@/components/MyPage/ContentProfileStats.vue'
import DeleteContentModal from '@/components/MyPage/DeleteContentModal.vue'
import MyContentList from '@/components/MyPage/MyContentList.vue'
import { useToast } from '@/helpers/useToast.js'
import { deleteSavedContent, getSavedContents } from '@/services/geminiService.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useUsageStore } from '@/stores/usage.store.js'
import { onMounted, ref } from 'vue'

const { user, userInitial, isAuthenticated } = useAuthStore()
const { callCount, callLimit, callRemaining, fetchTokenUsage } = useUsageStore()
const { showSuccess, showError } = useToast()

const contents = ref([])
const isLoading = ref(true)

// Modal State
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const isDeleting = ref(false)

onMounted(async () => {
  await fetchTokenUsage()
  await fetchContents()
})

const fetchContents = async () => {
  isLoading.value = true
  try {
    const data = await getSavedContents()
    contents.value = data || []
  } catch (error) {
    console.error('Failed to load contents:', error)
    showError('Failed to load saved contents.')
  } finally {
    isLoading.value = false
  }
}

const promptDelete = (id) => {
  if (!isAuthenticated.value) return
  itemToDelete.value = id
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const confirmDelete = async () => {
  if (!isAuthenticated.value) return
  if (!itemToDelete.value) return

  isDeleting.value = true
  try {
    await deleteSavedContent(itemToDelete.value)
    showSuccess('Content deleted successfully.')
    await fetchContents()
    showDeleteModal.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Failed to delete content:', error)
    showError('Failed to delete content.')
  } finally {
    isDeleting.value = false
  }
}
</script>
