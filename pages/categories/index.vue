<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, GlobalOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons-vue"
import { useCategoriesStore } from "~/stores/categories"
import { useNotification } from "~/composables/useNotification"
import type { Category, CategoryCreateDto, CategoryName } from "~/types/category"
import type { TablePaginationConfig } from 'ant-design-vue';

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const categoriesStore = useCategoriesStore()
const { success, error: showError } = useNotification()
const { confirm } = useAppConfirm()
const { t, locale } = useI18n()

// State
const isModalVisible = ref(false)
const modalTitle = ref(t('categories.addCategory'))
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
const columns = computed(() => [
  {
    title: t('categories.logo'),
    dataIndex: "logo",
    key: "logo",
    width: 100,
  },
  {
    title: t('categories.name'),
    key: "name",
  },
  {
    title: t('categories.parent'),
    dataIndex: "parent",
    key: "parent",
  },
  {
    title: t('categories.status'),
    dataIndex: "is_active",
    key: "is_active",
    width: 100,
  },
  {
    title: t('categories.actions'),
    key: "actions",
    width: 150,
  },
])

async function fetchData() {
  const params: Record<string, string | number> = {
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
  modalTitle.value = t('categories.addCategory')
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
  modalTitle.value = t('categories.editCategory')
  expandLanguage.value = false
  isModalVisible.value = true
}

function handleDelete(id: number) {
  confirm({
    title: t('categories.messages.deleteConfirm'),
    type: "danger",
    onOk: async () => {
      const ok = await categoriesStore.deleteCategory(id)
      if (ok) success(t('common.success'), t('categories.messages.deleted'))
      else showError(t('common.error'), t('categories.messages.deleteError'))
    },
  })
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
    success(t('common.success'), isEditing.value ? t('categories.messages.updated') : t('categories.messages.created'))
    isModalVisible.value = false
    resetForm()
  } else {
    showError(t('common.error'), isEditing.value ? t('categories.messages.updateError') : t('categories.messages.createError'))
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('categories.title') }}</h1>
      <a-button type="primary" size="large" class="btn-primary h-11 px-6 flex items-center gap-2 shadow-sm border-none" @click="handleAdd">
        <PlusOutlined /> {{ t('categories.addCategory') }}
      </a-button>
    </div>

    <div class="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm flex flex-wrap items-center gap-4 border border-gray-100 dark:border-dark-border">
      <div class="flex items-center gap-2 whitespace-nowrap">
        <FilterOutlined class="text-gray-400 dark:text-gray-500" />
        <span class="font-bold text-gray-900 dark:text-white">{{ t("common.filterBy") }}</span>
      </div>

      <a-select
        v-model:value="filters.key"
        placeholder="Field"
        class="w-full sm:w-32 rounded-lg bg-background dark:bg-dark-main"
        :bordered="false"
      >
        <a-select-option value="name">{{ t('categories.name') }}</a-select-option>
      </a-select>

      <a-input
        v-model:value="filters.value"
        placeholder="Value"
        class="w-full sm:w-48 bg-background dark:bg-dark-main dark:text-white border-none rounded-lg"
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
          :placeholder="t('categories.search')"
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
           <span v-else class="text-gray-400">{{ t('categories.noLogo') }}</span>
        </template>
        
        <template v-else-if="column.key === 'name'">
          <span class="font-medium">{{ getLocalizedName(record.name) }}</span>
        </template>
        
        <template v-else-if="column.key === 'is_active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? t('common.status.active') : t('common.status.inactive') }}
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
        <a-form-item :label="t('categories.name')" required>
           <div class="relative">
             <a-input 
               v-model:value="formState.name[locale as keyof CategoryName]" 
               :placeholder="`${t('categories.name')} (${locale.toUpperCase()})`"
             >
               <template #suffix>
                 <a-tooltip :title="$t('categories.name')">
                   <GlobalOutlined 
                     class="cursor-pointer transition-colors hover:text-primary-500" 
                     :class="{ 'text-primary-500': expandLanguage, 'text-gray-400': !expandLanguage }"
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

        <a-form-item :label="t('categories.parentCategory')">
           <a-select 
             v-model:value="formState.parent_id" 
             :placeholder="t('categories.selectParent')"
             allow-clear
           >
             <a-select-option :value="0">{{ t('categories.none') }}</a-select-option>
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

        <a-form-item :label="t('categories.logo')">
           <AppFileUpload v-model:value="formState.logo" />
        </a-form-item>

        <a-form-item :label="t('categories.status')" class="mb-0">
          <div class="flex items-center gap-2">
            <a-switch v-model:checked="formState.is_active" />
            <span>{{ formState.is_active ? t('common.status.active') : t('common.status.inactive') }}</span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
