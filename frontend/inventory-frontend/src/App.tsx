import './App.css'
// import TestFormPage from './pages/TestFormPage'
import ProductListPage from './pages/ProductListPage'

export default function App() {
  //return <TestFormPage />
  //return <ProductListPage />
  return(
    <div className="min-h-screen bg-white text-black p-8">
      <ProductListPage />
    </div>
  )
}
