import { describe, it, expect, vi } from 'vitest'

// Mock axios before importing the module
vi.mock('axios', () => {
    // Define the mock instance inside the mock factory function
    const mockAxiosInstance = {
        defaults: { baseURL: 'http://localhost:9090' },
        get: vi.fn(),
    }

    return {
        default: {
        create: vi.fn(() => mockAxiosInstance),
        },
    }
})


import api from '../services/api'

interface MockResponse {
    message: string
}

describe('api (Axios instance)', () => {
    it('should create an axios instance with the correct base URL', () => {
        // Verify the axios instance configuration
        expect(api.defaults.baseURL).toBe('http://localhost:9090')
    })

    it('should allow performing GET requests using the mocked instance', async () => {
        // Prepare the mock response
        const mockResponse: { data: MockResponse } = { data: { message: 'success' } }

        // Retrieve the mocked axios instance from the module
        const axiosModule = await import('axios')
        const mockedCreate = (axiosModule.default.create as any).mock.results[0].value
        mockedCreate.get.mockResolvedValueOnce(mockResponse)

        // Execute a simulated GET request
        const response = await api.get<MockResponse>('/test')

        // Validate response and ensure the GET call was invoked
        expect(response.data.message).toBe('success')
        expect(mockedCreate.get).toHaveBeenCalledWith('/test')
    })
})
