// User types
export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: 'male' | 'female' | 'other'
  email: string
  phone: string
  username: string
  password?: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    country: string
  }
  university: string
  company: {
    name: string
    department: string
    title: string
  }
  ein: string
  ssn: string
  userAgent: string
  role: 'admin' | 'moderator' | 'user'
  status?: 'active' | 'inactive' | 'suspended' // Added status as per requirements
}

export interface UserResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

// Product types
export interface ProductDimensions {
  width: number
  height: number
  depth: number
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  dimensions: ProductDimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  reviews?: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta?: ProductMeta
  images: string[]
  thumbnail: string
}

export interface ProductResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// Post types
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: number
}

export interface PostResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

// Auth types
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
  accessToken?: string
  refreshToken?: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

// API types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginationParams {
  limit?: number
  skip?: number
  search?: string
}

export interface Category {
  slug: string
  name: string
  url: string
}

// Validation types
export interface ValidationRule {
  required?: boolean
  message?: string
  type?: 'string' | 'number' | 'email' | 'url' | 'phone'
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (rule: any, value: any) => Promise<void>
}

export interface ValidationError {
  field: string
  message: string
}

export interface FormState {
  [key: string]: any
}

// Store types
export interface StoreState {
  loading: boolean
  error: string | null
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system'
  isDark: boolean
}

export interface LocaleState {
  currentLocale: 'en' | 'uz' | 'ru'
}
