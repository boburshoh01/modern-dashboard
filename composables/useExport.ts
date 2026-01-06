import * as XLSX from 'xlsx'

interface ExportOptions {
  filename?: string
  sheetName?: string
  columns?: { key: string; title: string }[]
}

export function useExport() {
  const exportToCSV = <T extends Record<string, unknown>>(
    data: T[],
    options: ExportOptions = {}
  ) => {
    const { filename = 'export', columns } = options

    let csvContent = ''

    // Headers
    if (columns) {
      csvContent += columns.map((col) => col.title).join(',') + '\n'
    } else if (data.length > 0) {
      csvContent += Object.keys(data[0]).join(',') + '\n'
    }

    // Data rows
    data.forEach((item) => {
      const keys = columns ? columns.map((col) => col.key) : Object.keys(item)
      const row = keys
        .map((key) => {
          const value = item[key]
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        })
        .join(',')
      csvContent += row + '\n'
    })

    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, `${filename}.csv`)
  }

  const exportToExcel = <T extends Record<string, unknown>>(
    data: T[],
    options: ExportOptions = {}
  ) => {
    const { filename = 'export', sheetName = 'Sheet1', columns } = options

    // Transform data if columns specified
    let exportData: Record<string, unknown>[]
    if (columns) {
      exportData = data.map((item) => {
        const row: Record<string, unknown> = {}
        columns.forEach((col) => {
          row[col.title] = item[col.key]
        })
        return row
      })
    } else {
      exportData = data
    }

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Generate Excel file
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return {
    exportToCSV,
    exportToExcel
  }
}
