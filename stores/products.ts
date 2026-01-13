import { defineStore } from 'pinia'
import type { Product, ProductResponse, Category } from '~/types'

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'An unknown error occurred'
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    total: 0,
    skip: 0,
    limit: 10,
    loading: false,
    error: null as string | null,
    currentProduct: null as Product | null,
    categories: [] as Category[],
  }),

  actions: {
    async fetchProducts(params: { limit?: number; skip?: number; q?: string; category?: string } = {}) {
      this.loading = true
      this.error = null
      const { get } = useApi()

      try {
        let url = '/products'

        if (params.q) {
          url = `/products/search?q=${params.q}`
        }
        else if (params.category) {
          url = `/products/category/${params.category}`
        }

        const queryParams: any = {
          limit: params.limit || this.limit,
          skip: params.skip !== undefined ? params.skip : this.skip,
        }

        const response = await get<ProductResponse>(url, { params: queryParams })

        this.products = response.data.products
        this.total = response.data.total
        this.skip = response.data.skip
        this.limit = response.data.limit
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to fetch products'
        console.error('Error fetching products:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id: number) {
      this.loading = true
      this.error = null
      const { get } = useApi()

      try {
        const response = await get<Product>(`/products/${id}`)
        this.currentProduct = response.data
        return response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to fetch product'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      const { get } = useApi()
      try {
        const response = await get<Category[]>('/products/categories')
        this.categories = response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to fetch categories'
        console.error('Error fetching categories:', err)
        throw err
      }
    },

    async addProduct(productData: Partial<Product>) {
      this.loading = true
      const { post } = useApi()
      try {
        const response = await post<Product>('/products/add', productData)
        this.products.unshift(response.data)
        return response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to add product'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, productData: Partial<Product>) {
      this.loading = true
      const { put } = useApi()
      try {
        const response = await put<Product>(`/products/${id}`, productData)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        this.currentProduct = response.data
        return response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to update product'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      this.loading = true
      const { delete: del } = useApi()
      try {
        await del(`/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to delete product'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
