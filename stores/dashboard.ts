import { defineStore } from 'pinia'
import type { DashboardStats, ActivityItem, ChartData } from '~/types'
import type { ProductsResponse, UsersResponse, PostsResponse } from '~/types/api'

interface DashboardState {
  stats: DashboardStats
  recentActivity: ActivityItem[]
  salesChartData: ChartData | null
  categoryChartData: ChartData | null
  loading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalPosts: 0,
      totalRevenue: 0
    },
    recentActivity: [],
    salesChartData: null,
    categoryChartData: null,
    loading: false,
    error: null
  }),

  getters: {
    getStats: (state) => state.stats,
    getRecentActivity: (state) => state.recentActivity,
    getSalesChartData: (state) => state.salesChartData,
    getCategoryChartData: (state) => state.categoryChartData,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchStats() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()

        // Fetch all stats in parallel
        const [usersRes, productsRes, postsRes] = await Promise.all([
          $fetch<UsersResponse>(`${config.public.apiBase}/users?limit=0`),
          $fetch<ProductsResponse>(`${config.public.apiBase}/products?limit=0`),
          $fetch<PostsResponse>(`${config.public.apiBase}/posts?limit=0`)
        ])

        this.stats = {
          totalUsers: usersRes.total,
          totalProducts: productsRes.total,
          totalPosts: postsRes.total,
          totalRevenue: this.calculateRevenue(productsRes.products)
        }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to fetch dashboard stats'
      } finally {
        this.loading = false
      }
    },

    calculateRevenue(products: { price: number; stock: number }[]): number {
      return products.reduce((sum, p) => sum + p.price * p.stock, 0)
    },

    async fetchRecentActivity() {
      try {
        const config = useRuntimeConfig()

        // Fetch recent users and products
        const [usersRes, productsRes] = await Promise.all([
          $fetch<UsersResponse>(`${config.public.apiBase}/users?limit=5`),
          $fetch<ProductsResponse>(`${config.public.apiBase}/products?limit=5`)
        ])

        const activities: ActivityItem[] = []

        // Add user activities
        usersRes.users.forEach((user, index) => {
          activities.push({
            id: index + 1,
            type: 'user',
            action: 'joined',
            description: `${user.firstName} ${user.lastName} joined the platform`,
            timestamp: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            user: {
              name: `${user.firstName} ${user.lastName}`,
              avatar: user.image
            }
          })
        })

        // Add product activities
        productsRes.products.forEach((product, index) => {
          activities.push({
            id: index + 100,
            type: 'product',
            action: 'added',
            description: `New product "${product.title}" was added`,
            timestamp: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString()
          })
        })

        // Sort by timestamp
        activities.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        this.recentActivity = activities.slice(0, 10)
      } catch (error) {
        console.error('Failed to fetch recent activity:', error)
      }
    },

    async fetchChartData() {
      try {
        const config = useRuntimeConfig()
        const productsRes = await $fetch<ProductsResponse>(
          `${config.public.apiBase}/products?limit=100`
        )

        // Generate sales chart data (mock monthly data)
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
        const salesData = months.map(() => Math.floor(Math.random() * 50000) + 10000)

        this.salesChartData = {
          labels: months,
          datasets: [
            {
              label: 'Sales',
              data: salesData,
              borderColor: '#1677ff',
              backgroundColor: 'rgba(22, 119, 255, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        }

        // Generate category chart data
        const categoryCount: Record<string, number> = {}
        productsRes.products.forEach((product) => {
          categoryCount[product.category] =
            (categoryCount[product.category] || 0) + 1
        })

        const categoryLabels = Object.keys(categoryCount).slice(0, 6)
        const categoryData = categoryLabels.map((cat) => categoryCount[cat])

        this.categoryChartData = {
          labels: categoryLabels,
          datasets: [
            {
              label: 'Products by Category',
              data: categoryData,
              backgroundColor: [
                '#1677ff',
                '#52c41a',
                '#faad14',
                '#f5222d',
                '#722ed1',
                '#13c2c2'
              ]
            }
          ]
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      }
    },

    async fetchAllDashboardData() {
      await Promise.all([
        this.fetchStats(),
        this.fetchRecentActivity(),
        this.fetchChartData()
      ])
    }
  }
})
