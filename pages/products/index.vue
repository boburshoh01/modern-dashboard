<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('products.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('common.total') }}: {{ total }} {{ $t('common.items') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Export Buttons -->
        <a-dropdown>
          <a-button>
            {{ $t('common.export') }}
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="csv" @click="handleExportCSV">
                {{ $t('products.exportCSV') }}
              </a-menu-item>
              <a-menu-item key="excel" @click="handleExportExcel">
                {{ $t('products.exportExcel') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- Add Product Button -->
        <a-button type="primary" @click="openCreateModal">
          <PlusOutlined />
          {{ $t('products.addProduct') }}
        </a-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <a-input-search
          v-model:value="searchQuery"
          :placeholder="$t('common.search') + '...'"
          allow-clear
          @search="handleSearch"
        />

        <!-- Category Filter -->
        <a-select
          v-model:value="selectedCategory"
          :placeholder="$t('products.category')"
          allow-clear
          @change="handleCategoryChange"
        >
          <a-select-option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
            {{ cat.name }}
          </a-select-option>
        </a-select>

        <!-- Sort By -->
        <a-select
          v-model:value="sortBy"
          :placeholder="$t('common.sortBy') || 'Sort by'"
          allow-clear
          @change="handleSortChange"
        >
          <a-select-option value="price">{{ $t('products.price') }}</a-select-option>
          <a-select-option value="rating">{{ $t('products.rating') }}</a-select-option>
          <a-select-option value="stock">{{ $t('products.stock') }}</a-select-option>
          <a-select-option value="title">{{ $t('products.productName') }}</a-select-option>
        </a-select>

        <!-- Clear Filters -->
        <a-button @click="handleClearFilters">
          {{ $t('common.clear') }}
        </a-button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="card overflow-hidden">
      <a-table
        :columns="columns"
        :data-source="products"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        row-key="id"
        :scroll="{ x: 1500 }"
        @change="handleTableChange"
      >
        <!-- Thumbnail -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'thumbnail'">
            <img
              :src="record.thumbnail"
              :alt="record.title"
              class="w-12 h-12 rounded-lg object-cover"
            />
          </template>

          <!-- Title & Description -->
          <template v-else-if="column.key === 'title'">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ record.title }}</p>
              <p class="text-sm text-gray-500 truncate max-w-xs">{{ record.description }}</p>
            </div>
          </template>

          <!-- Price -->
          <template v-else-if="column.key === 'price'">
            <div>
              <span class="font-medium">${{ record.price }}</span>
              <span v-if="record.discountPercentage > 0" class="ml-2 text-sm text-success-500">
                -{{ record.discountPercentage }}%
              </span>
            </div>
          </template>

          <!-- Rating -->
          <template v-else-if="column.key === 'rating'">
            <a-rate :value="record.rating" disabled allow-half :count="5" />
            <span class="ml-2 text-sm text-gray-500">{{ record.rating }}</span>
          </template>

          <!-- Stock & Availability -->
          <template v-else-if="column.key === 'stock'">
            <div>
              <span>{{ record.stock }}</span>
              <a-tag
                :color="getStockStatusColor(record.availabilityStatus)"
                class="ml-2"
              >
                {{ record.availabilityStatus }}
              </a-tag>
            </div>
          </template>

          <!-- Category -->
          <template v-else-if="column.key === 'category'">
            <a-tag color="blue">{{ record.category }}</a-tag>
          </template>

          <!-- Actions -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-tooltip :title="$t('common.view') || 'View'">
                <a-button type="text" size="small" @click="viewProduct(record)">
                  <EyeOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip :title="$t('common.edit')">
                <a-button type="text" size="small" @click="editProduct(record)">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
              <a-popconfirm
                :title="$t('products.deleteConfirm')"
                @confirm="deleteProduct(record.id)"
              >
                <a-tooltip :title="$t('common.delete')">
                  <a-button type="text" danger size="small">
                    <DeleteOutlined />
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedRowKeys.length > 0" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div class="card p-4 flex items-center gap-4 shadow-lg">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ selectedRowKeys.length }} {{ $t('common.selected') || 'selected' }}
        </span>
        <a-button danger @click="handleBulkDelete">
          {{ $t('products.bulkDelete') }}
        </a-button>
        <a-button @click="selectedRowKeys = []">
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </div>

    <!-- Product Modal -->
    <ProductFormModal
      v-model:open="modalVisible"
      :product="currentProduct"
      :mode="modalMode"
      @success="handleModalSuccess"
    />

    <!-- Product Detail Drawer -->
    <ProductDetailDrawer
      v-model:open="drawerVisible"
      :product="currentProduct"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  DownOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import type { TableColumnType, TablePaginationConfig } from 'ant-design-vue'
import type { Product } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { showSuccess, showError } = useNotification()
const { exportToCSV, exportToExcel } = useExport()

const productsStore = useProductsStore()
const { products, total, loading, categories } = storeToRefs(productsStore)

// State
const searchQuery = ref('')
const selectedCategory = ref<string>()
const sortBy = ref<string>()
const selectedRowKeys = ref<number[]>([])
const modalVisible = ref(false)
const drawerVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const currentProduct = ref<Product | null>(null)

// Table columns
const columns: TableColumnType[] = [
  {
    title: '',
    key: 'thumbnail',
    width: 80,
    fixed: 'left'
  },
  {
    title: t('products.productName'),
    key: 'title',
    dataIndex: 'title',
    width: 250,
    sorter: true
  },
  {
    title: t('products.category'),
    key: 'category',
    dataIndex: 'category',
    width: 150
  },
  {
    title: t('products.price'),
    key: 'price',
    dataIndex: 'price',
    width: 150,
    sorter: true
  },
  {
    title: t('products.rating'),
    key: 'rating',
    dataIndex: 'rating',
    width: 200,
    sorter: true
  },
  {
    title: t('products.stock'),
    key: 'stock',
    dataIndex: 'stock',
    width: 180,
    sorter: true
  },
  {
    title: t('products.brand'),
    key: 'brand',
    dataIndex: 'brand',
    width: 120
  },
  {
    title: t('common.actions'),
    key: 'actions',
    width: 150,
    fixed: 'right'
  }
]

// Pagination
const pagination = computed<TablePaginationConfig>(() => ({
  current: productsStore.pagination.page,
  pageSize: productsStore.pagination.pageSize,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total, range) => `${range[0]}-${range[1]} ${t('common.of')} ${total}`
}))

