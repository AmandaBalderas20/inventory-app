import { useEffect, useState } from 'react'
import { fetchInventoryMetrics } from '../../services/productService'
import type { InventoryMetric } from '../../types/metrics'
import type { Product } from '../../types/product'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
    } from '@mui/material'

    type Props = {
        products: Product[]
    }

export default function InventoryMetrics({ products }: Props) {
    const [metrics, setMetrics] = useState<InventoryMetric[]>([])

    useEffect(() => {
        fetchInventoryMetrics()
        .then(setMetrics)
        .catch((err) => {
            console.error(err)
            alert("Failed to load inventory metrics")
        })
    }, [])

    return (
        <div>
        <Typography
            variant="h6"
            gutterBottom
            sx={{
                fontWeight: 'bold',
                marginTop: 2,
                color: '#1e3d58'
            }}
        >
            Inventory Metrics
        </Typography>
        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="center"><strong>Total Products</strong></TableCell>
                <TableCell align="center"><strong>Total Value</strong></TableCell>
                <TableCell align="center"><strong>Average Price</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {metrics.map((metric) => (
                <TableRow key={metric.category}>
                    <TableCell>{metric.category}</TableCell>
                    <TableCell align="center">{metric.totalProducts}</TableCell>
                    <TableCell align="center">${metric.totalValue.toFixed(2)}</TableCell>
                    <TableCell align="center">${metric.averagePrice.toFixed(2)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </div>
    )
}
