import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
})

export default api

// Ürünler
export const getProducts = (params?: { category?: string; status?: string }) =>
  api.get('/api/products/', { params })

export const getProduct = (id: number) =>
  api.get(`/api/products/${id}`)

export const getProductSalesHistory = (id: number, days = 90) =>
  api.get(`/api/products/${id}/sales-history`, { params: { days } })

export const getProductForecast = (id: number, days_ahead = 7) =>
  api.get(`/api/products/${id}/forecast`, { params: { days_ahead } })

// Tedarikçiler
export const getSuppliers = () =>
  api.get('/api/suppliers/')

// Siparişler
export const getOrders = (params?: { status?: string; date_from?: string; date_to?: string }) =>
  api.get('/api/orders/', { params })

// Satınalma Siparişleri
export const getPurchaseOrders = () =>
  api.get('/api/purchase-orders/')

export const createPurchaseDraft = (data: any) =>
  api.post('/api/purchase-orders/draft', data)

export const sendPurchaseOrder = (id: number) =>
  api.post(`/api/purchase-orders/${id}/send`)

// Analitik
export const getSalesTrend = (days = 30) =>
  api.get('/api/analytics/sales-trend', { params: { days } })

export const getTopProducts = (days = 30) =>
  api.get('/api/analytics/top-products', { params: { days } })

export const getCategoryBreakdown = (days = 30) =>
  api.get('/api/analytics/category-breakdown', { params: { days } })

export const getKPIs = () =>
  api.get('/api/analytics/kpis')

export const getHeatmap = (days = 90) =>
  api.get('/api/analytics/heatmap', { params: { days } })

// Uyarılar
export const getAlerts = (unread_only = false) =>
  api.get('/api/alerts/', { params: { unread_only } })

export const markAlertRead = (id: number) =>
  api.patch(`/api/alerts/${id}/read`)

// AI
export const getInsights = () =>
  api.get('/api/ai/insights')

export const getProductExplanation = (id: number) =>
  api.get(`/api/ai/products/${id}/explanation`)