// Row selection
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  }
}

// Methods
const handleSearch = (value: string) => {
  productsStore.setFilters({ search: value })
}

const handleCategoryChange = (value: string) => {
  productsStore.setFilters({ category: value })
}

const handleSortChange = (value: string) => {
  productsStore.setFilters({ sortBy: value as 'price' | 'rating' | 'stock' | 'title' })
}

const handleClearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = undefined
  sortBy.value = undefined
  productsStore.clearFilters()
}

const handleTableChange = (
  pag: TablePaginationConfig,
  _filters: Record<string, unknown>,
  sorter: { field?: string; order?: 'ascend' | 'descend' }
) => {
  if (pag.current && pag.pageSize) {
    productsStore.setPage(pag.current)
    productsStore.setPageSize(pag.pageSize)
  }

  if (sorter.field) {
    productsStore.setFilters({
      sortBy: sorter.field as 'price' | 'rating' | 'stock' | 'title',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
    })
  }
}

const openCreateModal = () => {
  currentProduct.value = null
  modalMode.value = 'create'
  modalVisible.value = true
}

const viewProduct = (product: Product) => {
  currentProduct.value = product
  drawerVisible.value = true
}

const editProduct = (product: Product) => {
  currentProduct.value = product
  modalMode.value = 'edit'
  modalVisible.value = true
}

const deleteProduct = async (id: number) => {
  const result = await productsStore.deleteProduct(id)
  if (result.success) {
    showSuccess(t('products.deleteSuccess'))
  } else {
    showError(result.error || 'Failed to delete')
  }
}

const handleBulkDelete = async () => {
  const success = await productsStore.deleteSelectedProducts()
  if (success) {
    showSuccess(t('products.deleteSuccess'))
    selectedRowKeys.value = []
  } else {
    showError('Failed to delete some products')
  }
}

const handleModalSuccess = () => {
  modalVisible.value = false
  productsStore.fetchProducts()
}

const handleExportCSV = () => {
  exportToCSV(products.value, {
    filename: 'products',
    columns: [
      { key: 'id', title: 'ID' },
      { key: 'title', title: 'Title' },
      { key: 'category', title: 'Category' },
      { key: 'price', title: 'Price' },
      { key: 'stock', title: 'Stock' },
      { key: 'rating', title: 'Rating' }
    ]
  })
}

const handleExportExcel = () => {
  exportToExcel(products.value, {
    filename: 'products',
    columns: [
      { key: 'id', title: 'ID' },
      { key: 'title', title: 'Title' },
      { key: 'category', title: 'Category' },
      { key: 'price', title: 'Price' },
      { key: 'stock', title: 'Stock' },
      { key: 'rating', title: 'Rating' }
    ]
  })
}

const getStockStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'In Stock': 'green',
    'Low Stock': 'orange',
    'Out of Stock': 'red'
  }
  return colors[status] || 'default'
}

// Fetch data on mount
onMounted(() => {
  productsStore.fetchProducts()
  productsStore.fetchCategories()
})
</script>
