import { render, screen, waitFor } from '@testing-library/react'
import InventoryMetrics from '../components/InventoryMetrics/InventoryMetrics'
import * as productService from '../services/productService'
import type { InventoryMetric } from '../types/metrics'
import type { Product } from '../types/product'
import { vi } from 'vitest'

// Mock the productService module
vi.mock('../services/productService')

// Mock the fetchInventoryMetrics function
const mockMetrics: InventoryMetric[] = [
    {
        category: 'Snacks',
        totalProducts: 5,
        totalValue: 150,
        averagePrice: 30,
    },
    {
        category: 'Beverages',
        totalProducts: 3,
        totalValue: 90,
        averagePrice: 30,
    },
    ]

    describe('InventoryMetrics', () => {
    const mockProducts: Product[] = [] // No need to mock products for this test

    // Clear all mocks before each test
    it('fetches and displays inventory metrics', async () => {
        // @ts-ignore
        productService.fetchInventoryMetrics.mockResolvedValue(mockMetrics)

        render(<InventoryMetrics products={mockProducts} />)

        // Verify that the header is displayed
        expect(screen.getByText(/inventory metrics/i)).toBeInTheDocument()

        // Wait for the metrics to be displayed
        await waitFor(() => {
            expect(screen.getByText('Snacks')).toBeInTheDocument()
            expect(screen.getByText('Beverages')).toBeInTheDocument()
        })

        // Verify the numeric values
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('$150.00')).toBeInTheDocument()
        expect(screen.getAllByText('$30.00')).toHaveLength(2)
    })

    // Test case for error handling
    it('shows alert on fetch error', async () => {
        // Simulate an error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

        // @ts-ignore
        productService.fetchInventoryMetrics.mockRejectedValue(new Error('Network error'))

        render(<InventoryMetrics products={mockProducts} />)

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Failed to load inventory metrics')
        })

        consoleSpy.mockRestore()
        alertSpy.mockRestore()
    })
})
