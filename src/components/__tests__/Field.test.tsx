import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { Field } from '../Field'
import type { FieldProps } from '../Field'

describe('Field Component', () => {
  const defaultProps: FieldProps = {
    field: {
      id: 'test',
      type: 'text',
      label: 'Test Field'
    },
    value: '',
    onChange: vi.fn()
  }

  it('renders text input correctly', () => {
    render(<Field {...defaultProps} />)
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn()
    render(<Field {...defaultProps} onChange={onChange} />)
    
    const input = screen.getByLabelText('Test Field')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(onChange).toHaveBeenCalledWith('new value')
  })

  it('displays error message when provided', () => {
    render(<Field {...defaultProps} error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('renders number input correctly', () => {
    render(<Field {...defaultProps} field={{ ...defaultProps.field, type: 'number' }} />)
    expect(screen.getByLabelText('Test Field')).toHaveAttribute('type', 'number')
  })

  it('renders select input with options', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]
    
    render(
      <Field
        {...defaultProps}
        field={{ ...defaultProps.field, type: 'select', options }}
      />
    )
    
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('renders checkbox input correctly', () => {
    render(
      <Field
        {...defaultProps}
        field={{ ...defaultProps.field, type: 'checkbox' }}
        value={false}
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders date input correctly', () => {
    render(
      <Field
        {...defaultProps}
        field={{ ...defaultProps.field, type: 'date' }}
      />
    )
    
    expect(screen.getByLabelText('Test Field')).toHaveAttribute('type', 'date')
  })
})
