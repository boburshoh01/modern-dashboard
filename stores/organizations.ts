import { defineStore } from "pinia"
import type { Organization, OrganizationUpdateDto } from "~/types/organization"

export const useOrganizationsStore = defineStore("organizations", () => {
    const {
        items: organizations,
        total,
        loading,
        error,
        fetchList,
    } = useCrud<Organization>({
        apiEndpoint: "/organization",
        endpoints: {
            list: "/organization/list",
            update: "/organization/update"
        },
        transformResponse: (data) => {
            if (data && Array.isArray(data.items)) {
                return { items: data.items as Organization[], total: Number(data.total) }
            } else if (Array.isArray(data)) {
                return { items: data as Organization[], total: data.length }
            } else if (data && data.items) {
                return { items: data.items as Organization[], total: Number(data.total) }
            }
            return { items: [], total: 0 }
        },
    })

    const fetchOrganizations = async (params?: Record<string, string | number>) => {
        return fetchList(params)
    }

    const updateOrganization = async (payload: OrganizationUpdateDto) => {
        loading.value = true
        error.value = null
        try {
            await useApi().post("/organization/update", payload)
            await fetchOrganizations() // Refresh list
            return true
        } catch (err: unknown) {
            error.value = (err as Error).message || "Failed to update organization"
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        organizations,
        total,
        loading,
        error,
        fetchOrganizations,
        updateOrganization,
    }
})
