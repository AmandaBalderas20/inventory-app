import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '../components/ProductForm/ProductForm'

describe('ProductForm', () => {
    const mockOnClose = vi.fn()
    const mockOnSave = vi.fn()

    const defaultProps = {
        open: true,
        onClose: mockOnClose,
        onSave: mockOnSave,
        existingCategories: ['Beverages', 'Snacks']
    }

    // Mock the useState hook to control the form state
    it('renders empty form for new product', () => {
        mockOnSave.mockClear()

        render(<ProductForm {...defaultProps} />)

        // Check if the form fields are rendered
        expect(screen.getByLabelText('Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Category')).toBeInTheDocument()
        expect(screen.getByLabelText('Stock')).toHaveValue(0)
        expect(screen.getByLabelText('Unit Price')).toHaveValue(0)
        expect(screen.getByLabelText('Expiration Date')).toBeInTheDocument()
    })

    // Test case for filling the form and submitting with a new product
    it('fills form and submits with existing category', async () => {
        mockOnSave.mockClear()

        render(<ProductForm {...defaultProps} />)
        const user = userEvent.setup()

        await user.type(screen.getByLabelText('Name'), 'Test Product')

        fireEvent.mouseDown(screen.getByLabelText('Category'))
        await user.click(screen.getByText('Snacks'))

        // Fill in stock and price fields
        const stockInput = screen.getByLabelText('Stock')
        const priceInput = screen.getByLabelText('Unit Price')
        await user.clear(stockInput)
        await user.type(stockInput, '10')
        await user.clear(priceInput)
        await user.type(priceInput, '5')

        await user.type(screen.getByLabelText('Expiration Date'), '2025-12-31')

        // Check if the save button is enabled and click it
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeEnabled()
        await user.click(saveButton)

        // Verify that onSave was called with the correct data
        expect(mockOnSave).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Test Product',
                category: 'Snacks',
                stockQuantity: '10',
                unitPrice: '5',
                expirationDate: '2025-12-31'
            })
        )
    })

    // Test case for filling the form and submitting with a custom category
    it('shows custom category field when "custom" is selected', async () => {
        mockOnSave.mockClear()

        render(<ProductForm {...defaultProps} />)
        const user = userEvent.setup()

        // Open the category select dropdown
        const categorySelect = screen.getByLabelText('Category')
        fireEvent.mouseDown(categorySelect)

        // Select the "Other (type manually)" option
        await user.click(screen.getByText('Other (type manually)'))

        // Wait for the custom category input to appear
        const customCategoryInput = await screen.findByLabelText('Custom Category')
        await user.type(customCategoryInput, 'Dairy')

        // Fill in the rest of the form
        await user.type(screen.getByLabelText('Name'), 'Milk')
        await user.clear(screen.getByLabelText('Stock'))
        await user.type(screen.getByLabelText('Stock'), '20')
        await user.clear(screen.getByLabelText('Unit Price'))
        await user.type(screen.getByLabelText('Unit Price'), '8')
        await user.type(screen.getByLabelText('Expiration Date'), '2025-11-01')

        // Click "Save"
        await user.click(screen.getByRole('button', { name: /save/i }))

        // Verify that onSave was called with the expected data
        expect(mockOnSave).toHaveBeenCalledWith(
            expect.objectContaining({
            name: 'Milk',
            category: 'Dairy',
            stockQuantity: '20',
            unitPrice: '8',
            expirationDate: '2025-11-01'
            })
        )
    })

    // Test case for closing the form without saving
    it('disables save button if required fields are missing or invalid', () => {
        render(<ProductForm {...defaultProps} />)
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeDisabled()
    })
})
