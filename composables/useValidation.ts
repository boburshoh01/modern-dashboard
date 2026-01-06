import type { Rule } from 'ant-design-vue/es/form'

export function useValidation() {
  const { t } = useI18n()

  const rules = {
    required: (message?: string): Rule => ({
      required: true,
      message: message || t('validation.required'),
      trigger: 'blur'
    }),

    email: (message?: string): Rule => ({
      type: 'email',
      message: message || t('validation.email'),
      trigger: 'blur'
    }),

    minLength: (min: number, message?: string): Rule => ({
      min,
      message: message || t('validation.minLength', { min }),
      trigger: 'blur'
    }),

    maxLength: (max: number, message?: string): Rule => ({
      max,
      message: message || t('validation.maxLength', { max }),
      trigger: 'blur'
    }),

    min: (min: number, message?: string): Rule => ({
      type: 'number',
      min,
      message: message || t('validation.min', { min }),
      trigger: 'blur'
    }),

    max: (max: number, message?: string): Rule => ({
      type: 'number',
      max,
      message: message || t('validation.max', { max }),
      trigger: 'blur'
    }),

    phone: (message?: string): Rule => ({
      pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      message: message || t('validation.phone'),
      trigger: 'blur'
    }),

    url: (message?: string): Rule => ({
      type: 'url',
      message: message || t('validation.url'),
      trigger: 'blur'
    }),

    numeric: (message?: string): Rule => ({
      pattern: /^\d+$/,
      message: message || t('validation.numeric'),
      trigger: 'blur'
    }),

    alpha: (message?: string): Rule => ({
      pattern: /^[a-zA-Z]+$/,
      message: message || t('validation.alpha'),
      trigger: 'blur'
    }),

    alphanumeric: (message?: string): Rule => ({
      pattern: /^[a-zA-Z0-9]+$/,
      message: message || t('validation.alphanumeric'),
      trigger: 'blur'
    }),

    custom: (
      validator: (value: unknown) => boolean | Promise<boolean>,
      message: string
    ): Rule => ({
      validator: async (_rule, value) => {
        const isValid = await validator(value)
        if (!isValid) {
          return Promise.reject(message)
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    })
  }

  const combineRules = (...ruleList: Rule[]): Rule[] => {
    return ruleList
  }

  return {
    rules,
    combineRules
  }
}
