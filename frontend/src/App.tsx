import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Orders from './pages/Orders'
import PurchaseOrders from './pages/PurchaseOrders'
import CalendarPage from './pages/Calendar'
import Alerts from './pages/Alerts'
import { getAlerts } from './api/client'

export default function App() {
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    getAlerts(true).then(r => setAlertCount(r.data.length)).catch(() => {})
    const interval = setInterval(() => {
      getAlerts(true).then(r => setAlertCount(r.data.length)).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-earth-50">
        <Sidebar alertCount={alertCount} />
        <main className="flex-1 ml-56 p-6 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}