<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('dashboard.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('dashboard.welcome') }}, {{ authStore.userFullName }}!
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        :title="$t('dashboard.totalUsers')"
        :value="stats.totalUsers"
        :icon="UserOutlined"
        :change="12.5"
        type="primary"
      />
      <StatsCard
        :title="$t('dashboard.totalProducts')"
        :value="stats.totalProducts"
        :icon="ShoppingOutlined"
        :change="8.2"
        type="success"
      />
      <StatsCard
        :title="$t('dashboard.totalPosts')"
        :value="stats.totalPosts"
        :icon="FileTextOutlined"
        :change="-2.4"
        type="warning"
      />
      <StatsCard
        :title="$t('dashboard.totalRevenue')"
        :value="stats.totalRevenue"
        :icon="DollarOutlined"
        :change="15.3"
        type="error"
        prefix="$"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('dashboard.salesChart') }}
        </h3>
        <div class="h-80">
          <Line v-if="salesChartData" :data="salesChartData" :options="lineChartOptions" />
          <div v-else class="h-full flex-center">
            <a-spin />
          </div>
        </div>
      </div>

      <!-- Category Chart -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('dashboard.categoryChart') }}
        </h3>
        <div class="h-80">
          <Doughnut v-if="categoryChartData" :data="categoryChartData" :options="doughnutChartOptions" />
          <div v-else class="h-full flex-center">
            <a-spin />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('dashboard.recentActivity') }}
      </h3>

      <div class="space-y-4">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full flex-center"
            :class="getActivityIconBg(activity.type)"
          >
            <component :is="getActivityIcon(activity.type)" class="w-5 h-5" :class="getActivityIconColor(activity.type)" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900 dark:text-white">
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(activity.timestamp) }}
            </p>
          </div>
          <img
            v-if="activity.user?.avatar"
            :src="activity.user.avatar"
            :alt="activity.user.name"
            class="w-8 h-8 rounded-full object-cover"
          />
        </div>

        <EmptyState
          v-if="recentActivity.length === 0"
          :title="$t('common.noData')"
          :description="$t('common.noResults')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons-vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'
import { Line, Doughnut } from 'vue-chartjs'
import type { ActivityItem } from '~/types'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const { stats, recentActivity, salesChartData, categoryChartData } = storeToRefs(dashboardStore)

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const
    }
  }
}

// Activity helpers
const getActivityIcon = (type: ActivityItem['type']) => {
  const icons = {
    user: UserOutlined,
    product: ShoppingOutlined,
    order: DollarOutlined,
    post: FileTextOutlined
  }
  return icons[type]
}

const getActivityIconBg = (type: ActivityItem['type']) => {
  const classes = {
    user: 'bg-primary-100 dark:bg-primary-900/30',
    product: 'bg-success-100 dark:bg-success-900/30',
    order: 'bg-warning-100 dark:bg-warning-900/30',
    post: 'bg-error-100 dark:bg-error-900/30'
  }
  return classes[type]
}

const getActivityIconColor = (type: ActivityItem['type']) => {
  const classes = {
    user: 'text-primary-600 dark:text-primary-400',
    product: 'text-success-600 dark:text-success-400',
    order: 'text-warning-600 dark:text-warning-400',
    post: 'text-error-600 dark:text-error-400'
  }
  return classes[type]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch data on mount
onMounted(() => {
  dashboardStore.fetchAllDashboardData()
})
</script>
