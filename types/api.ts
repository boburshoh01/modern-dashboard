export interface ApiError {
  message: string
  status: number
  statusText?: string
}

export interface TableColumn {
  title: string
  dataIndex: string
  key: string
  sorter?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
}

export interface FilterParams {
  [key: string]: any
}

export interface SortParams {
  field: string
  order: 'ascend' | 'descend' | null
}
