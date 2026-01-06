// API Response Types
export interface ApiResponse<T> {
  data: T
  total?: number
  skip?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | number
  total: number
  skip: number
  limit: number
}

// Auth Types
export interface LoginCredentials {
  username: string
  password: string
  expiresInMins?: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  birthDate: string
  image: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: {
    color: string
    type: string
  }
  ip?: string
  address: Address
  macAddress?: string
  university?: string
  bank?: Bank
  company?: Company
  ein?: string
  ssn?: string
  userAgent?: string
  crypto?: Crypto
  role: 'admin' | 'moderator' | 'user'
  // Custom fields
  status?: 'active' | 'inactive' | 'suspended'
}

export interface Address {
  address: string
  city: string
  state: string
  stateCode: string
  postalCode: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Bank {
  cardExpire: string
  cardNumber: string
  cardType: string
  currency: string
  iban: string
}

export interface Company {
  department: string
  name: string
  title: string
  address?: Address
}

export interface Crypto {
  coin: string
  wallet: string
  network: string
}

// Product Types
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
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  reviews?: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta?: ProductMeta
  images: string[]
  thumbnail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Review {
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

export interface ProductCategory {
  slug: string
  name: string
  url: string
}

// Post Types
export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
  userId: number
}

// Filter & Pagination Types
export interface PaginationParams {
  limit: number
  skip: number
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minStock?: number
  maxStock?: number
  sortBy?: 'price' | 'rating' | 'stock' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface UserFilters {
  search?: string
  gender?: string
  minAge?: number
  maxAge?: number
  role?: string
  status?: string
  sortBy?: 'firstName' | 'lastName' | 'age' | 'email'
  sortOrder?: 'asc' | 'desc'
}

// Form Types
export interface ProductFormData {
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  returnPolicy: string
  minimumOrderQuantity: number
  images: string[]
  thumbnail: string
}

export interface UserFormData {
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
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: {
    color: string
    type: string
  }
  address: Address
  university?: string
  company?: Company
  role: 'admin' | 'moderator' | 'user'
  status: 'active' | 'inactive' | 'suspended'
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalPosts: number
  totalRevenue?: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}

export interface ActivityItem {
  id: number
  type: 'user' | 'product' | 'order' | 'post'
  action: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
}

// Table Types
export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number | string
  fixed?: 'left' | 'right'
  sorter?: boolean
  filterable?: boolean
  render?: (value: unknown, record: unknown, index: number) => unknown
}

export interface TablePagination {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  closable?: boolean
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system'

// Locale Types
export type LocaleCode = 'uz' | 'ru' | 'en'

export interface LocaleOption {
  code: LocaleCode
  name: string
  flag?: string
}

// Menu Types
export interface MenuItem {
  key: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  permissions?: string[]
  badge?: number | string
}

// Breadcrumb Types
export interface BreadcrumbItem {
  label: string
  path?: string
  icon?: string
}
