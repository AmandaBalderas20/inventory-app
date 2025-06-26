import axios from 'axios';
import type { Product, PaginatedResponse } from '../types/product'
import type { InventoryMetric } from '../types/metrics'

const API_BASE_URL = "http://localhost:9090/products";

export const fetchPaginatedProducts = async (
    page: number,
    size: number,
    sortBy1?: string,
    direction1?: 'asc' | 'desc',
    sortBy2?: string,
    direction2?: 'asc' | 'desc'
    ) => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    })

    if (sortBy1 && direction1) {
        params.append('sortBy1', sortBy1)
        params.append('direction1', direction1)
    }

    if (sortBy2 && direction2) {
        params.append('sortBy2', sortBy2)
        params.append('direction2', direction2)
    }

    const response = await axios.get<PaginatedResponse<Product>>(
        `${API_BASE_URL}/paginated?${params.toString()}`
    )
    return response.data
}

export async function getAllProducts() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error("Error fetching products");
    }
    return response.json();
    }

    export async function createProduct(product: any) {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating product");
    }

    return response.json();
    }

export async function updateProduct(id: number, product: any) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error("Error updating product");
    }

    return response.json();
}

export async function deleteProduct(id: number) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Error deleting product')
    }
}

export async function fetchFilteredProducts(filters: {
    name?: string
    categories?: string[]
    inStock?: boolean
    }) {
    const params = new URLSearchParams()

    if (filters.name) params.append('name', filters.name)
    if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach((cat) => params.append('category', cat))
    }
    if (filters.inStock !== undefined) {
        params.append('inStock', String(filters.inStock))
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`)

    if (!response.ok) {
        throw new Error('Failed to fetch filtered products')
    }

    return response.json()
}

export async function fetchInventoryMetrics(): Promise<InventoryMetric[]> {
    const response = await fetch(`${API_BASE_URL}/metrics`)

    if (!response.ok) {
        throw new Error("Error fetching inventory metrics")
    }

    return response.json()
}
