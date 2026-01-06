import { defineStore } from 'pinia'
import type { Product, ProductFilters, ProductFormData, ProductCategory } from '~/types'
import type { ProductsResponse } from '~/types/api'

interface ProductsState {
  products: Product[]
  currentProduct: Product | null
  categories: ProductCategory[]
  total: number
  loading: boolean
  error: string | null
  filters: ProductFilters
  pagination: {
    page: number
    pageSize: number
  }
  selectedIds: number[]
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    currentProduct: null,
    categories: [],
    total: 0,
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      sortOrder: 'asc'
    },
    pagination: {
      page: 1,
      pageSize: 10
    },
    selectedIds: []
  }),

  getters: {
    getProducts: (state) => state.products,
    getCurrentProduct: (state) => state.currentProduct,
    getCategories: (state) => state.categories,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalPages: (state) => Math.ceil(state.total / state.pagination.pageSize),
    getSelectedProducts: (state) =>
      state.products.filter((p) => state.selectedIds.includes(p.id)),
    hasSelection: (state) => state.selectedIds.length > 0
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const skip = (this.pagination.page - 1) * this.pagination.pageSize

        let url = `${config.public.apiBase}/products`
        const params = new URLSearchParams()

        params.append('limit', this.pagination.pageSize.toString())
        params.append('skip', skip.toString())

        // Handle search
        if (this.filters.search) {
          url = `${config.public.apiBase}/products/search`
          params.append('q', this.filters.search)
        }
        // Handle category filter
        else if (this.filters.category) {
          url = `${config.public.apiBase}/products/category/${this.filters.category}`
        }

        // Handle sorting
        if (this.filters.sortBy) {
          params.append('sortBy', this.filters.sortBy)
          params.append('order', this.filters.sortOrder || 'asc')
        }

        const response = await $fetch<ProductsResponse>(`${url}?${params.toString()}`)

        this.products = response.products
        this.total = response.total
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to fetch products'
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: number) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<Product>(
          `${config.public.apiBase}/products/${id}`
        )
        this.currentProduct = response
        return response
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to fetch product'
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<ProductCategory[]>(
          `${config.public.apiBase}/products/categories`
        )
        this.categories = response
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },

    async createProduct(data: ProductFormData) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<Product>(
          `${config.public.apiBase}/products/add`,
          {
            method: 'POST',
            body: data
          }
        )

        // Add to local state
        this.products.unshift(response)
        this.total++

        return { success: true, data: response }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to create product'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, data: Partial<ProductFormData>) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<Product>(
          `${config.public.apiBase}/products/${id}`,
          {
            method: 'PUT',
            body: data
          }
        )

        // Update local state
        const index = this.products.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.products[index] = response
        }
        if (this.currentProduct?.id === id) {
          this.currentProduct = response
        }

        return { success: true, data: response }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to update product'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/products/${id}`, {
          method: 'DELETE'
        })

        // Remove from local state
        this.products = this.products.filter((p) => p.id !== id)
        this.total--
        this.selectedIds = this.selectedIds.filter((sid) => sid !== id)

        return { success: true }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to delete product'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteSelectedProducts() {
      const results = await Promise.all(
        this.selectedIds.map((id) => this.deleteProduct(id))
      )
      this.selectedIds = []
      return results.every((r) => r.success)
    },

    setFilters(filters: Partial<ProductFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
      this.fetchProducts()
    },

    clearFilters() {
      this.filters = {
        search: '',
        category: '',
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: undefined,
        sortOrder: 'asc'
      }
      this.pagination.page = 1
      this.fetchProducts()
    },

    setPage(page: number) {
      this.pagination.page = page
      this.fetchProducts()
    },

    setPageSize(size: number) {
      this.pagination.pageSize = size
      this.pagination.page = 1
      this.fetchProducts()
    },

    toggleSelection(id: number) {
      const index = this.selectedIds.indexOf(id)
      if (index === -1) {
        this.selectedIds.push(id)
      } else {
        this.selectedIds.splice(index, 1)
      }
    },

    selectAll() {
      this.selectedIds = this.products.map((p) => p.id)
    },

    clearSelection() {
      this.selectedIds = []
    },

    clearError() {
      this.error = null
    }
  }
})
