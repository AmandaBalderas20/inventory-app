import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { Product } from '../../types/product'
import type { SelectChangeEvent } from '@mui/material/Select'

interface Props {
    open: boolean
    onClose: () => void
    onSave: (product: Product) => void
    product?: Product
    existingCategories: string[]
}

export default function ProductFormDialog({
    open,
    onClose,
    onSave,
    product,
    existingCategories
}: Props) {
    const [form, setForm] = useState<Product>({
        id: 0,
        name: '',
        category: '',
        stockQuantity: 0,
        unitPrice: 0,
        expirationDate: '',
        outOfStock: false
    })

    const [customCategory, setCustomCategory] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleCategoryChange = (e: SelectChangeEvent<string>) => {
        const value = e.target.value
        if (value !== 'custom') {
            setCustomCategory('') // limpia si se cambia de opción
        }
        setForm((prev) => ({ ...prev, category: value }))
    }

    const handleSave = () => {
        const finalProduct: Product = {
            ...form,
            category: form.category === 'custom' ? customCategory : form.category,
        }
        onSave(finalProduct)
    }

    useEffect(() => {
        if (product) {
            setForm(product)
        } else {
            setForm({
                id: 0,
                name: '',
                category: '',
                stockQuantity: 0,
                unitPrice: 0,
                expirationDate: '',
                outOfStock: false
            })
            setCustomCategory('')
        }
    }, [product, open])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ mb: 1 }}>{product ? 'Edit Product' : 'New Product'}</DialogTitle>
        <DialogContent sx={{ px: 3, pt: 5, pb: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Name" name="name" value={form.name} onChange={handleInputChange} fullWidth />

            <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleCategoryChange}
            >
                {existingCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
                <MenuItem value="custom">Other (type manually)</MenuItem>
            </Select>
            </FormControl>

            {form.category === 'custom' && (
                <TextField
                    label="Custom Category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    fullWidth
                />
            )}

            <TextField
            label="Stock"
            name="stockQuantity"
            type="number"
            value={String(form.stockQuantity)}
            onChange={handleInputChange}
            fullWidth
            />

            <TextField
            label="Unit Price"
            name="unitPrice"
            type="number"
            value={String(form.unitPrice)}
            onChange={handleInputChange}
            fullWidth
            />

            <TextField
            label="Expiration Date"
            name="expirationDate"
            type="date"
            value={form.expirationDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            inputProps={{
                min: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0],
            }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
                variant="contained"
                onClick={handleSave}
                disabled={!form.name || !form.category || form.unitPrice < 0 || form.stockQuantity < 0}
            >
                {product ? 'Update' : 'Save'}
            </Button>
        </DialogActions>
        </Dialog>
    )
}
