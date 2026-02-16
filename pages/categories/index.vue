<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, GlobalOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons-vue"
import { useCategoriesStore } from "~/stores/categories"
import { useNotification } from "~/composables/useNotification"
import type { CategoryCreateDto, CategoryName } from "~/types/category"
import type { TablePaginationConfig } from 'ant-design-vue';

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const categoriesStore = useCategoriesStore()
const { success, error: showError } = useNotification()
const { t, locale } = useI18n()

// State
const isModalVisible = ref(false)
const modalTitle = ref("Add Category")
const isEditing = ref(false)
const editingId = ref<number | null>(null)

// Pagination & Search
const searchQuery = ref("")
const filters = reactive({
  key: undefined as string | undefined,
  value: undefined as string | undefined,
})
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

// Localization Helpers
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
    title: "Parent",
    dataIndex: "parent",
    key: "parent",
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    width: 100,
  },
  {
    title: "Actions",
    key: "actions",
    width: 150,
  },
]

async function fetchData() {
  const params: Record<string, any> = {
    page: currentPage.value,
    page_size: pageSize.value,
  }

  if (filters.key && filters.value) {
    params[filters.key] = filters.value
  }

  if (searchQuery.value) {
    params.name = searchQuery.value
  }

  await categoriesStore.fetchCategories(params)
}

function handleTableChange(pag: TablePaginationConfig) {
  currentPage.value = pag.current || 1
  pageSize.value = pag.pageSize || 10
  fetchData()
}

function resetFilters() {
  filters.key = undefined
  filters.value = undefined
  searchQuery.value = ""
  currentPage.value = 1
  fetchData()
}

// Watch search
let searchTimeout: NodeJS.Timeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 300)
})

watch(() => [filters.key, filters.value], () => {
    if (filters.key && filters.value) {
         searchQuery.value = ""
         currentPage.value = 1
         fetchData()
    }
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

function handleEdit(record: any) {
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
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-3xl font-bold text-[#202224] dark:text-white">Categories</h1>
      <a-button type="primary" size="large" class="bg-[#4880ff] h-11 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-sm border-none" @click="handleAdd">
        <PlusOutlined /> Add Category
      </a-button>
    </div>

    <div class="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm flex flex-wrap items-center gap-4 border border-gray-100 dark:border-dark-border">
      <div class="flex items-center gap-2 whitespace-nowrap">
        <FilterOutlined class="text-gray-400 dark:text-gray-500" />
        <span class="font-bold text-[#202224] dark:text-white">{{ t("common.filterBy") }}</span>
      </div>

      <a-select
        v-model:value="filters.key"
        placeholder="Field"
        class="w-full sm:w-32 rounded-lg bg-[#F5F6FA] dark:bg-dark-main"
        :bordered="false"
      >
        <a-select-option value="name">Name</a-select-option>
      </a-select>

      <a-input
        v-model:value="filters.value"
        placeholder="Value"
        class="w-full sm:w-48 bg-[#F5F6FA] dark:bg-dark-main dark:text-white border-none rounded-lg"
      />

      <a-button
        class="text-[#EA0234] hover:text-red-700 hover:bg-red-50 border-none font-bold flex items-center gap-2 whitespace-nowrap"
        @click="resetFilters"
      >
        <ReloadOutlined /> {{ t("common.resetFilter") }}
      </a-button>

      <div class="sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
        <a-input
          v-model:value="searchQuery"
          placeholder="Search categories..."
          class="search-input rounded-full w-full sm:w-64 h-[38px]"
          :bordered="false"
          allow-clear
        >
           <template #prefix>
             <SearchOutlined class="text-gray-400" />
           </template>
        </a-input>
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
