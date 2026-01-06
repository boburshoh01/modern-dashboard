<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('users.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('common.total') }}: {{ total }} {{ $t('common.items') }}
        </p>
      </div>

      <a-button type="primary" @click="openCreateModal">
        <PlusOutlined />
        {{ $t('users.addUser') }}
      </a-button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <a-input-search
          v-model:value="searchQuery"
          :placeholder="$t('common.search') + '...'"
          allow-clear
          @search="handleSearch"
        />

        <!-- Gender Filter -->
        <a-select
          v-model:value="selectedGender"
          :placeholder="$t('users.gender')"
          allow-clear
          @change="handleGenderChange"
        >
          <a-select-option value="male">{{ $t('users.male') }}</a-select-option>
          <a-select-option value="female">{{ $t('users.female') }}</a-select-option>
        </a-select>

        <!-- Role Filter -->
        <a-select
          v-model:value="selectedRole"
          :placeholder="$t('users.role')"
          allow-clear
        >
          <a-select-option value="admin">{{ $t('users.admin') }}</a-select-option>
          <a-select-option value="moderator">{{ $t('users.moderator') }}</a-select-option>
          <a-select-option value="user">{{ $t('users.user') }}</a-select-option>
        </a-select>

        <!-- Sort By -->
        <a-select
          v-model:value="sortBy"
          :placeholder="$t('common.sortBy') || 'Sort by'"
          allow-clear
          @change="handleSortChange"
        >
          <a-select-option value="firstName">{{ $t('users.firstName') }}</a-select-option>
          <a-select-option value="lastName">{{ $t('users.lastName') }}</a-select-option>
          <a-select-option value="age">{{ $t('users.age') }}</a-select-option>
          <a-select-option value="email">{{ $t('users.email') }}</a-select-option>
        </a-select>

        <!-- Clear Filters -->
        <a-button @click="handleClearFilters">
          {{ $t('common.clear') }}
        </a-button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card overflow-hidden">
      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        row-key="id"
        :scroll="{ x: 1400 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- User Info -->
          <template v-if="column.key === 'user'">
            <div class="flex items-center gap-3">
              <img
                :src="record.image"
                :alt="record.firstName"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ record.firstName }} {{ record.lastName }}
                </p>
                <p class="text-sm text-gray-500">@{{ record.username }}</p>
              </div>
            </div>
          </template>

          <!-- Contact -->
          <template v-else-if="column.key === 'contact'">
            <div>
              <p class="text-sm">{{ record.email }}</p>
              <p class="text-sm text-gray-500">{{ record.phone }}</p>
            </div>
          </template>

          <!-- Gender -->
          <template v-else-if="column.key === 'gender'">
            <a-tag :color="record.gender === 'male' ? 'blue' : 'pink'">
              {{ $t(`users.${record.gender}`) }}
            </a-tag>
          </template>

          <!-- Address -->
          <template v-else-if="column.key === 'address'">
            <div class="text-sm">
              <p>{{ record.address?.city }}, {{ record.address?.state }}</p>
              <p class="text-gray-500">{{ record.address?.country }}</p>
            </div>
          </template>

          <!-- Company -->
          <template v-else-if="column.key === 'company'">
            <div v-if="record.company" class="text-sm">
              <p class="font-medium">{{ record.company.name }}</p>
              <p class="text-gray-500">{{ record.company.title }}</p>
            </div>
            <span v-else class="text-gray-400">-</span>
          </template>

          <!-- Role -->
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ $t(`users.${record.role}`) }}
            </a-tag>
          </template>

          <!-- Status -->
          <template v-else-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 'active'"
              :loading="togglingStatus === record.id"
              @change="toggleUserStatus(record)"
            />
          </template>

          <!-- Actions -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-tooltip :title="$t('common.view') || 'View'">
                <a-button type="text" size="small" @click="viewUser(record)">
                  <EyeOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip :title="$t('common.edit')">
                <a-button type="text" size="small" @click="editUser(record)">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
              <a-popconfirm
                :title="$t('users.deleteConfirm')"
                @confirm="deleteUser(record.id)"
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

    <!-- User Modal -->
    <UserFormModal
      v-model:open="modalVisible"
      :user="currentUser"
      :mode="modalMode"
      @success="handleModalSuccess"
    />

    <!-- User Detail Drawer -->
    <UserDetailDrawer
      v-model:open="drawerVisible"
      :user="currentUser"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import type { TableColumnType, TablePaginationConfig } from 'ant-design-vue'
