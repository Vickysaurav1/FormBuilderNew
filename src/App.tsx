import { useState, useEffect } from 'react'
import { FormBuilder } from './components/FormBuilder'
import type { FormSchema } from './types/form'
import { fetchFormSchema } from './services/formService'
import styles from './App.module.css'

const App = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const data = await fetchFormSchema()
        setSchema({
          ...data,
          fields: data.fields.map(field => ({
            ...field,
            validation: {
              ...field.validation,
              required: field.id === 'name' ? true : field.validation?.required
            }
          })),
          onSubmit: (formData) => {
            if (!formData.name || (typeof formData.name === 'string' && formData.name.trim() === '')) {
              alert('Name is required!')
              return
            }
            console.log('Form submitted:', formData)
            alert('Form submitted successfully!')
          }
        })
      } catch (err) {
        setError('Failed to load form schema')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadSchema()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Loading Form Builder</h1>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p className={styles.loadingText}>Fetching form configuration...</p>
        </div>
      </div>
    )
  }

  if (error || !schema) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Error</h1>
          <p className={styles.error}>{error || 'Failed to load form'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Dynamic Form Builder</h1>
        <FormBuilder schema={schema} />
      </div>
    </div>
  )
}

export default App
