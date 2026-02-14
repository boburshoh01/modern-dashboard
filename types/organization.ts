export interface Organization {
    address: string
    bank_mfo: string
    bank_payment_account: string
    director_full_name: string
    director_pin: string
    email: string
    id: number
    is_active: boolean
    kfs: number
    name: string
    oked: string
    opf: number
    phone_number: string
    short_name: string
    soato: number
    soogu: string
    tin: string
}

export interface OrganizationUpdateDto {
    admin_id?: number
    email?: string
    id: number
    is_active?: boolean
    legal_form?: string
    ownership_form?: string
    phone_number?: string
    supervisor_id?: number
    taxRate?: number
}

export interface OrganizationParams {
    page?: number
    page_size?: number
    name?: string
    tin?: string
    admin_id?: number
    supervisor_id?: number
}

export interface OrganizationResponse {
    items: Organization[]
    total: number
    page: number
    size: number
}
