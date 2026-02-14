export interface CountryName {
    en: string
    kk: string
    ru: string
    uz: string
}

export interface Country {
    code: string
    name: CountryName
}

export interface CountryCreateDto {
    code: string
    name: CountryName
}

export interface CountryResponse {
    items: Country[]
    total: number
    page: number
    size: number
}
