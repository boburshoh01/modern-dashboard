export interface CategoryName {
    en: string
    kk: string // Qoraqalpoq
    ru: string
    uz: string
}

export interface Category {
    id: number
    is_active: boolean
    logo: string
    name: CategoryName
    parent_id: number
    parent?: string
    slug?: CategoryName
    children?: string[]
}

export interface CategoryCreateDto {
    is_active: boolean
    logo: string
    name: CategoryName
    parent_id: number
}

export interface CategoryUpdateDto extends CategoryCreateDto { }

export interface CategoryParams {
    page?: number
    page_size?: number
    name?: string
}

export interface CategoryResponse {
    items: Category[]
    total: number
    page: number
    size: number
}
