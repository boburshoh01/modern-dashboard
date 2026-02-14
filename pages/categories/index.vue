<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, GlobalOutlined } from "@ant-design/icons-vue"
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

// Localization
const { locale } = useI18n()
const expandLanguage = ref(false)

const supportedLanguages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'ru', name: "Русский" },
  { code: 'en', name: "English" },
  { code: 'kk', name: "Qoraqalpoq" },
]

function getLocalizedName(nameObj: CategoryName) {
  if (!nameObj) return ""
  return nameObj[locale.value as keyof CategoryName] || nameObj.uz || nameObj.en || ""
}

// Table columns
const columns = [
  {
    title: "Logo",
    dataIndex: "logo",
    key: "logo",
    width: 100,
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    width: 100,
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
  expandLanguage.value = false
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
  expandLanguage.value = false
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
      :data-source="categoriesStore.categories || []" 
      :loading="categoriesStore.loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'logo'">
           <a-image 
             v-if="record.logo"
             :width="50" 
             :src="record.logo" 
             alt="Logo" 
           />
           <span v-else class="text-gray-400">No Logo</span>
        </template>
        
        <template v-else-if="column.key === 'name'">
          <span class="font-medium">{{ getLocalizedName(record.name) }}</span>
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
      width="600px"
    >
      <a-form layout="vertical">
        <a-form-item label="Name" required>
           <div class="relative">
             <a-input 
               v-model:value="formState.name[locale as keyof CategoryName]" 
               :placeholder="`Name (${locale.toUpperCase()})`"
             >
               <template #suffix>
                 <a-tooltip title="Toggle Languages">
                   <GlobalOutlined 
                     class="cursor-pointer transition-colors hover:text-[#4880ff]" 
                     :class="{ 'text-[#4880ff]': expandLanguage, 'text-gray-400': !expandLanguage }"
                     @click="expandLanguage = !expandLanguage" 
                   />
                 </a-tooltip>
               </template>
             </a-input>
             
             <div v-if="expandLanguage" class="mt-3 p-3 bg-gray-50 dark:bg-dark-card border rounded-lg space-y-3 transition-all duration-300">
                <div v-for="lang in supportedLanguages" :key="lang.code">
                  <div v-if="lang.code !== locale" class="mb-1">
                    <label class="text-xs text-gray-500 block mb-1">{{ lang.name }} ({{ lang.code.toUpperCase() }})</label>
                    <a-input v-model:value="formState.name[lang.code as keyof CategoryName]" />
                  </div>
                </div>
             </div>
           </div>
        </a-form-item>

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
               {{ getLocalizedName(cat.name) }}
             </a-select-option>
           </a-select>
        </a-form-item>

        <a-form-item label="Logo">
           <AppFileUpload v-model:value="formState.logo" />
        </a-form-item>

        <a-form-item label="Status" class="mb-0">
          <div class="flex items-center gap-2">
            <a-switch v-model:checked="formState.is_active" />
            <span>{{ formState.is_active ? 'Active' : 'Inactive' }}</span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
