import type { Rule } from 'ant-design-vue/es/form'

export interface ValidationRule {
  required?: boolean
  message?: string
  type?: 'string' | 'number' | 'email' | 'url' | 'phone'
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (rule: any, value: any) => Promise<void>
}

export const useValidation = () => {
  // Helper function to create i18n message
  const { t } = useI18n()

  // Required field validation
  const required = (fieldName: string, message?: string): Rule => ({
    required: true,
    message: message || t('validation.required', { field: fieldName }),
  })

  // Email validation
  const email = (message?: string): Rule => ({
    type: 'email',
    message: message || t('validation.email'),
  })

  // Phone validation (supports multiple formats)
  const phone = (message?: string): Rule => ({
    pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    message: message || t('validation.phone'),
  })

  // Min length validation
  const minLength = (length: number, message?: string): Rule => ({
    min: length,
    message: message || t('validation.minLength', { length }),
  })

  // Max length validation
  const maxLength = (length: number, message?: string): Rule => ({
    max: length,
    message: message || t('validation.maxLength', { length }),
  })

  // Range validation (for numbers)
  const range = (min: number, max: number, message?: string): Rule => ({
    type: 'number',
    min,
    max,
    message: message || t('validation.range', { min, max }),
  })

  // Min value validation
  const minValue = (min: number, message?: string): Rule => ({
    type: 'number',
    min,
    message: message || t('validation.minValue', { min }),
  })

  // Max value validation
  const maxValue = (max: number, message?: string): Rule => ({
    type: 'number',
    max,
    message: message || t('validation.maxValue', { max }),
  })

  // URL validation
  const url = (message?: string): Rule => ({
    type: 'url',
    message: message || t('validation.url'),
  })

  // Custom pattern validation
  const pattern = (regex: RegExp, message: string): Rule => ({
    pattern: regex,
    message,
  })

  // Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
  const password = (message?: string): Rule => ({
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message: message || t('validation.password'),
  })

  // Password confirmation validation
  const confirmPassword = (passwordField: string, message?: string): Rule => ({
    validator: async (_rule: any, value: any) => {
      const form = _rule.field.split('.')[0]
      const password = form ? form[passwordField] : passwordField
      if (value && value !== password) {
        return Promise.reject(message || t('validation.confirmPassword'))
      }
      return Promise.resolve()
    },
  })

  // Username validation (alphanumeric and underscore, 3-20 chars)
  const username = (message?: string): Rule => ({
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: message || t('validation.username'),
  })

  // Alphanumeric validation
  const alphanumeric = (message?: string): Rule => ({
    pattern: /^[a-zA-Z0-9]+$/,
    message: message || t('validation.alphanumeric'),
  })

  // Numeric validation
  const numeric = (message?: string): Rule => ({
    pattern: /^[0-9]+$/,
    message: message || t('validation.numeric'),
  })

  // Alpha validation (letters only)
  const alpha = (message?: string): Rule => ({
    pattern: /^[a-zA-Z]+$/,
    message: message || t('validation.alpha'),
  })

  // No whitespace validation
  const noWhitespace = (message?: string): Rule => ({
    pattern: /^\S+$/,
    message: message || t('validation.noWhitespace'),
  })

  // Custom validator
  const custom = (validator: (rule: any, value: any) => Promise<void>): Rule => ({
    validator,
  })

  // Combine multiple rules
  const combine = (...rules: Rule[]): Rule[] => rules

  // Real-time validation helper
  const validateField = async (
    formRef: any,
    fieldName: string
  ): Promise<boolean> => {
    try {
      await formRef.validateFields([fieldName])
      return true
    } catch (error) {
      return false
    }
  }

  // Validate all fields
  const validateForm = async (formRef: any): Promise<boolean> => {
    try {
      await formRef.validate()
      return true
    } catch (error) {
      return false
    }
  }

  // Clear field validation
  const clearFieldValidation = (formRef: any, fieldName: string) => {
    formRef.clearValidate([fieldName])
  }

  // Clear all validation
  const clearValidation = (formRef: any) => {
    formRef.clearValidate()
  }

  // Common validation rule sets
  const loginRules = {
    username: [required('Username'), minLength(3)],
    password: [required('Password'), minLength(6)],
  }

  const registerRules = {
    username: [required('Username'), username()],
    email: [required('Email'), email()],
    password: [required('Password'), password()],
    confirmPassword: [required('Confirm Password'), confirmPassword('password')],
  }

  const userFormRules = {
    firstName: [required('First Name'), minLength(2), maxLength(50)],
    lastName: [required('Last Name'), minLength(2), maxLength(50)],
    email: [required('Email'), email()],
    phone: [phone()],
    username: [required('Username'), username()],
  }

  const productFormRules = {
    title: [required('Title'), minLength(3), maxLength(200)],
    description: [required('Description'), minLength(10)],
    price: [required('Price'), minValue(0)],
    stock: [required('Stock'), minValue(0), numeric()],
    category: [required('Category')],
  }

  return {
    // Basic validators
    required,
    email,
    phone,
    minLength,
    maxLength,
    range,
    minValue,
    maxValue,
    url,
    pattern,
    password,
    confirmPassword,
    username,
    alphanumeric,
    numeric,
    alpha,
    noWhitespace,
    custom,
    combine,

    // Validation helpers
    validateField,
    validateForm,
    clearFieldValidation,
    clearValidation,

    // Common rule sets
    loginRules,
    registerRules,
    userFormRules,
    productFormRules,
  }
}
