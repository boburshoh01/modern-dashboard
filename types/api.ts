// API Request/Response Types

// Products API
export interface ProductsResponse {
  products: import('./index').Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductResponse {
  product: import('./index').Product
}

// Users API
export interface UsersResponse {
  users: import('./index').User[]
  total: number
  skip: number
  limit: number
}

export interface UserResponse {
  user: import('./index').User
}

// Posts API
export interface PostsResponse {
  posts: import('./index').Post[]
  total: number
  skip: number
  limit: number
}

// Auth API
export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
  expiresInMins?: number
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthMeResponse extends import('./index').User {
  accessToken?: string
  refreshToken?: string
}

// Error Response
export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

// Search Response
export interface SearchResponse<T> {
  results: T[]
  total: number
  skip: number
  limit: number
}
