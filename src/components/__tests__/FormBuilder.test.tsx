import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { FormBuilder } from '../FormBuilder'
import type { FormSchema } from '../../types/form'

describe('FormBuilder Component', () => {
  const mockSchema: FormSchema = {
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        validation: {
          required: true
        }
      },
      {
        id: 'age',
        type: 'number',
        label: 'Age'
      },
      {
        id: 'preferredContact',
        type: 'select',
        label: 'Preferred Contact',
        options: [
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' }
        ]
      }
    ],
    onSubmit: vi.fn()
  }

  it('renders all fields from schema', () => {
    render(<FormBuilder schema={mockSchema} />)
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Age')).toBeInTheDocument()
    expect(screen.getByLabelText('Preferred Contact')).toBeInTheDocument()
  })

  it('shows validation errors on submit when required fields are empty', async () => {
    render(<FormBuilder schema={mockSchema} />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
    
    expect(mockSchema.onSubmit).not.toHaveBeenCalled()
  })

  it('handles conditional field visibility', () => {
    const schemaWithConditional: FormSchema = {
      fields: [
        {
          id: 'contact',
          type: 'select',
          label: 'Contact Method',
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' }
          ]
        },
        {
          id: 'phone',
          type: 'text',
          label: 'Phone Number',
          dependsOn: {
            field: 'contact',
            value: 'phone'
          }
        }
      ]
    }
    
    render(<FormBuilder schema={schemaWithConditional} />)
    
    expect(screen.queryByLabelText('Phone Number')).not.toBeInTheDocument()
    
    fireEvent.change(screen.getByLabelText('Contact Method'), {
      target: { value: 'phone' }
    })
    
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
  })
})
