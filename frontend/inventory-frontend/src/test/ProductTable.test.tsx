import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductTable } from '../components/ProductTable/ProductTable'
import type { Product } from '../types/product'

describe('ProductTable', () => {
    const sampleProducts: Product[] = [
        {
        id: 1,
        name: 'Apple',
        category: 'Fruit',
        unitPrice: 1.5,
        stockQuantity: 3,
        expirationDate: '2025-12-31',
        outOfStock: false
        },
        {
        id: 2,
        name: 'Milk',
        category: 'Dairy',
        unitPrice: 2.99,
        stockQuantity: 0,
        expirationDate: '2025-12-01',
        outOfStock: true
        }
    ]

    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const onToggleStock = vi.fn()
    const onSortChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Test cases
    // Check if the component renders without crashing
    it('renders all product rows', () => {
        render(
        <ProductTable
            products={sampleProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStock={onToggleStock}
            sortBy1="name"
            direction1="asc"
            sortBy2=""
            direction2="asc"
            onSortChange={onSortChange}
        />
        )
        // Check if the table headers are rendered
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('Milk')).toBeInTheDocument()
        expect(screen.getAllByRole('row')).toHaveLength(3) 
    })

    // Check if the table headers are rendered
    it('calls onEdit when Edit button is clicked', () => {
        render(
        <ProductTable
            products={sampleProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStock={onToggleStock}
            sortBy1="name"
            direction1="asc"
            sortBy2=""
            direction2="asc"
            onSortChange={onSortChange}
        />
        )
        // Find the Edit button for the first product and click it
        const editButtons = screen.getAllByRole('button', { name: 'Edit' })
        fireEvent.click(editButtons[0])

        expect(onEdit).toHaveBeenCalledWith(sampleProducts[0])
    })

    // Check if the Delete button calls the onDelete function with the correct product ID
    it('calls onDelete when Delete button is clicked', () => {
        render(
        <ProductTable
            products={sampleProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStock={onToggleStock}
            sortBy1="name"
            direction1="asc"
            sortBy2=""
            direction2="asc"
            onSortChange={onSortChange}
        />
        )

        // Find the Delete button for the second product and click it
        // Find the Delete button for the second product and click it
        // This should call onDelete with the ID of the second product (2)
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
        fireEvent.click(deleteButtons[1])

        expect(onDelete).toHaveBeenCalledWith(2)
    })

    // Check if the checkbox toggles the stock status correctly
    it('calls onToggleStock when checkbox is toggled', () => {
        render(
        <ProductTable
            products={sampleProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStock={onToggleStock}
            sortBy1="name"
            direction1="asc"
            sortBy2=""
            direction2="asc"
            onSortChange={onSortChange}
        />
        )

        // Find the checkbox for the first product and click it
        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0])

        expect(onToggleStock).toHaveBeenCalledWith(1, true)
    })

    // Check if the sort buttons call onSortChange with the correct parameters
    it('calls onSortChange when column header is clicked', () => {
        render(
        <ProductTable
            products={sampleProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStock={onToggleStock}
            sortBy1="name"
            direction1="asc"
            sortBy2=""
            direction2="asc"
            onSortChange={onSortChange}
        />
        )

        // Find the sort button for the first column (name) and click it
        const sortButton = screen.getByRole('button', { name: /Category/i })
        fireEvent.click(sortButton)

        // Check if onSortChange was called with the correct parameters
        expect(onSortChange).toHaveBeenCalledWith('category')
    })
})
