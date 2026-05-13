import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Package, AlertTriangle, ShoppingCart } from 'lucide-react'
import Header from '../components/layout/Header'
import KPICard from '../components/cards/KPICard'
import InsightCard from '../components/cards/InsightCard'
import SalesTrendChart from '../components/charts/SalesTrendChart'
import TopProductsChart from '../components/charts/TopProductsChart'
import CategoryDonut from '../components/charts/CategoryDonut'
import {
  getKPIs, getSalesTrend, getTopProducts,
  getCategoryBreakdown, getInsights, getProducts
} from '../api/client'

export default function Dashboard() {
  const navigate = useNavigate()
  const [kpis, setKpis] = useState<any>(null)
  const [trend, setTrend] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [criticalProducts, setCriticalProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getKPIs(), getSalesTrend(30), getTopProducts(30),
      getCategoryBreakdown(30), getProducts({ status: 'critical' })
    ]).then(([k, t, tp, cat, cp]) => {
      setKpis(k.data)
      setTrend(t.data)
      setTopProducts(tp.data)
      setCategories(cat.data)
      setCriticalProducts(cp.data)
      setLoading(false)
    })

    getInsights().then(r => {
      setInsights(r.data.insights || [])
      setInsightsLoading(false)
    }).catch(() => setInsightsLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-earth-700">Yükleniyor…</div>
    </div>
  )

  return (
    <div>
      <Header title="Genel Bakış" subtitle="Polatlı Tarım Kooperatifi" />

      {/* KPI Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Aylık Ciro"
          value={`${(kpis?.monthly_revenue || 0).toLocaleString('tr-TR')} ₺`}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Aktif Ürün"
          value={kpis?.total_products || 0}
          subtitle="toplam ürün"
          icon={Package}
          color="yellow"
        />
        <KPICard
          title="Kritik Stok"
          value={kpis?.critical_stock_count || 0}
          subtitle="ürün kritik seviyede"
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Bugün Sipariş"
          value={kpis?.today_orders || 0}
          subtitle="yeni sipariş"
          icon={ShoppingCart}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI İçgörüler */}
        <div className="lg:col-span-1 bg-white rounded-xl p-5 shadow-sm border border-earth-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <h3 className="font-bold text-earth-900">Yapay Zeka İçgörüleri</h3>
          </div>
          {insightsLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 bg-earth-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <InsightCard key={i} {...ins} />
              ))}
              {insights.length === 0 && (
                <p className="text-earth-700 text-sm">İçgörüler yüklenemedi.</p>
              )}
            </div>
          )}
        </div>

        {/* Satış Trendi */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-earth-100">
          <h3 className="font-bold text-earth-900 mb-4">Satış Trendi (Son 30 Gün)</h3>
          <SalesTrendChart data={trend} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Ürünler */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-earth-100">
          <h3 className="font-bold text-earth-900 mb-4">En Çok Satan Ürünler (Son 30 Gün)</h3>
          <TopProductsChart data={topProducts} />
        </div>

        {/* Kategori Dağılımı */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-earth-100">
          <h3 className="font-bold text-earth-900 mb-4">Kategori Dağılımı</h3>
          <CategoryDonut data={categories} />
        </div>
      </div>

      {/* Kritik Stok */}
      {criticalProducts.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
          <h3 className="font-bold text-red-700 mb-4">🚨 Kritik Stok Uyarıları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalProducts.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="border border-red-200 bg-red-50 rounded-lg p-3 cursor-pointer hover:bg-red-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-earth-900 text-sm">{p.name}</p>
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">KRİTİK</span>
                </div>
                <p className="text-earth-700 text-sm mt-1">
                  Stok: <span className="font-bold text-red-600">{p.current_stock} {p.unit}</span>
                  <span className="text-earth-500"> / Eşik: {p.critical_threshold} {p.unit}</span>
                </p>
                {p.days_until_stockout && (
                  <p className="text-xs text-red-600 mt-1">~{p.days_until_stockout} günde tükenir</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}