import type { FormSchema } from '../types/form'

const API_URL = 'https://sharejson.com/api/v1/uzjxOUc_5VccqT-1XiEYf'

export const fetchFormSchema = async (): Promise<FormSchema> => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch form schema')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching form schema:', error)
    // Fallback to default schema if API fails
    return {
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          validation: {
            required: true,
            minLength: 2
          }
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          validation: {
            required: true,
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          }
        }
      ]
    }
  }
}
