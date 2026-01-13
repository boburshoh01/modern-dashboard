import { defineStore } from 'pinia'

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'An unknown error occurred'
}

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalSales: number
  totalPending: number
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      totalSales: 0,
      totalPending: 0,
    } as DashboardStats,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    dashboardStats: (state) => state.stats,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },

  actions: {
    async fetchDashboardStats() {
      this.loading = true
      this.error = null
      const { get } = useApi()

      try {
        const [usersResponse, productsResponse, postsResponse] = await Promise.all([
          get<{ total: number }>('/users?limit=0'),
          get<{ products: any[]; total: number }>('/products?limit=30'),
          get<{ total: number }>('/posts?limit=0'),
        ])

        this.stats.totalUsers = usersResponse.data.total
        this.stats.totalOrders = productsResponse.data.total
        this.stats.totalPending = postsResponse.data.total

        const products = productsResponse.data.products
        const totalSales = products.reduce((sum: number, product: any) => {
          return sum + (product.price * product.stock)
        }, 0)
        this.stats.totalSales = Math.round(totalSales)
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to fetch dashboard statistics'
        throw err
      } finally {
        this.loading = false
      }
    },

    resetStats() {
      this.stats = {
        totalUsers: 0,
        totalOrders: 0,
        totalSales: 0,
        totalPending: 0,
      }
      this.error = null
    },
  },
})
