import { render, screen, fireEvent } from '@testing-library/react'
import { ProductForm } from './ProductForm'
import type { Product, ProductFormInput } from '../../types/product'
import { vi } from 'vitest'


describe('ProductForm', () => {
    it('should render input and button', () => {
        render(<ProductForm onSubmit={vi.fn()} />)

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('should allow typing in the input', () => {
        render(<ProductForm onSubmit={function (data: ProductFormInput): void {
            throw new Error('Function not implemented.')
        } } />)

        const input = screen.getByLabelText(/name/i)
        fireEvent.change(input, { target: { value: 'Banana' } })

        expect(input).toHaveValue('Banana')
    })
})
