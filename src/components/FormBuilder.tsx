import { useState, useCallback } from 'react'
import type { FormSchema } from '../types/form'
import type { IFormData, ValidationResult, FormValue } from '../types/common'
import { Field } from './Field'
import { validateForm } from '../utils/validation'
import styles from './FormBuilder.module.css'

interface FormBuilderProps {
  schema: FormSchema
  initialData?: IFormData
}

export const FormBuilder = ({ schema, initialData = {} as IFormData }: FormBuilderProps) => {
  const [formData, setFormData] = useState<IFormData>(initialData)
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: {} })

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const validationResult = validateForm(formData, schema)
    setValidation(validationResult)

    if (validationResult.isValid && schema.onSubmit) {
      schema.onSubmit(formData)
    }
  }, [formData, schema])

  const handleFieldChange = useCallback((fieldId: string, value: FormValue) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const isFieldVisible = useCallback((field: FormSchema['fields'][0]) => {
    if (!field.dependsOn) return true

    const dependentValue = formData[field.dependsOn.field]
    return dependentValue === field.dependsOn.value
  }, [formData])

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {schema.fields.map(field => (
        isFieldVisible(field) && (
          <Field
            key={field.id}
            field={field}
            value={formData[field.id] ?? ''}
            onChange={value => handleFieldChange(field.id, value)}
            error={validation.errors[field.id]}
          />
        )
      ))}
      <button
        type="submit"
        className={styles.submitButton}
      >
        Submit
      </button>
    </form>
  )
}
