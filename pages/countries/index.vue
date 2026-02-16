<script setup lang="ts">
import { PlusOutlined, EditOutlined, SearchOutlined, GlobalOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons-vue"
import { useCountriesStore } from "~/stores/countries"
import { useNotification } from "~/composables/useNotification"
import type { CountryCreateDto, CountryName } from "~/types/country"
import type { TablePaginationConfig } from 'ant-design-vue';

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const countriesStore = useCountriesStore()
const { success, error: showError } = useNotification()
const { t, locale } = useI18n()

// State
const isModalVisible = ref(false)
const modalTitle = ref(t('countries.addCountry'))
const isEditing = ref(false)
const editingCode = ref<string | null>(null)

// Pagination & Search
const searchQuery = ref("")
const filters = reactive({
  key: undefined as string | undefined,
  value: undefined as string | undefined,
})
const currentPage = ref(1)
const pageSize = ref(10)

const pagination = computed(() => ({
  total: countriesStore.countries.length, // Client-side total
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
}))

const formState = reactive<CountryCreateDto>({
  code: "",
  name: {
    en: "",
    kk: "",
    ru: "",
    uz: "",
  },
})

// Localization Helpers
const expandLanguage = ref(false)
const supportedLanguages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'ru', name: "Русский" },
  { code: 'en', name: "English" },
  { code: 'kk', name: "Qoraqalpoq" },
]

function getLocalizedName(nameObj: CountryName) {
  if (!nameObj) return ""
  return nameObj[locale.value as keyof CountryName] || nameObj.uz || nameObj.en || ""
}

// Table columns
const columns = computed(() => [
  {
    title: t('countries.code'),
    dataIndex: "code",
    key: "code",
    width: 100,
  },
  {
    title: t('countries.name'),
    key: "name",
  },
  {
    title: t('countries.action'),
    key: "actions",
    width: 150,
  },
])

async function fetchData() {
  await countriesStore.fetchCountries()
}

function handleTableChange(pag: TablePaginationConfig) {
  currentPage.value = pag.current || 1
  pageSize.value = pag.pageSize || 10
}

function resetFilters() {
  filters.key = undefined
  filters.value = undefined
  searchQuery.value = ""
  currentPage.value = 1
}

// Watch search and filters
const filteredCountries = computed(() => {
    let data = countriesStore.countries || []
    
    // Filter by specific key/value
    if (filters.key && filters.value) {
        const val = filters.value.toLowerCase()
        data = data.filter(c => {
            if (filters.key === 'code') return c.code.toLowerCase().includes(val)
            if (filters.key === 'name') return getLocalizedName(c.name).toLowerCase().includes(val)
            return false
        })
    }

    // Global Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(c => 
            c.code.toLowerCase().includes(query) || 
            getLocalizedName(c.name).toLowerCase().includes(query)
        )
    }
    
    // Client-side pagination since API seems to be list-all for now
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return data.slice(start, end)
})

// Data fetching
onMounted(() => {
  fetchData()
})

// Handlers
function handleAdd() {
  isEditing.value = false
  editingCode.value = null
  resetForm()
  modalTitle.value = t('countries.addCountry')
  expandLanguage.value = false
  isModalVisible.value = true
}

function handleEdit(record: any) {
  isEditing.value = true
  editingCode.value = record.code
  Object.assign(formState, {
    code: record.code,
    name: { ...record.name },
  })
  modalTitle.value = t('countries.editCountry')
  expandLanguage.value = false
  isModalVisible.value = true
}

function resetForm() {
  formState.code = ""
  formState.name = { en: "", kk: "", ru: "", uz: "" }
}

async function handleOk() {
  if (!formState.code) {
      showError(t('validation.required', { field: t('countries.code') }), t('countries.messages.validationCode'))
      return
  }
  if (!formState.name[locale.value as keyof CountryName]) {
       showError(t('validation.required', { field: t('countries.name') }), t('countries.messages.validationName'))
      return
  }

  let ok = false
  if (isEditing.value) {
    ok = await countriesStore.updateCountry(formState)
  } else {
    ok = await countriesStore.createCountry(formState)
  }

  if (ok) {
    success(t('common.success'), isEditing.value ? t('countries.messages.updated') : t('countries.messages.created'))
    isModalVisible.value = false
    resetForm()
  } else {
    showError(t('common.error'), isEditing.value ? t('countries.messages.updateError') : t('countries.messages.createError'))
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-3xl font-bold text-[#202224] dark:text-white">{{ t('countries.title') }}</h1>
      <a-button type="primary" size="large" @click="handleAdd" class="bg-[#4880ff] h-11 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-sm border-none">
        <PlusOutlined /> {{ t('countries.addCountry') }}
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
        <a-select-option value="name">{{ t('countries.name') }}</a-select-option>
        <a-select-option value="code">{{ t('countries.code') }}</a-select-option>
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
          :placeholder="t('countries.search')"
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
      :data-source="filteredCountries" 
      :loading="countriesStore.loading"
      :pagination="{
          ...pagination,
          total: countriesStore.countries.length // Override total for client-side pagination
      }"
      row-key="code"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <span class="font-medium">{{ getLocalizedName(record.name) }}</span>
        </template>
        
        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <a-button type="primary" ghost size="small" @click="handleEdit(record)">
              <EditOutlined />
            </a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- Modal -->
    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      :confirm-loading="countriesStore.loading"
      width="600px"
      @ok="handleOk"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('countries.code')" required>
            <a-input 
            v-model:value="formState.code" 
            :placeholder="t('countries.code')"
            :disabled="isEditing"
            />
        </a-form-item>

        <a-form-item :label="t('countries.name')" required>
           <div class="relative">
             <a-input 
               v-model:value="formState.name[locale as keyof CountryName]" 
               :placeholder="`${t('countries.name')} (${locale.toUpperCase()})`"
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
                    <a-input v-model:value="formState.name[lang.code as keyof CountryName]" />
                  </div>
                </div>
             </div>
           </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
