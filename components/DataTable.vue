<template>
  <div class="card overflow-hidden">
    <!-- Table Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <span v-if="selectedRowKeys.length > 0" class="text-sm text-gray-500">
          {{ selectedRowKeys.length }} {{ $t('common.selected') || 'selected' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Search Input -->
        <a-input-search
          v-if="searchable"
          v-model:value="searchValue"
          :placeholder="$t('common.search') + '...'"
          style="width: 200px"
          allow-clear
          @search="handleSearch"
          @change="handleSearchChange"
        />

        <!-- Bulk Actions -->
        <slot name="bulk-actions" :selected-keys="selectedRowKeys">
          <a-button
            v-if="selectedRowKeys.length > 0"
            danger
            @click="handleBulkDelete"
          >
            {{ $t('products.bulkDelete') }}
          </a-button>
        </slot>

        <!-- Custom Actions -->
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="paginationConfig"
      :row-selection="selectable ? rowSelection : undefined"
      :row-key="rowKey"
      :scroll="{ x: scrollX }"
      @change="handleTableChange"
    >
      <!-- Dynamic Slots -->
      <template v-for="slot in Object.keys($slots).filter(s => s.startsWith('column-'))" :key="slot" #[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps" />
      </template>

      <!-- Status Column -->
      <template #bodyCell="{ column, record }">
        <slot name="bodyCell" :column="column" :record="record">
          <!-- Default rendering -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <slot name="row-actions" :record="record">
              <a-space>
                <a-button type="link" size="small" @click="$emit('view', record)">
                  {{ $t('common.view') || 'View' }}
                </a-button>
                <a-button type="link" size="small" @click="$emit('edit', record)">
                  {{ $t('common.edit') }}
                </a-button>
                <a-popconfirm
                  :title="$t('common.deleteConfirm') || 'Are you sure?'"
                  @confirm="$emit('delete', record)"
                >
                  <a-button type="link" danger size="small">
                    {{ $t('common.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </slot>
          </template>
        </slot>
      </template>

      <!-- Empty State -->
      <template #emptyText>
        <div class="py-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="mt-4 text-gray-500 dark:text-gray-400">{{ $t('common.noData') }}</p>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnType, TablePaginationConfig } from 'ant-design-vue'

interface Props {
  title?: string
  columns: TableColumnType[]
  dataSource: Record<string, unknown>[]
  loading?: boolean
  total?: number
  pageSize?: number
  currentPage?: number
  rowKey?: string
  searchable?: boolean
  selectable?: boolean
  scrollX?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  loading: false,
  total: 0,
  pageSize: 10,
  currentPage: 1,
  rowKey: 'id',
  searchable: true,
  selectable: true,
  scrollX: 1200
})

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'page-change', page: number, pageSize: number): void
  (e: 'sort-change', field: string, order: 'ascend' | 'descend' | null): void
  (e: 'selection-change', keys: (string | number)[]): void
  (e: 'bulk-delete', keys: (string | number)[]): void
  (e: 'view', record: Record<string, unknown>): void
  (e: 'edit', record: Record<string, unknown>): void
  (e: 'delete', record: Record<string, unknown>): void
}>()

const searchValue = ref('')
const selectedRowKeys = ref<(string | number)[]>([])

const paginationConfig = computed<TablePaginationConfig>(() => ({
  current: props.currentPage,
  pageSize: props.pageSize,
  total: props.total,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total}`
}))

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[]) => {
    selectedRowKeys.value = keys
    emit('selection-change', keys)
  }
}))

const handleSearch = (value: string) => {
  emit('search', value)
}

const handleSearchChange = () => {
  if (!searchValue.value) {
    emit('search', '')
  }
}

const handleTableChange = (
  pagination: TablePaginationConfig,
  _filters: Record<string, unknown>,
  sorter: { field?: string; order?: 'ascend' | 'descend' | null }
) => {
  if (pagination.current && pagination.pageSize) {
    emit('page-change', pagination.current, pagination.pageSize)
  }
  if (sorter.field) {
    emit('sort-change', sorter.field, sorter.order || null)
  }
}

const handleBulkDelete = () => {
  emit('bulk-delete', selectedRowKeys.value)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'green',
    inactive: 'default',
    suspended: 'red',
    'In Stock': 'green',
    'Low Stock': 'orange',
    'Out of Stock': 'red'
  }
  return colors[status] || 'default'
}

// Expose methods
defineExpose({
  clearSelection: () => {
    selectedRowKeys.value = []
  }
})
</script>
