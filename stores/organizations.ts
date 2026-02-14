import { defineStore } from "pinia"
import type { Organization, OrganizationUpdateDto, OrganizationParams, OrganizationResponse } from "~/types/organization"

export const useOrganizationsStore = defineStore("organizations", {
    state: () => ({
        organizations: [] as Organization[],
        total: 0,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchOrganizations(params?: OrganizationParams) {
            this.loading = true
            this.error = null
            try {
                if (params) {
                    const { data } = await useApi().get<OrganizationResponse>("/organization/list", { params })
                    if (data && Array.isArray(data.items)) {
                        this.organizations = data.items
                        this.total = data.total
                    } else if (Array.isArray(data)) {
                        this.organizations = data as Organization[]
                        this.total = data.length
                    } else {
                        // Fallback
                        this.organizations = []
                        this.total = 0
                    }
                } else {
                    const { data } = await useApi().get<OrganizationResponse>("/organization/list")
                    if (data && Array.isArray(data)) {
                        this.organizations = data as any
                        this.total = data.length
                    } else if (data && data.items) {
                        this.organizations = data.items
                        this.total = data.total
                    } else {
                        this.organizations = []
                        this.total = 0
                    }
                }

            } catch (err: any) {
                this.error = err.message || "Failed to fetch organizations"
                console.error("Error fetching organizations:", err)
                this.organizations = []
            } finally {
                this.loading = false
            }
        },

        async updateOrganization(payload: OrganizationUpdateDto) {
            this.loading = true
            this.error = null
            try {
                await useApi().post("/organization/update", payload)
                await this.fetchOrganizations()
                return true
            } catch (err: any) {
                this.error = err.message || "Failed to update organization"
                console.error("Error updating organization:", err)
                return false
            } finally {
                this.loading = false
            }
        },
    },
})
