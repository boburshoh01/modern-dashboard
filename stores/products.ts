import type { Category, Product, ProductResponse } from "~/types"
import { defineStore } from "pinia"

export const useProductsStore = defineStore("products", () => {
  const {
    items: products,
    total,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<Product>({
    apiEndpoint: "/products",
    transformResponse: (data) => {
      // Handle standard response or specific product response structure
      if (data && data.products) {
        return { items: data.products as Product[], total: Number(data.total) }
      }
      return { items: [], total: 0 }
    }
  })

  const currentProduct = ref<Product | null>(null)
  const categories = ref<Category[]>([])
  const skip = ref(0)
  const limit = ref(10)
  const api = useApi()

  // Actions
  const fetchProducts = async (params: { limit?: number; skip?: number; q?: string; category?: string } = {}) => {
    // Let's rely on manual fetch for complex cases to be safe, reusing the state.
    loading.value = true
    error.value = null

    try {
      let url = "/products"

      if (params.q) {
        url = `/products/search`
      } else if (params.category) {
        url = `/products/category/${params.category}`
      }

      const queryParams: Record<string, string | number> = {
        limit: params.limit || limit.value,
        skip: params.skip !== undefined ? params.skip : skip.value,
      }

      if (params.q) queryParams.q = params.q // Search query

      const response = await api.get<ProductResponse>(url, { params: queryParams })

      products.value = response.data.products
      total.value = response.data.total
      skip.value = response.data.skip
      limit.value = response.data.limit
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to fetch products"
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Product>(`/products/${id}`)
      currentProduct.value = response.data
      return response.data
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to fetch product"
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    // Keep as is
    try {
      const response = await api.get<Category[]>("/products/categories")
      categories.value = response.data
    } catch (err: unknown) {
      console.error("Error fetching categories:", err)
    }
  }

  return {
    products,
    total,
    skip,
    limit,
    loading,
    error,
    currentProduct,
    categories,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    addProduct: createItem,
    updateProduct: updateItem,
    deleteProduct: deleteItem
  }
})
