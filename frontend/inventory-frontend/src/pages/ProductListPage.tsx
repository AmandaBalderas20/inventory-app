import { useEffect, useState } from 'react'

import { ProductTable } from '../components/ProductTable/ProductTable'
import ProductFilters from '../components/ProductFilters/ProductFilters'
import ProductForm from '../components/ProductForm/ProductForm'
import InventoryMetrics from '../components/InventoryMetrics/InventoryMetrics'

import type { Product } from '../types/product'
import { deleteProduct, fetchPaginatedProducts, createProduct, updateProduct, fetchFilteredProducts} from '../services/productService'

import { Pagination, Stack } from '@mui/material'
import { Container, Typography, Box, Button } from '@mui/material'


export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
    const allCategories = [...new Set(products.map(p => p.category))]
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)


    function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this item?')) return

        deleteProduct(id)
            .then(() => {
                // Reload products after deletion
                return fetchPaginatedProducts(page, 10)
            })
            .then((data) => {
                setProducts(data.content)
                setTotalPages(data.totalPages)
            })
            .catch((err) => {
                console.error(err)
                alert('An error occurred while deleting the product')
            })
    }

    const handleToggleStock = async (id: number, outOfStock: boolean) => {
        const productToUpdate = products.find(p => p.id === id)
        if (!productToUpdate) return

        const updated = {
            ...productToUpdate,
            outOfStock,
            stockQuantity: outOfStock ? 0 : 10
        }

        try {
            await updateProduct(id, updated)
            const data = await fetchPaginatedProducts(page, 10)
            setProducts(data.content)
            setTotalPages(data.totalPages)
        } catch (err: any) {
            alert(err.message || 'Error updating product stock status')
        }
    }


    const handleSave = async (productData: Product) => {
        try {
            if (productData.id) {
            // If ID exists, update product
            await updateProduct(productData.id, productData);
            } else {
            // If no ID, create new product
            await createProduct(productData);
            }

            // Refresh products
            const updated = await fetchPaginatedProducts(page, 10);
            setProducts(updated.content);
            setTotalPages(updated.totalPages);

            // Close form dialog
            setIsFormOpen(false);
            setEditingProduct(undefined);
        } catch (err: any) {
            alert(err.message); // example: "A product with this name already exists"
        }
    };


    const handleSearch = async (filters: {
        name?: string
        categories?: string[]
        inStock?: boolean
    }) => {
        try {
        const results = await fetchFilteredProducts(filters)
        setProducts(results)
        } catch (err) {
        console.error(err)
        alert('Error fetching filtered products')
        }
    }

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchPaginatedProducts(page, 10);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
            alert("An error occurred while fetching products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true)
        fetchPaginatedProducts(page, 10)
        .then((data) => {
            setProducts(data.content)
            setTotalPages(data.totalPages)
        })
        .catch((err) => {
            console.error(err)
            alert("An error occurred while fetching products")
        })
        .finally(() => setLoading(false))
    }, [page])

    if (loading) return <p className="p-4">Loading...</p>

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    color: '#1e3d58'
                }}
            >
            Stockify
            </Typography>

            <Box mb={4}>
            <ProductFilters
                onSearch={(handleSearch)}
                existingCategories={allCategories}
            />
            </Box>

            <Box display="flex" justifyContent="flex-start" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                    setEditingProduct(undefined)
                    setIsFormOpen(true)
                    }}
                >
                    New Product
                </Button>
            </Box>

            <ProductForm
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                product={selectedProduct}
                existingCategories={[...new Set(products.map(p => p.category))]}
                onSave={async (updatedProduct) => {
                    try {
                    if (updatedProduct.id) {
                        await updateProduct(updatedProduct.id, updatedProduct)
                    } else {
                        await createProduct(updatedProduct)
                    }
                    await fetchProducts()  // refresh product list
                    } catch (error) {
                    console.error("Error saving product", error)
                    } finally {
                    setDialogOpen(false)
                    }
                }}
            />

            <ProductTable
                products={products}
                onEdit={(product) => {
                    setSelectedProduct(product)
                    setDialogOpen(true)
                }}
                onDelete={handleDelete}
                onToggleStock={handleToggleStock}
            />
            
            <Stack spacing={2} alignItems="center" mt={4}>
            <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                color="primary"
                variant="outlined"
            />
            </Stack>

            <ProductForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSave}
                product={editingProduct}
                existingCategories={[...new Set(products.map((p) => p.category))]}
            />

            <InventoryMetrics />
        </Container>
    )
}
