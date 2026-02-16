<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons-vue"
import { useBrandsStore } from "~/stores/brands"
import { useNotification } from "~/composables/useNotification"
import type { BrandCreateDto } from "~/types/brand"
import type { TablePaginationConfig } from 'ant-design-vue';

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const brandsStore = useBrandsStore()
const { success, error: showError } = useNotification()
const { t } = useI18n()

// State
const isModalVisible = ref(false)
const modalTitle = ref(t('brands.addBrand'))
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
  total: brandsStore.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
}))

const formState = reactive<BrandCreateDto>({
  is_active: true,
  logo: "",
  name: "",
})

// Table columns
const columns = computed(() => [
  {
    title: t('brands.logo'),
    dataIndex: "logo",
    key: "logo",
    width: 100,
  },
  {
    title: t('brands.name'),
    dataIndex: "name",
    key: "name",
  },
  {
    title: t('brands.status'),
    dataIndex: "is_active",
    key: "is_active",
    width: 100,
  },
  {
    title: t('brands.action'),
    key: "actions",
    width: 150,
  },
])

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

  await brandsStore.fetchBrands(params)
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
  modalTitle.value = t('brands.addBrand')
  isModalVisible.value = true
}

function handleEdit(record: any) {
  isEditing.value = true
  editingId.value = record.id
  Object.assign(formState, {
    is_active: record.is_active,
    logo: record.logo,
    name: record.name,
  })
  modalTitle.value = t('brands.editBrand')
  isModalVisible.value = true
}

async function handleDelete(id: number) {
  if (confirm(t('brands.messages.deleteConfirm'))) {
    const ok = await brandsStore.deleteBrand(id)
    if (ok) success(t('common.success'), t('brands.messages.deleted'))
    else showError(t('common.error'), t('brands.messages.deleteError'))
  }
}

function resetForm() {
  formState.is_active = true
  formState.logo = ""
  formState.name = ""
}

async function handleOk() {
  if (!formState.name) {
      showError(t('validation.required', { field: t('brands.name') }), t('brands.messages.validationName'))
      return
  }

  let ok = false
  if (isEditing.value && editingId.value) {
    ok = await brandsStore.updateBrand(editingId.value, formState)
  } else {
    ok = await brandsStore.createBrand(formState)
  }

  if (ok) {
    success(t('common.success'), isEditing.value ? t('brands.messages.updated') : t('brands.messages.created'))
    isModalVisible.value = false
    resetForm()
  } else {
    showError(t('common.error'), isEditing.value ? t('brands.messages.updateError') : t('brands.messages.createError'))
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-3xl font-bold text-[#202224] dark:text-white">{{ t('brands.title') }}</h1>
      <a-button type="primary" size="large" class="bg-[#4880ff] h-11 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-sm border-none" @click="handleAdd">
        <PlusOutlined /> {{ t('brands.addBrand') }}
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
        <a-select-option value="name">{{ t('brands.name') }}</a-select-option>
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
          :placeholder="t('brands.search')"
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
      :data-source="brandsStore.brands || []" 
      :loading="brandsStore.loading"
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
          <span class="font-medium">{{ record.name }}</span>
        </template>
        
        <template v-else-if="column.key === 'is_active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? t('brands.form.active') : t('brands.form.inactive') }}
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
      :confirm-loading="brandsStore.loading"
      width="600px"
      @ok="handleOk"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('brands.form.name')" required>
            <a-input 
            v-model:value="formState.name" 
            :placeholder="t('brands.form.name')"
            />
        </a-form-item>

        <a-form-item :label="t('brands.form.logo')">
           <AppFileUpload v-model:value="formState.logo" />
        </a-form-item>

        <a-form-item :label="t('brands.form.status')" class="mb-0">
          <div class="flex items-center gap-2">
            <a-switch v-model:checked="formState.is_active" />
            <span>{{ formState.is_active ? t('brands.form.active') : t('brands.form.inactive') }}</span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
