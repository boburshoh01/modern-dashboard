<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <h1
        class="text-3xl font-bold text-[#202224] dark:text-white tracking-tight font-['Nunito_Sans']"
      >
        {{ $t("users.title") }}
      </h1>
      <NuxtLink to="/users/add">
        <a-button
          type="primary"
          size="large"
          class="bg-[#4880ff] h-11 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-sm border-none"
        >
          <PlusOutlined /> {{ $t("users.addUser") }}
        </a-button>
      </NuxtLink>
    </div>

    <div
      class="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm flex flex-wrap items-center gap-4 border border-gray-100 dark:border-dark-border"
    >
      <div class="flex items-center gap-2 whitespace-nowrap">
        <FilterOutlined class="text-gray-400 dark:text-gray-500" />
        <span class="font-bold text-[#202224] dark:text-white">{{
          $t("users.filterBy")
        }}</span>
      </div>

      <a-select
        v-model:value="filters.key"
        placeholder="Field"
        class="w-full sm:w-32 rounded-lg bg-[#F5F6FA] dark:bg-dark-main"
        :bordered="false"
      >
        <a-select-option value="firstName">{{
          $t("users.name")
        }}</a-select-option>
        <a-select-option value="email">{{ $t("users.email") }}</a-select-option>
        <a-select-option value="username">{{
          $t("users.username")
        }}</a-select-option>
        <a-select-option value="role">{{ $t("users.role") }}</a-select-option>
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
        <ReloadOutlined /> {{ $t("users.resetFilter") }}
      </a-button>

      <div class="sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
        <a-input
          v-model:value="searchQuery"
          :placeholder="$t('users.search')"
          class="search-input rounded-full w-full sm:w-64 h-[38px]"
          :bordered="false"
          @press-enter="handleSearch"
        >
          <template #prefix><SearchOutlined class="text-gray-400" /></template>
        </a-input>
      </div>
    </div>

    <div
      class="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden min-w-0"
    >
      <a-table
        :columns="columns"
        :data-source="usersStore.users"
        :loading="usersStore.loading"
        :pagination="false"
        :row-key="getRowKey"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex items-center gap-3">
              <a-avatar :src="record.image" :size="40" class="bg-gray-200" />
              <div>
                <div class="font-bold text-[#202224] dark:text-white">
                  {{ record.firstName }} {{ record.lastName }}
                </div>
                <div
                  v-if="record.maidenName"
                  class="text-xs text-gray-400 dark:text-gray-500"
                >
                  {{ record.maidenName }}
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'role'">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold capitalize"
              :class="{
                'bg-purple-100 text-purple-600': record.role === 'admin',
                'bg-blue-100 text-blue-600': record.role === 'moderator',
                'bg-gray-100 text-gray-600': record.role === 'user',
              }"
            >
              {{ record.role }}
            </span>
          </template>

          <template v-else-if="column.key === 'status'">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600"
              >Active</span
            >
          </template>

          <template v-else-if="column.key === 'actions'">
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/users/${record.id}`">
                <a-button
                  type="text"
                  shape="circle"
                  class="bg-gray-50 dark:bg-dark-main hover:bg-gray-100 dark:hover:bg-dark-border text-gray-500 dark:text-gray-300"
                >
                  <EditOutlined />
                </a-button>
              </NuxtLink>
              <a-popconfirm
                title="Are you sure delete this user?"
                @confirm="handleDelete(record.id)"
              >
                <a-button
                  type="text"
                  shape="circle"
                  class="bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                >
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>

      <div
        class="flex justify-end p-6 border-t border-gray-100 dark:border-dark-border"
      >
        <a-pagination
          v-model:current="currentPage"
          :total="usersStore.total"
          :show-size-changer="false"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const usersStore = useUsersStore();
const { success, error } = useNotification();

const searchQuery = ref("");
const filters = reactive({
  key: undefined as string | undefined,
  value: undefined as string | undefined,
});
const currentPage = ref(1);

const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("users.name"),
    key: "name",
    width: 250,
    fixed: "left",
  },
  {
    title: t("users.email"),
    dataIndex: "email",
    key: "email",
    width: 250,
  },
  {
    title: t("users.phone"),
    dataIndex: "phone",
    key: "phone",
    width: 180,
  },
  {
    title: t("users.username"),
    dataIndex: "username",
    key: "username",
    width: 150,
  },
  {
    title: t("users.role"),
    key: "role",
    width: 120,
  },
  {
    title: t("users.status"),
    key: "status",
    width: 120,
  },
  {
    title: t("users.action"),
    key: "actions",
    width: 120,
    fixed: "right",
    align: "center",
  },
]);

const fetchUsers = async () => {
  const skip = (currentPage.value - 1) * 10;
  await usersStore.fetchUsers({
    limit: 10,
    skip,
    search: searchQuery.value,
    key: filters.key,
    value: filters.value,
  });
};

onMounted(() => {
  fetchUsers();
});

const handleSearch = () => {
  currentPage.value = 1;
  filters.key = undefined;
  filters.value = undefined;
  fetchUsers();
};

// Watch filters to fetch automatically
watch(
  () => [filters.key, filters.value],
  () => {
    if (filters.key && filters.value) {
      searchQuery.value = "";
      currentPage.value = 1;
      fetchUsers();
    }
  }
);

const resetFilters = () => {
  filters.key = undefined;
  filters.value = undefined;
  searchQuery.value = "";
  currentPage.value = 1;
  fetchUsers();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchUsers();
};

const handleDelete = async (id: number) => {
  try {
    await usersStore.deleteUser(id);
    success("Deleted", "User deleted successfully");
  } catch (err) {
    console.error(err);
    error("Error", "Failed to delete user");
  }
};

const getRowKey = (record: { id: number }) => record.id;
</script>
