import { ProductForm } from '../components/ProductForm/ProductForm'
import type { ProductFormInput } from '../types/product'

export default function TestFormPage() {
    const handleSubmit = (data: ProductFormInput) => {
        console.log('Product sent:', data)
        alert(`Product created: ${JSON.stringify(data, null, 2)}`)
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Create Product</h1>
            <ProductForm onSubmit={handleSubmit} />
        </div>
    )
}
