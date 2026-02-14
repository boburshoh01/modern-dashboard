<script setup lang="ts">
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons-vue"

const props = defineProps<{
  value?: string
  accept?: string
  maxSize?: number // in MB
}>()

const emit = defineEmits<{
  (e: 'update:value' | 'upload', val: string): void
  (e: 'error', err: any): void
}>()

const loading = ref(false)
const { post } = useApi()
const { success, error } = useNotification()

async function handleUpload(file: File) {
  // Validate size
  if (props.maxSize && file.size / 1024 / 1024 > props.maxSize) {
    error("Error", `File must be smaller than ${props.maxSize}MB!`)
    return false
  }

  loading.value = true
  const formData = new FormData()
  formData.append('files', file)
  
  try {
    const { data } = await post<any>('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    // Adjust based on actual API response. Assuming 'data' is the filename string.
    // If API returns { filename: "..." }, use data.filename
    const filename = typeof data === 'string' ? data : data?.filename || data?.url || ''
    
    if (filename) {
        emit('update:value', filename)
        emit('upload', filename)
        success("Success", "File uploaded successfully")
    } else {
        throw new Error("Invalid response from server")
    }
  } catch (err: any) {
    console.error("Upload error:", err)
    error("Error", "Upload failed")
    emit('error', err)
  } finally {
    loading.value = false
  }
  return false // Prevent default upload
}

function handleRemove() {
    emit('update:value', '')
}
</script>

<template>
  <div class="flex items-center gap-4">
    <a-upload 
      :before-upload="handleUpload" 
      :show-upload-list="false"
      :accept="accept"
      name="files"
    >
      <a-button :loading="loading">
        <UploadOutlined v-if="!loading" /> 
        {{ loading ? 'Uploading...' : 'Click to Upload' }}
      </a-button>
    </a-upload>
    
    <div v-if="value" class="flex items-center gap-2 bg-gray-50 dark:bg-dark-card p-1 rounded border border-gray-200 dark:border-dark-border">
       <a-image 
         :width="40" 
         :src="value" 
         class="rounded"
       /> 
       <span class="text-xs text-gray-500 truncate max-w-[150px]">{{ value }}</span>
       <a-button type="text" size="small" danger @click.stop="handleRemove">
            <DeleteOutlined />
       </a-button>
    </div>
  </div>
</template>
