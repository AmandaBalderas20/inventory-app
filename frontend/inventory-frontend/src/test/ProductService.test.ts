import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import {
    fetchPaginatedProducts,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchFilteredProducts,
    fetchInventoryMetrics,
    } from '../services/productService'

    // Mock axios globally
    vi.mock('axios')
    const mockedAxios = axios as unknown as {
    get: ReturnType<typeof vi.fn>
    }

    // Mock global fetch
    global.fetch = vi.fn()

    describe('productService', () => {
    const mockProduct = {
        id: 1,
        name: 'Leche',
        category: 'Lácteos',
        unitPrice: 20,
        stockQuantity: 5,
    }

    afterEach(() => {
        vi.clearAllMocks()
    })

    // ---------- fetchPaginatedProducts ----------
    it('fetchPaginatedProducts → success', async () => {
        mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: { content: [mockProduct], totalElements: 1 } })
        const result = await fetchPaginatedProducts(0, 10, 'name', 'asc')
        expect(result.content[0].name).toBe('Leche')
        expect(mockedAxios.get).toHaveBeenCalled()
    })

    it('fetchPaginatedProducts → failure', async () => {
        mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('Network error'))
        await expect(fetchPaginatedProducts(0, 10)).rejects.toThrow('Network error')
    })

    // ---------- getAllProducts ----------
    it('getAllProducts → success', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProduct],
        })
        const result = await getAllProducts()
        expect(result).toEqual([mockProduct])
    })

    it('getAllProducts → failure', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
        await expect(getAllProducts()).rejects.toThrow('Error fetching products')
    })

    // ---------- createProduct ----------
    it('createProduct → success', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
        })
        const result = await createProduct(mockProduct)
        expect(result.name).toBe('Leche')
    })

    it('createProduct → failure with error message', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid data' }),
        })
        await expect(createProduct(mockProduct)).rejects.toThrow('Invalid data')
    })

    // ---------- updateProduct ----------
    it('updateProduct → success', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
        })
        const result = await updateProduct(1, mockProduct)
        expect(result.category).toBe('Lácteos')
    })

    it('updateProduct → failure', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
        await expect(updateProduct(1, mockProduct)).rejects.toThrow('Error updating product')
    })

    // ---------- deleteProduct ----------
    it('deleteProduct → success', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true })
        await expect(deleteProduct(1)).resolves.not.toThrow()
    })

    it('deleteProduct → failure', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
        await expect(deleteProduct(1)).rejects.toThrow('Error deleting product')
    })

    // ---------- fetchFilteredProducts ----------
    it('fetchFilteredProducts → success', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProduct],
        })
        const result = await fetchFilteredProducts({ name: 'Leche', inStock: true })
        expect(result[0].name).toBe('Leche')
    })

    it('fetchFilteredProducts → failure', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
        await expect(fetchFilteredProducts({})).rejects.toThrow('Failed to fetch filtered products')
    })

    // ---------- fetchInventoryMetrics ----------
    it('fetchInventoryMetrics → success', async () => {
        const mockMetrics = [{ category: 'Lácteos', totalProducts: 5, totalValue: 100, averagePrice: 20 }]
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
        })
        const result = await fetchInventoryMetrics()
        expect(result[0].category).toBe('Lácteos')
    })

    it('fetchInventoryMetrics → failure', async () => {
        ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
        await expect(fetchInventoryMetrics()).rejects.toThrow('Error fetching inventory metrics')
    })
})
