<template>
  <div class="app-table-container">
    <a-table
      v-bind="$attrs"
      :loading="loading"
      :data-source="dataSource"
      :columns="columns"
      class="app-table"
      :pagination="paginationConfig"
    >
      <template v-for="slotName in Object.keys($slots)" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template #emptyText>
        <AppEmpty
          v-if="!loading"
          :title="emptyTitle"
          :description="emptyDescription"
        >
          <template #image>
            <slot name="emptyImage" />
          </template>
        </AppEmpty>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from "ant-design-vue";

interface Props {
  loading?: boolean;
  dataSource?: any[];
  columns?: any[];
  emptyTitle?: string;
  emptyDescription?: string;
  hidePagination?: boolean;
  pagination?: TableProps["pagination"];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  dataSource: () => [],
  columns: () => [],
  hidePagination: false,
});

const paginationConfig = computed(() => {
  if (props.hidePagination) return false;

  return {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number) => `Total ${total} items`,
    class: "custom-pagination",
    ...(props.pagination || {}),
  };
});
</script>

<style scoped>
.app-table-container {
  @apply bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-dark-border;
}

:deep(.ant-table) {
  @apply bg-transparent dark:text-gray-300;
}

:deep(.ant-table-thead > tr > th) {
  @apply bg-gray-50/50 dark:bg-dark-main/50 text-[#202224] dark:text-white font-bold py-4 border-b border-gray-100 dark:border-dark-border;
}

:deep(.ant-table-tbody > tr > td) {
  @apply py-4 border-b border-gray-50 dark:border-dark-border/50 transition-colors duration-200;
}

:deep(.ant-table-tbody > tr:hover > td) {
  @apply bg-blue-50/30 dark:bg-blue-900/10;
}

:deep(.custom-pagination) {
  @apply p-4 px-6 mb-0 border-t border-gray-50 dark:border-dark-border;
}

:deep(.ant-pagination-item-active) {
  @apply border-[#4880ff] bg-[#4880ff];
}

:deep(.ant-pagination-item-active a) {
  @apply text-white !important;
}
</style>
