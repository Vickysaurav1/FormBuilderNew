import type { FormField, FormSchema } from '../types/form'
import type { IFormData, FormValue, ValidationResult } from '../types/common'

export const validateField = (value: FormValue, field: FormField): string | null => {
  const { validation } = field
  if (!validation) return null

  // Handle required field validation
  if (validation.required) {
    if (value === undefined || value === null || value === '') {
      return `${field.label} is required`
    }
    // Additional check for string type
    if (typeof value === 'string' && value.trim() === '') {
      return `${field.label} is required`
    }
  }

  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`
    }
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return `${field.label} is invalid`
    }
  }

  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      return `${field.label} must be at least ${validation.min}`
    }
    if (validation.max !== undefined && value > validation.max) {
      return `${field.label} must be no more than ${validation.max}`
    }
  }

  if (validation.custom) {
    const result = validation.custom(value)
    if (typeof result === 'string') return result
    if (!result) return `${field.label} is invalid`
  }

  return null
}

export const validateForm = (data: IFormData, schema: FormSchema): ValidationResult => {
  const errors: Record<string, string> = {}

  schema.fields.forEach(field => {
    const value = data[field.id]
    const error = validateField(value, field)
    if (error) {
      errors[field.id] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
