export interface Brand {
    id: number
    is_active: boolean
    logo: string
    name: string
}

export interface BrandCreateDto {
    is_active: boolean
    logo: string
    name: string
}

export interface BrandUpdateDto extends BrandCreateDto { }

export interface BrandParams {
    page?: number
    page_size?: number
    name?: string
}

export interface BrandResponse {
    items: Brand[]
    total: number
    page: number
    size: number
}