import type { User } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { showSuccess, showError } = useNotification()

const usersStore = useUsersStore()
const { users, total, loading } = storeToRefs(usersStore)

// State
const searchQuery = ref('')
const selectedGender = ref<string>()
const selectedRole = ref<string>()
const sortBy = ref<string>()
const selectedRowKeys = ref<number[]>([])
const modalVisible = ref(false)
const drawerVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const currentUser = ref<User | null>(null)
const togglingStatus = ref<number | null>(null)

// Table columns
const columns: TableColumnType[] = [
  {
    title: t('users.user') || 'User',
    key: 'user',
    width: 250,
    fixed: 'left'
  },
  {
    title: t('users.contact') || 'Contact',
    key: 'contact',
    width: 220
  },
  {
    title: t('users.age'),
    key: 'age',
    dataIndex: 'age',
    width: 80,
    sorter: true
  },
  {
    title: t('users.gender'),
    key: 'gender',
    width: 100
  },
  {
    title: t('users.address'),
    key: 'address',
    width: 180
  },
  {
    title: t('users.company'),
    key: 'company',
    width: 180
  },
  {
    title: t('users.role'),
    key: 'role',
    width: 120
  },
  {
    title: t('users.status'),
    key: 'status',
    width: 100
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
  current: usersStore.pagination.page,
  pageSize: usersStore.pagination.pageSize,
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
  usersStore.setFilters({ search: value })
}

const handleGenderChange = (value: string) => {
  usersStore.setFilters({ gender: value })
}

const handleSortChange = (value: string) => {
  usersStore.setFilters({ sortBy: value as 'firstName' | 'lastName' | 'age' | 'email' })
}

const handleClearFilters = () => {
  searchQuery.value = ''
  selectedGender.value = undefined
  selectedRole.value = undefined
  sortBy.value = undefined
  usersStore.clearFilters()
}

const handleTableChange = (
  pag: TablePaginationConfig,
  _filters: Record<string, unknown>,
  sorter: { field?: string; order?: 'ascend' | 'descend' }
) => {
  if (pag.current && pag.pageSize) {
    usersStore.setPage(pag.current)
    usersStore.setPageSize(pag.pageSize)
  }

  if (sorter.field) {
    usersStore.setFilters({
      sortBy: sorter.field as 'firstName' | 'lastName' | 'age' | 'email',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
    })
  }
}

const openCreateModal = () => {
  currentUser.value = null
  modalMode.value = 'create'
  modalVisible.value = true
}

const viewUser = (user: User) => {
  currentUser.value = user
  drawerVisible.value = true
}

const editUser = (user: User) => {
  currentUser.value = user
  modalMode.value = 'edit'
  modalVisible.value = true
}

const deleteUser = async (id: number) => {
  const result = await usersStore.deleteUser(id)
  if (result.success) {
    showSuccess(t('users.deleteSuccess'))
  } else {
    showError(result.error || 'Failed to delete')
  }
}

const toggleUserStatus = async (user: User) => {
  togglingStatus.value = user.id
  await usersStore.toggleUserStatus(user.id)
  togglingStatus.value = null
}

const handleModalSuccess = () => {
  modalVisible.value = false
  usersStore.fetchUsers()
}

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    moderator: 'orange',
    user: 'blue'
  }
  return colors[role] || 'default'
}

// Fetch data on mount
onMounted(() => {
  usersStore.fetchUsers()
})
</script>
