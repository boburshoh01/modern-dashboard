import { defineStore } from "pinia"
import type { Brand, BrandCreateDto, BrandUpdateDto, BrandParams, BrandResponse } from "~/types/brand"

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    if (typeof err === "string") return err
    return "An unknown error occurred"
}

export const useBrandsStore = defineStore("brands", {
    state: () => ({
        brands: [] as Brand[],
        total: 0,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchBrands(params?: BrandParams) {
            this.loading = true
            this.error = null
            try {
                if (params) {
                    const { data } = await useApi().get<BrandResponse>("/brand/paging/list", { params })
                    if (data && Array.isArray(data.items)) {
                        this.brands = data.items
                        this.total = data.total
                    } else {
                        // Fallback if structure is different or empty
                        this.brands = []
                        this.total = 0
                    }
                } else {
                    const { data } = await useApi().get<Brand[]>("/brand/list")
                    if (data && Array.isArray(data)) {
                        this.brands = data
                        this.total = data.length
                    } else {
                        this.brands = []
                        this.total = 0
                    }
                }
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to fetch brands"
                console.error("Error fetching brands:", err)
                this.brands = []
            } finally {
                this.loading = false
            }
        },

        async createBrand(payload: BrandCreateDto) {
            this.loading = true
            this.error = null
            try {
                await useApi().post("/brand/create", payload)
                await this.fetchBrands()
                return true
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to create brand"
                console.error("Error creating brand:", err)
                return false
            } finally {
                this.loading = false
            }
        },

        async updateBrand(id: number, payload: BrandUpdateDto) {
            this.loading = true
            this.error = null
            try {
                await useApi().put(`/brand/update/${id}`, payload)
                await this.fetchBrands()
                return true
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to update brand"
                console.error("Error updating brand:", err)
                return false
            } finally {
                this.loading = false
            }
        },

        async deleteBrand(id: number) {
            this.loading = true
            this.error = null
            try {
                await useApi().delete(`/brand/delete/${id}`)
                await this.fetchBrands()
                return true
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to delete brand"
                console.error("Error deleting brand:", err)
                return false
            } finally {
                this.loading = false
            }
        },
    },
})
