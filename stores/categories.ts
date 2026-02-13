import { defineStore } from "pinia"
import type { Category, CategoryCreateDto, CategoryUpdateDto, CategoryParams, CategoryResponse } from "~/types/category"

export const useCategoriesStore = defineStore("categories", {
    state: () => ({
        categories: [] as Category[],
        total: 0,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchCategories(params?: CategoryParams) {
            this.loading = true
            this.error = null
            try {
                if (params) {
                    const { data } = await useApi().get<CategoryResponse>("/category/paging/list", { params })
                    if (data && Array.isArray(data.items)) {
                        this.categories = data.items
                        this.total = data.total
                    } else {
                        this.categories = []
                        this.total = 0
                    }
                } else {
                    const { data } = await useApi().get<Category[]>("/category/list")
                    if (data && Array.isArray(data)) {
                        this.categories = data
                        this.total = data.length
                    } else {
                        // Handle case where API might return wrapped object even for list
                        this.categories = []
                        this.total = 0
                    }
                }
            } catch (err: any) {
                this.error = err.message || "Failed to fetch categories"
                console.error("Error fetching categories:", err)
                this.categories = []
            } finally {
                this.loading = false
            }
        },

        async createCategory(payload: CategoryCreateDto) {
            this.loading = true
            this.error = null
            try {
                await useApi().post("/category/create", payload)
                await this.fetchCategories()
                return true
            } catch (err: any) {
                this.error = err.message || "Failed to create category"
                console.error("Error creating category:", err)
                return false
            } finally {
                this.loading = false
            }
        },

        async updateCategory(id: number, payload: CategoryUpdateDto) {
            this.loading = true
            this.error = null
            try {
                await useApi().put(`/category/update/${id}`, payload)
                await this.fetchCategories()
                return true
            } catch (err: any) {
                this.error = err.message || "Failed to update category"
                console.error("Error updating category:", err)
                return false
            } finally {
                this.loading = false
            }
        },

        async deleteCategory(id: number) {
            this.loading = true
            this.error = null
            try {
                await useApi().delete(`/category/delete/${id}`)
                await this.fetchCategories()
                return true
            } catch (err: any) {
                this.error = err.message || "Failed to delete category"
                console.error("Error deleting category:", err)
                return false
            } finally {
                this.loading = false
            }
        },

        async uploadFile(file: File) {
            this.loading = true
            this.error = null
            try {
                const formData = new FormData()
                formData.append("files", file)

                const { data } = await useApi().post<any>("/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                return data // Assuming this returns the filename string
            } catch (err: any) {
                this.error = err.message || "Failed to upload file"
                console.error("Error uploading file:", err)
                return null
            } finally {
                this.loading = false
            }
        },
    },
})
