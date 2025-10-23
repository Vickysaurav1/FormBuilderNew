export type FormValue = string | number | boolean | string[]

export interface IFormData {
  [key: string]: FormValue
}

export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
}
