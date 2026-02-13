<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, SearchOutlined } from "@ant-design/icons-vue"
import { useCategoriesStore } from "~/stores/categories"
import type { Category, CategoryCreateDto, CategoryUpdateDto, CategoryName } from "~/types/category"
import type { TablePaginationConfig } from 'ant-design-vue';

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const categoriesStore = useCategoriesStore()
const { success, error: showError } = useNotification()

// State
const isModalVisible = ref(false)
const modalTitle = ref("Add Category")
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const uploadLoading = ref(false)

// Pagination & Search
const searchQuery = ref("")
const currentPage = ref(1)
const pageSize = ref(10)

const pagination = computed(() => ({
  total: categoriesStore.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
}))

const formState = reactive<CategoryCreateDto>({
  is_active: true,
  logo: "",
  name: {
    en: "",
    kk: "",
    ru: "",
    uz: "",
  },
  parent_id: 0,
})

// Table columns
const columns = [
  {
    title: "Logo",
    dataIndex: "logo",
    key: "logo",
    width: 100,
  },
  {
    title: "Name (UZ)",
    dataIndex: ["name", "uz"],
    key: "name_uz",
  },
  {
    title: "Name (RU)",
    dataIndex: ["name", "ru"],
    key: "name_ru",
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
  },
  {
    title: "Parent",
    dataIndex: "parent",
    key: "parent",
  },
  {
    title: "Actions",
    key: "actions",
    width: 150,
  },
]

async function fetchData() {
  await categoriesStore.fetchCategories({
    page: currentPage.value,
    page_size: pageSize.value,
    name: searchQuery.value || undefined,
  })
}

function handleTableChange(pag: TablePaginationConfig) {
  currentPage.value = pag.current || 1
  pageSize.value = pag.pageSize || 10
  fetchData()
}

// Watch search (simple debounce could be added here)
let searchTimeout: NodeJS.Timeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 300)
})

// Data fetching
onMounted(() => {
  fetchData()
})

// Handlers
function handleAdd() {
  isEditing.value = false
  editingId.value = null
  resetForm()
  modalTitle.value = "Add Category"
  isModalVisible.value = true
}

function handleEdit(record: Category) {
  isEditing.value = true
  editingId.value = record.id
  Object.assign(formState, {
    is_active: record.is_active,
    logo: record.logo,
    name: { ...record.name },
    parent_id: record.parent_id,
  })
  modalTitle.value = "Edit Category"
  isModalVisible.value = true
}

async function handleDelete(id: number) {
  if (confirm("Are you sure you want to delete this category?")) {
    const ok = await categoriesStore.deleteCategory(id)
    if (ok) success("Success", "Category deleted successfully")
    else showError("Error", "Failed to delete category")
  }
}

function resetForm() {
  formState.is_active = true
  formState.logo = ""
  formState.name = { en: "", kk: "", ru: "", uz: "" }
  formState.parent_id = 0
}

async function handleOk() {
  let ok = false
  if (isEditing.value && editingId.value) {
    ok = await categoriesStore.updateCategory(editingId.value, formState)
  } else {
    ok = await categoriesStore.createCategory(formState)
  }

  if (ok) {
    success("Success", isEditing.value ? "Category updated" : "Category created")
    isModalVisible.value = false
    resetForm()
  } else {
    showError("Error", isEditing.value ? "Failed to update" : "Failed to create")
  }
}

async function handleFileUpload(file: File) {
  uploadLoading.value = true
  const filename = await categoriesStore.uploadFile(file)
  uploadLoading.value = false
  
  if (filename) {
    formState.logo = filename
    success("Success", "File uploaded successfully")
  } else {
    showError("Error", "Failed to upload file")
  }
  return false // Prevent default upload behavior
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-[#202224] dark:text-white">Categories</h1>
      <div class="flex gap-4">
        <a-input
          v-model:value="searchQuery"
          placeholder="Search categories..."
          class="w-64"
          allow-clear
        >
           <template #prefix>
             <SearchOutlined />
           </template>
        </a-input>
        <a-button type="primary" size="large" @click="handleAdd">
          <PlusOutlined /> Add Category
        </a-button>
      </div>
    </div>

    <a-table 
      :columns="columns" 
      :data-source="categoriesStore.categories" 
      :loading="categoriesStore.loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'logo'">
           <!-- Assuming logo is a filename, we need a base URL. For now verifying if it's a full URL or just filename.
                If it is just a filename, you might need to prepend base URL.
           -->
          <a-image 
            v-if="record.logo"
            :width="50" 
            :src="record.logo" 
            alt="Logo" 
          />
          <span v-else class="text-gray-400">No Logo</span>
        </template>
        
        <template v-else-if="column.key === 'is_active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? 'Active' : 'Inactive' }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <a-button type="primary" ghost size="small" @click="handleEdit(record)">
              <EditOutlined />
            </a-button>
            <a-button danger size="small" @click="handleDelete(record.id)">
              <DeleteOutlined />
            </a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- Modal -->
    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      @ok="handleOk"
      :confirmLoading="categoriesStore.loading"
      width="700px"
    >
      <a-form layout="vertical">
        <a-tabs default-active-key="uz">
          <a-tab-pane key="uz" tab="O'zbek">
            <a-form-item label="Name (UZ)" required>
              <a-input v-model:value="formState.name.uz" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="ru" tab="Русский">
            <a-form-item label="Name (RU)" required>
              <a-input v-model:value="formState.name.ru" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="en" tab="English">
            <a-form-item label="Name (EN)" required>
              <a-input v-model:value="formState.name.en" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="kk" tab="Qoraqalpoq">
            <a-form-item label="Name (KK)" required>
              <a-input v-model:value="formState.name.kk" />
            </a-form-item>
          </a-tab-pane>
        </a-tabs>

        <a-form-item label="Parent Category">
           <a-select 
             v-model:value="formState.parent_id" 
             placeholder="Select parent"
             allow-clear
           >
             <a-select-option :value="0">None</a-select-option>
             <a-select-option 
               v-for="cat in categoriesStore.categories" 
               :key="cat.id" 
               :value="cat.id"
               :disabled="cat.id === editingId"
             >
               {{ cat.name.uz }}
             </a-select-option>
           </a-select>
        </a-form-item>

        <a-form-item label="Logo">
           <div class="flex items-center gap-4">
             <a-upload 
               :before-upload="handleFileUpload" 
               :show-upload-list="false"
               name="files"
             >
               <a-button :loading="uploadLoading">
                 <UploadOutlined /> Click to Upload
               </a-button>
             </a-upload>
             
             <div v-if="formState.logo" class="flex items-center gap-2">
               <a-image :width="60" :src="formState.logo" />
               <span class="text-xs text-gray-500 truncate max-w-[200px]">{{ formState.logo }}</span>
             </div>
           </div>
        </a-form-item>

        <a-form-item label="Status">
          <a-switch v-model:checked="formState.is_active" />
          <span class="ml-2">{{ formState.is_active ? 'Active' : 'Inactive' }}</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
