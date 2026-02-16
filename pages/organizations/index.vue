<script setup lang="ts">
import { EditOutlined, SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons-vue"
import { useOrganizationsStore } from "~/stores/organizations"
import { useNotification } from "~/composables/useNotification"
import type { Organization, OrganizationUpdateDto } from "~/types/organization"
import type { TablePaginationConfig } from 'ant-design-vue';

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const organizationsStore = useOrganizationsStore()
const { success, error: showError } = useNotification()
const { t } = useI18n()

// State
const isModalVisible = ref(false)
const modalTitle = ref(t('organizations.editOrganization'))
const editingId = ref<number | null>(null)

// Pagination & Search
const searchQuery = ref("")
const filters = reactive({
  key: undefined as string | undefined, // tin, name, email
  value: undefined as string | undefined,
})
const currentPage = ref(1)
const pageSize = ref(10)

const pagination = computed(() => ({
  total: organizationsStore.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
}))

const formState = reactive<OrganizationUpdateDto>({
  id: 0,
  email: "",
  phone_number: "",
  is_active: true,
})

// Table columns
const columns = computed(() => [
  {
    title: t('organizations.name'),
    dataIndex: "name",
    key: "name",
  },
  {
    title: t('organizations.tin'),
    dataIndex: "tin",
    key: "tin",
  },
  {
    title: t('organizations.phone'),
    dataIndex: "phone_number",
    key: "phone_number",
  },
  {
    title: t('organizations.email'),
    dataIndex: "email",
    key: "email",
  },
  {
    title: t('organizations.status'),
    dataIndex: "is_active",
    key: "is_active",
    width: 100,
  },
  {
    title: t('organizations.action'),
    key: "actions",
    width: 100,
  },
])

async function fetchData() {
  const params: Record<string, string | number> = {
    page: currentPage.value,
    page_size: pageSize.value,
    start: (currentPage.value - 1) * pageSize.value,
    limit: pageSize.value,
  }

  if (filters.key && filters.value) {
    params[filters.key] = filters.value
  }

  if (searchQuery.value) {
    params.name = searchQuery.value // fallback search by name if global search used
  }

  await organizationsStore.fetchOrganizations(params)
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
function handleEdit(record: Organization) {
  editingId.value = record.id
  Object.assign(formState, {
    id: record.id,
    email: record.email,
    phone_number: record.phone_number,
    is_active: record.is_active,
  })
  
  modalTitle.value = t('organizations.editOrganization')
  isModalVisible.value = true
}

async function handleOk() {
  const ok = await organizationsStore.updateOrganization(formState)

  if (ok) {
    success(t('common.success'), t('organizations.messages.updated'))
    isModalVisible.value = false
  } else {
    showError(t('common.error'), t('organizations.messages.updateError'))
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-[#202224] dark:text-white">{{ t('organizations.title') }}</h1>
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
        <a-select-option value="name">{{ t('organizations.name') }}</a-select-option>
        <a-select-option value="tin">{{ t('organizations.tin') }}</a-select-option>
        <a-select-option value="email">{{ t('organizations.email') }}</a-select-option>
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
          :placeholder="t('organizations.search')"
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

    <AppTable 
      :columns="columns" 
      :data-source="organizationsStore.organizations || []" 
      :loading="organizationsStore.loading"
      :pagination="pagination"
      row-key="id"
      :scroll="{ x: 1200 }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'is_active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? t('organizations.form.active') : t('organizations.form.inactive') }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <a-button type="primary" ghost size="small" @click="handleEdit(record)">
              <EditOutlined />
            </a-button>
          </div>
        </template>
      </template>
    </AppTable>

    <!-- Modal -->
    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      :confirm-loading="organizationsStore.loading"
      width="600px"
      @ok="handleOk"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('organizations.email')">
            <a-input 
            v-model:value="formState.email" 
            placeholder="Email"
            />
        </a-form-item>
        
        <a-form-item :label="t('organizations.phone')">
            <a-input 
            v-model:value="formState.phone_number" 
            placeholder="Phone"
            />
        </a-form-item>

        <a-form-item :label="t('organizations.status')" class="mb-0">
          <div class="flex items-center gap-2">
            <a-switch v-model:checked="formState.is_active" />
            <span>{{ formState.is_active ? t('organizations.form.active') : t('organizations.form.inactive') }}</span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
