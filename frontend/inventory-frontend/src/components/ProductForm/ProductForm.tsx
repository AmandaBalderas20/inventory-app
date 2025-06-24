import { useForm } from 'react-hook-form'
import type { ProductFormInput } from '../../types/product'

type Props = {
    initialData?: ProductFormInput
    onSubmit: (data: ProductFormInput) => void
    onCancel?: () => void
}

const categoryOptions = ['Beverages', 'Snacks', 'Fruits'] // esto se puede traer de la API después

export function ProductForm({ initialData, onSubmit, onCancel }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormInput>({
        defaultValues: initialData ?? {
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        expirationDate: '',
        },
    })

    return (
        <div className="min-h-screen bg-white text-black p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4 p-4 border border-gray-400 rounded shadow-sm">
            <div>
                <label className="block mb-1">Name</label>
                <input
                className="w-full border p-2"
                {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            <div className="flex justify-end space-x-4 mt-4">
                <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                Save
                </button>
                {onCancel && (
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                )}
            </div>
            </form>
        </div>        
    )
}
