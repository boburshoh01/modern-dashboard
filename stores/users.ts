import { defineStore } from 'pinia'
import type { User, UserResponse, PaginationParams } from '~/types'

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'An unknown error occurred'
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    total: 0,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers(params: PaginationParams & { key?: string; value?: string } = {}) {
      this.loading = true
      this.error = null
      const { get } = useApi()

      try {
        let endpoint = '/users'
        const queryParams = new URLSearchParams()

        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.skip) queryParams.append('skip', params.skip.toString())

        if (params.search) {
          endpoint = '/users/search'
          queryParams.append('q', params.search)
        } else if (params.key && params.value) {
          endpoint = '/users/filter'
          queryParams.append('key', params.key)
          queryParams.append('value', params.value)
        }

        const response = await get<UserResponse>(`${endpoint}?${queryParams.toString()}`)
        this.users = response.data.users
        this.total = response.data.total
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to fetch users'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
      this.loading = true
      const { get } = useApi()
      try {
        const response = await get<User>(`/users/${id}`)
        return response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to fetch user'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addUser(user: Partial<User>) {
      this.loading = true
      const { post } = useApi()
      try {
        const response = await post<User>('/users/add', user)
        this.users.unshift(response.data)
        this.total++
        return response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to add user'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, updates: Partial<User>) {
      this.loading = true
      const { put } = useApi()
      try {
        const response = await put<User>(`/users/${id}`, updates)
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...response.data }
        }
        return response.data
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to update user'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      const { delete: del } = useApi()
      try {
        await del<User>(`/users/${id}`)
        this.users = this.users.filter(u => u.id !== id)
        this.total--
      } catch (err: unknown) {
        this.error = getErrorMessage(err) || 'Failed to delete user'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
