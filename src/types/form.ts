import type { FormValue } from './common'

export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date'

export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  custom?: (value: FormValue) => boolean | string
}

export type FormField = {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  options?: { label: string; value: string }[]
  validation?: ValidationRule
  dependsOn?: {
    field: string
    value: FormValue
  }
}

export type FormSchema = {
  fields: FormField[]
  onSubmit?: (data: Record<string, FormValue>) => void
}
