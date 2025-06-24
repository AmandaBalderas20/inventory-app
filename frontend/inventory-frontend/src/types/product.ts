export type Product = {
    id: string
    name: string
    category: string
    unitPrice: number
    stockQuantity: number
    expirationDate?: string 
    creationDate: string
    lastUpdatedDate: string
    outOfStock?: boolean 
}

export type ProductFormInput = {
    name: string
    category: string
    unitPrice: number
    stockQuantity: number
    expirationDate?: string
}

export type PaginatedResponse<T> = {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
}
