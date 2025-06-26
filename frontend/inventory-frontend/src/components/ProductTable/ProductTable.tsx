import type { Product } from '../../types/product';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Button,
    Typography,
    TableSortLabel
} from '@mui/material';

type Props = {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (id: number) => void
    onToggleStock: (id: number, inStock: boolean) => void
    sortBy1: string
    direction1: 'asc' | 'desc'
    sortBy2: string
    direction2: 'asc' | 'desc'
    onSortChange: (column: string) => void
}

export function ProductTable({
    products,
    onEdit,
    onDelete,
    onToggleStock,
    sortBy1,
    direction1,
    sortBy2,
    direction2,
    onSortChange
}: Props) {

    const columnLabels = {
        category: 'Category',
        name: 'Name',
        unitPrice: 'Price',
        expirationDate: 'Expiration Date',
        stockQuantity: 'Stock'
    }
    const renderStockStyle = (quantity: number) => {
        if (quantity < 5) return 'red'
        if (quantity < 10) return 'orange'
        return ''
    }

    const renderExpirationColor = (exp?: string) => {
        if (!exp) return ''
        const now = new Date()
        const date = new Date(exp)
        const diffDays = (date.getTime() - now.getTime()) / (1000 * 3600 * 24)

        if (diffDays < 7) return '#ffe6e6' // red
        if (diffDays < 14) return '#fff9c4' // yellow
        return '#e8f5e9' // green
    }

    const renderSortLabel = (column: string) => {
        let active = false
        let direction: 'asc' | 'desc' = 'asc'

        if (sortBy1 === column) {
            active = true
            direction = direction1
        } else if (sortBy2 === column) {
            active = true
            direction = direction2
        }
        return (
        <TableSortLabel
            active={active}
            direction={direction}
            onClick={() => onSortChange(column)}
        >
            {columnLabels[column as keyof typeof columnLabels] || column}
        </TableSortLabel>
        )
    }

    return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table size="small">
            <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell align="center"/>
                    <TableCell align="center">{renderSortLabel('category')}</TableCell>
                    <TableCell align="center">{renderSortLabel('name')}</TableCell>
                    <TableCell align="center">{renderSortLabel('unitPrice')}</TableCell>
                    <TableCell align="center">{renderSortLabel('expirationDate')}</TableCell>
                    <TableCell align="center">{renderSortLabel('stockQuantity')}</TableCell>
                    <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {products.map((p) => {
                const isOutOfStock = p.stockQuantity === 0
                return (
                    <TableRow
                        key={p.id}
                        sx={{
                            backgroundColor: renderExpirationColor(p.expirationDate),
                            borderBottom: '1px solid #ccc',
                        }}
                    >
                        <TableCell align="center">
                        <Checkbox
                            checked={isOutOfStock}
                            onChange={(e) =>
                                onToggleStock(Number(p.id), e.target.checked)
                            }
                            inputProps={{ 'aria-label': 'Toggle stock status' }}
                        />
                        </TableCell>
                        <TableCell align="center">{p.category}</TableCell>
                        <TableCell align="center">
                        <Typography
                            sx={{
                            textDecoration: isOutOfStock ? 'line-through' : 'none',
                            color: isOutOfStock ? 'gray' : 'inherit',
                            }}
                        >
                            {p.name}
                        </Typography>
                        </TableCell>
                        <TableCell align="center">
                        {typeof p.unitPrice === 'number'
                        ? `$${p.unitPrice.toFixed(2)}`
                            : '—'}
                        </TableCell>
                        <TableCell align="center">{p.expirationDate ?? '—'}</TableCell>
                        <TableCell align="center" sx={{ color: renderStockStyle(p.stockQuantity) }}>
                        {p.stockQuantity}
                        </TableCell>
                        <TableCell align="center">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => onEdit(p)}
                            sx={{ mr: 1 }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="text"
                            color="error"
                            onClick={() => onDelete(Number(p.id))}
                        >
                            Delete
                        </Button>
                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </TableContainer>
    )
}
