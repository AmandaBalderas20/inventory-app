// src/test/ProductFilters.test.tsx
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductFilters from '../components/ProductFilters/ProductFilters'

describe('ProductFilters', () => {
    const existingCategories = ['Fruit', 'Dairy', 'Snacks']
    const onSearch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Test cases
    // Verify that the component renders without crashing
    it('renders all filter fields and buttons', () => {
        render(<ProductFilters existingCategories={existingCategories} onSearch={onSearch} />)

        // Verify that the filter fields are rendered
        expect(screen.getByLabelText('Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Category')).toBeInTheDocument()
        expect(screen.getByLabelText('Availability')).toBeInTheDocument()
        
        expect(screen.getByText(/search/i)).toBeInTheDocument()
        expect(screen.getByText(/clear filters/i)).toBeInTheDocument()
    })

    // Check if the component calls onSearch with the correct parameters when the search button is clicked
    it('calls onSearch with the entered values when submitted', () => {
        render(<ProductFilters existingCategories={existingCategories} onSearch={onSearch} />)

        // Fill in the name field
        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'apple' }
        })

        // Select category "Fruit"
        fireEvent.mouseDown(screen.getByLabelText('Category'))
        fireEvent.click(screen.getByText('Fruit'))

        // Select "In Stock"
        fireEvent.mouseDown(screen.getByLabelText('Availability'))
        fireEvent.click(screen.getByText('In Stock'))

        // Click on Search
        fireEvent.click(screen.getByText(/search/i))

        // Verify that onSearch was called with the correct parameters
        expect(onSearch).toHaveBeenCalledWith({
            name: 'apple',
            categories: ['Fruit'],
            inStock: true
        })
    })

    // Check if the component calls onSearch with empty filters when the clear button is clicked
    it('clears all fields and calls onSearch with empty filters', () => {
        render(<ProductFilters existingCategories={existingCategories} onSearch={onSearch} />)

        // Fill in the name field
        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'milk' }
        })

        // Click on Clear
        fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))

        // Verify that onSearch was called with empty filters
        expect(onSearch).toHaveBeenCalledWith({
            name: '',
            categories: [],
            inStock: undefined
        })

        // Verify that the fields are cleared
        expect(screen.getByLabelText('Name')).toHaveValue('')
        expect(screen.getByLabelText('Availability')).toHaveTextContent('All')
    })

    // Check if the component allows selecting multiple categories
    it('allows selecting multiple categories', () => {
        render(<ProductFilters existingCategories={existingCategories} onSearch={onSearch} />)

        // Open the category select dropdown
        fireEvent.mouseDown(screen.getByLabelText('Category'))

        const listbox = screen.getByRole('listbox')
        fireEvent.click(within(listbox).getByText('Dairy'))
        fireEvent.click(within(listbox).getByText('Snacks'))

        // Send the search
        fireEvent.click(screen.getByText(/search/i))

        // Verify that onSearch was called with the selected categories
        expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({
            categories: expect.arrayContaining(['Dairy', 'Snacks'])
        })
        )
    })
})
