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

  const validateFormData = useCallback(() => {
    const validationResult = validateForm(formData, schema)
    setValidation(validationResult)
    return validationResult
  }, [formData, schema])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const validationResult = validateFormData()
    
    // Check validation result and perform required field validation
    if (validationResult.isValid) {
      const requiredFieldErrors = schema.fields.reduce<Record<string, string>>((errors, field) => {
        if (field.validation?.required) {
          const value = formData[field.id]
          if (
            value === undefined || 
            value === null || 
            value === '' || 
            (typeof value === 'string' && value.trim() === '')
          ) {
            errors[field.id] = `${field.label} is required`
          }
        }
        return errors
      }, {})

      // Update validation state with any required field errors
      if (Object.keys(requiredFieldErrors).length > 0) {
        setValidation({
          isValid: false,
          errors: { ...validationResult.errors, ...requiredFieldErrors }
        })
        return
      }

      // If we get here, validation passed and we can submit
      schema.onSubmit?.(formData)
    }
  }, [formData, schema, validateFormData])

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
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={() => {
            setFormData({})
            setValidation({ isValid: true, errors: {} })
          }}
          className={styles.resetButton}
        >
          Reset
        </button>
        <button
          type="submit"
          className={styles.submitButton}
        >
          Submit
        </button>
      </div>
    </form>
  )
}
