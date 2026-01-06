import { defineStore } from 'pinia'
import type { User, UserFilters, UserFormData } from '~/types'
import type { UsersResponse } from '~/types/api'

interface UsersState {
  users: User[]
  currentUser: User | null
  total: number
  loading: boolean
  error: string | null
  filters: UserFilters
  pagination: {
    page: number
    pageSize: number
  }
  selectedIds: number[]
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    currentUser: null,
    total: 0,
    loading: false,
    error: null,
    filters: {
      search: '',
      gender: '',
      minAge: undefined,
      maxAge: undefined,
      role: '',
      status: '',
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
    getUsers: (state) => state.users,
    getCurrentUser: (state) => state.currentUser,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalPages: (state) => Math.ceil(state.total / state.pagination.pageSize),
    getSelectedUsers: (state) =>
      state.users.filter((u) => state.selectedIds.includes(u.id)),
    hasSelection: (state) => state.selectedIds.length > 0,
    activeUsersCount: (state) =>
      state.users.filter((u) => u.status === 'active').length
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const skip = (this.pagination.page - 1) * this.pagination.pageSize

        let url = `${config.public.apiBase}/users`
        const params = new URLSearchParams()

        params.append('limit', this.pagination.pageSize.toString())
        params.append('skip', skip.toString())

        // Handle search
        if (this.filters.search) {
          url = `${config.public.apiBase}/users/search`
          params.append('q', this.filters.search)
        }
        // Handle filter by key
        else if (this.filters.gender) {
          url = `${config.public.apiBase}/users/filter`
          params.append('key', 'gender')
          params.append('value', this.filters.gender)
        }

        // Handle sorting
        if (this.filters.sortBy) {
          params.append('sortBy', this.filters.sortBy)
          params.append('order', this.filters.sortOrder || 'asc')
        }

        const response = await $fetch<UsersResponse>(`${url}?${params.toString()}`)

        this.users = response.users
        this.total = response.total
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id: number) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<User>(`${config.public.apiBase}/users/${id}`)
        this.currentUser = response
        return response
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to fetch user'
        return null
      } finally {
        this.loading = false
      }
    },

    async createUser(data: UserFormData) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<User>(`${config.public.apiBase}/users/add`, {
          method: 'POST',
          body: data
        })

        // Add to local state
        this.users.unshift(response)
        this.total++

        return { success: true, data: response }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to create user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, data: Partial<UserFormData>) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<User>(
          `${config.public.apiBase}/users/${id}`,
          {
            method: 'PUT',
            body: data
          }
        )

        // Update local state
        const index = this.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          this.users[index] = response
        }
        if (this.currentUser?.id === id) {
          this.currentUser = response
        }

        return { success: true, data: response }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to update user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/users/${id}`, {
          method: 'DELETE'
        })

        // Remove from local state
        this.users = this.users.filter((u) => u.id !== id)
        this.total--
        this.selectedIds = this.selectedIds.filter((sid) => sid !== id)

        return { success: true }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Failed to delete user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteSelectedUsers() {
      const results = await Promise.all(
        this.selectedIds.map((id) => this.deleteUser(id))
      )
      this.selectedIds = []
      return results.every((r) => r.success)
    },

    async toggleUserStatus(id: number) {
      const user = this.users.find((u) => u.id === id)
      if (!user) return { success: false }

      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      return this.updateUser(id, { status: newStatus })
    },

    setFilters(filters: Partial<UserFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
      this.fetchUsers()
    },

    clearFilters() {
      this.filters = {
        search: '',
        gender: '',
        minAge: undefined,
        maxAge: undefined,
        role: '',
        status: '',
        sortBy: undefined,
        sortOrder: 'asc'
      }
      this.pagination.page = 1
      this.fetchUsers()
    },

    setPage(page: number) {
      this.pagination.page = page
      this.fetchUsers()
    },

    setPageSize(size: number) {
      this.pagination.pageSize = size
      this.pagination.page = 1
      this.fetchUsers()
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
      this.selectedIds = this.users.map((u) => u.id)
    },

    clearSelection() {
      this.selectedIds = []
    },

    clearError() {
      this.error = null
    }
  }
})
