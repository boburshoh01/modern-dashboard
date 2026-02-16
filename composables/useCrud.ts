import type { ApiResponse } from "~/types"

interface CrudEndpoints {
    list?: string
    create?: string
    update?: string
    delete?: string
}

interface CrudOptions<T, TParams = Record<string, unknown>> {
    apiEndpoint: string
    endpoints?: CrudEndpoints
    transformResponse?: (data: Record<string, unknown>) => { items: T[]; total: number }
    transformParams?: (params: TParams) => Record<string, unknown>
}

export function useCrud<T extends { id?: number | string }, TParams = Record<string, unknown>>(options: CrudOptions<T, TParams>) {
    const items = ref<T[]>([]) as Ref<T[]>
    const total = ref(0)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Standard error extraction helper
    const getErrorMessage = (err: unknown): string => {
        if (err instanceof Error) return err.message
        if (typeof err === "string") return err
        if ((err as Record<string, unknown>)?.response) {
            const response = (err as Record<string, unknown>).response as Record<string, unknown> | undefined
            const data = response?.data as Record<string, unknown> | undefined
            if (typeof data?.message === "string") return data.message
        }
        return "An unknown error occurred"
    }

    const { get, post, put, delete: del } = useApi()

    const resolveEndpoint = (type: keyof CrudEndpoints, id?: string | number) => {
        if (options.endpoints?.[type]) {
            const endpoint = options.endpoints[type]!
            return id ? endpoint.replace(":id", String(id)) : endpoint
        }

        switch (type) {
            case "list": return options.apiEndpoint
            case "create": return `${options.apiEndpoint}/add` // Defaulting to /add as per widespread project pattern
            case "update": return id ? `${options.apiEndpoint}/${id}` : options.apiEndpoint
            case "delete": return id ? `${options.apiEndpoint}/${id}` : options.apiEndpoint
        }
        return options.apiEndpoint
    }

    const fetchList = async (params?: TParams) => {
        loading.value = true
        error.value = null
        try {
            const queryParams = options.transformParams ? options.transformParams(params as TParams) : params
            const url = resolveEndpoint("list")
            const response = await get<Record<string, unknown>>(url, { params: queryParams })

            if (options.transformResponse) {
                const { items: transformedItems, total: transformedTotal } = options.transformResponse(response.data)
                items.value = transformedItems
                total.value = transformedTotal
            } else {
                if (response.data && Array.isArray(response.data.items)) {
                    items.value = response.data.items as T[]
                    total.value = response.data.total as number
                } else if (Array.isArray(response.data)) {
                    items.value = response.data as T[]
                    total.value = response.data.length
                } else if (response.data && Array.isArray(response.data.products)) {
                    items.value = response.data.products as T[]
                    total.value = response.data.total as number
                }
            }
        } catch (err: unknown) {
            error.value = getErrorMessage(err) || "Failed to fetch items"
            console.error(`Error fetching ${options.apiEndpoint}:`, err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const createItem = async (payload: Partial<T>) => {
        loading.value = true
        error.value = null
        try {
            const url = resolveEndpoint("create")
            const response = await post<ApiResponse<T>>(url, payload)

            if (response.data?.data) {
                items.value.unshift(response.data.data)
                total.value++
                return response.data.data
            } else if (response.data) {
                const newItem = response.data as unknown as T
                items.value.unshift(newItem)
                total.value++
                return newItem
            }
        } catch (err: unknown) {
            error.value = getErrorMessage(err) || "Failed to create item"
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateItem = async (id: number | string, payload: Partial<T>) => {
        loading.value = true
        try {
            const url = resolveEndpoint("update", id)
            const response = await put<ApiResponse<T>>(url, payload)

            const index = items.value.findIndex((item) => item.id === id)
            if (index !== -1) {
                if (response.data?.data) {
                    items.value[index] = { ...items.value[index], ...response.data.data }
                    return response.data.data
                } else if (response.data) {
                    items.value[index] = { ...items.value[index], ...response.data }
                    return response.data
                }
            }
        } catch (err: unknown) {
            error.value = getErrorMessage(err) || "Failed to update item"
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteItem = async (id: number | string) => {
        loading.value = true
        try {
            const url = resolveEndpoint("delete", id)
            await del(url)
            items.value = items.value.filter((item) => item.id !== id)
            total.value--
        } catch (err: unknown) {
            error.value = getErrorMessage(err) || "Failed to delete item"
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        items,
        total,
        loading,
        error,
        fetchList,
        createItem,
        updateItem,
        deleteItem
    }
}
