import type { FormField } from '../types/form'
import type { FormValue } from '../types/common'
import styles from './Field.module.css'

export interface FieldProps {
  field: FormField
  value: FormValue
  onChange: (value: FormValue) => void
  error?: string
  disabled?: boolean
}

export const Field = ({ field, value, onChange, error, disabled }: FieldProps) => {
  const { type, label, placeholder, options } = field

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={styles.input}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={placeholder}
            disabled={disabled}
            className={styles.input}
          />
        )

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={styles.select}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={styles.checkbox}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={styles.input}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {type === 'checkbox' ? (
          <div className={styles.checkboxLabel}>
            {renderField()}
            {label}
          </div>
        ) : (
          <>
            {label}
            {renderField()}
          </>
        )}
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
