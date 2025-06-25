import { useEffect, useState } from 'react'

import { ProductTable } from '../components/ProductTable/ProductTable'
import ProductFilters from '../components/ProductFilters/ProductFilters'
import ProductForm from '../components/ProductForm/ProductForm'

import type { Product, PaginatedResponse } from '../types/product'
import { deleteProduct, fetchPaginatedProducts, createProduct, updateProduct} from '../services/productService'

import { Pagination, Stack } from '@mui/material'
import { Container, Typography, Box } from '@mui/material'


export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)

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
                onSearch={(filters) => {
                console.log('Filtros aplicados:', filters)
                }}
            />
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
                    await fetchProducts()  // refresca la tabla si tienes esta función
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
            onToggleStock={(id, inStock) =>
                alert(`Marcar ${id} como ${inStock ? 'en stock' : 'sin stock'}`)
            }
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
        </Container>
    )
}
