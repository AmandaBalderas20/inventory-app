import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText } from '@mui/material'
import { useState } from 'react'

type Props = {
    onSearch: (filters: { name: string; categories: string[]; inStock?: boolean }) => void
}

const categoriesList = ['Food', 'Clothing', 'Electronics']


export default function ProductFilters({ onSearch }: Props) {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState<string[]>([])
    const [availability, setAvailability] = useState('all')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch({
        name,
        categories,
        inStock:
            availability === 'in' ? true : availability === 'out' ? false : undefined,
        })
    }

    return (
    <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            padding: 2,
            marginBottom: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
        }}
        >
        <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
        />

        <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
            multiple
            value={categories}
            onChange={(e) => setCategories(e.target.value as string[])}
            input={<OutlinedInput label="Category" />}
            renderValue={(selected) => selected.join(', ')}
            >
            {categoriesList.map((cat) => (
                <MenuItem key={cat} value={cat}>
                <Checkbox checked={categories.includes(cat)} />
                <ListItemText primary={cat} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Availability</InputLabel>
            <Select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            label="Availability"
            >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="inStock">In Stock</MenuItem>
            <MenuItem value="outOfStock">Out of Stock</MenuItem>
            </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
            Search
        </Button>

        <Button variant="outlined" color="secondary">
            New Product
        </Button>
        </Box>
    )
}
