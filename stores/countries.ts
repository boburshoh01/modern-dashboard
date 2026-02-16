import { defineStore } from "pinia"
import type { Country, CountryCreateDto } from "~/types/country"

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    if (typeof err === "string") return err
    return "An unknown error occurred"
}

export const useCountriesStore = defineStore("countries", {
    state: () => ({
        countries: [] as Country[],
        total: 0,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchCountries() {
            this.loading = true
            this.error = null
            try {
                const { data } = await useApi().get<Country[] | { items: Country[], total: number }>("/country/list")
                if (data && Array.isArray(data)) {
                    this.countries = data
                    this.total = data.length
                } else if (data && data.items) {
                    // Handle if it returns pagination object
                    this.countries = data.items
                    this.total = data.total
                } else {
                    this.countries = []
                    this.total = 0
                }
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to fetch countries"
                console.error("Error fetching countries:", err)
                this.countries = []
            } finally {
                this.loading = false
            }
        },

        async createCountry(payload: CountryCreateDto) {
            this.loading = true
            this.error = null
            try {
                await useApi().post("/country/create", payload)
                await this.fetchCountries()
                return true
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to create country"
                console.error("Error creating country:", err)
                return false
            } finally {
                this.loading = false
            }
        },

        async updateCountry(payload: CountryCreateDto) {
            this.loading = true
            this.error = null
            try {
                // Using POST for update based on API spec
                await useApi().post("/country/update", payload)
                await this.fetchCountries()
                return true
            } catch (err: unknown) {
                this.error = getErrorMessage(err) || "Failed to update country"
                console.error("Error updating country:", err)
                return false
            } finally {
                this.loading = false
            }
        },
    },
})
