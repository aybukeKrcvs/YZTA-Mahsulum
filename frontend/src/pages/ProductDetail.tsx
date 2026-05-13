import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck } from 'lucide-react'
import Header from '../components/layout/Header'
import ForecastChart from '../components/charts/ForecastChart'
import EmailDraftModal from '../components/modals/EmailDraftModal'
import {
  getProduct, getProductSalesHistory, getProductForecast,
  getProductExplanation, getSuppliers, createPurchaseDraft
} from '../api/client'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [forecast, setForecast] = useState<any[]>([])
  const [explanation, setExplanation] = useState<string>('')
  const [explanationLoading, setExplanationLoading] = useState(true)
  const [modal, setModal] = useState<any>(null)
  const [draftLoading, setDraftLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    const pid = parseInt(id)

    Promise.all([
      getProduct(pid),
      getProductSalesHistory(pid, 90),
      getProductForecast(pid, 7)
    ]).then(([p, h, f]) => {
      setProduct(p.data)
      setHistory(h.data.history || [])
      setForecast(f.data.forecast || [])
    })

    getProductExplanation(pid).then(r => {
      setExplanation(r.data.explanation || '')
      setExplanationLoading(false)
    }).catch(() => setExplanationLoading(false))
  }, [id])

  const handleCreateDraft = async () => {
    if (!product) return
    setDraftLoading(true)
    try {
      const suppliers = await getSuppliers()
      const supplier = suppliers.data.find((s: any) => s.id === product.supplier?.id)
        || suppliers.data[0]

      const reorderQty = Math.max(
        product.target_stock - product.current_stock,
        product.critical_threshold * 2
      )

      const res = await createPurchaseDraft({
        supplier_id: supplier.id,
        items: [{
          product_id: product.id,
          product_name: product.name,
          quantity: Math.round(reorderQty),
          unit: product.unit,
          unit_cost: product.unit_cost
        }]
      })

      setModal({
        ...res.data,
        supplier: supplier
      })
    } catch (e) {
      console.error(e)
    }
    setDraftLoading(false)
  }

  if (!product) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-earth-700">Yükleniyor…</div>
    </div>
  )

  const statusColors: Record<string, string> = {
    ok: 'text-primary-600', warning: 'text-grain-600',
    critical: 'text-red-600', out_of_stock: 'text-gray-600'
  }

  return (
    <div>
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-1 text-earth-700 hover:text-earth-900 mb-4 text-sm"
      >
        <ArrowLeft size={15} /> Ürünlere Dön
      </button>

      <Header title={product.name} subtitle={`${product.category} · ${product.sku}`} />

      {/* Üst Bilgi */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Mevcut Stok', value: `${product.current_stock} ${product.unit}`,
            color: statusColors[product.stock_status] },
          { label: 'Kritik Eşik', value: `${product.critical_threshold} ${product.unit}`,
            color: 'text-earth-900' },
          { label: 'Günlük Ort. Satış', value: `${product.daily_avg_sales} ${product.unit}`,
            color: 'text-earth-900' },
          { label: 'Tahmini Tükenme', value: product.days_until_stockout
            ? `~${product.days_until_stockout} gün` : 'Belirsiz',
            color: product.days_until_stockout < 5 ? 'text-red-600' : 'text-earth-900' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-earth-100">
            <p className="text-earth-700 text-xs font-medium">{item.label}</p>
            <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-earth-100">
          <h3 className="font-bold text-earth-900 mb-4">Satış Geçmişi & 7 Günlük Tahmin</h3>
          <ForecastChart
            history={history}
            forecast={forecast}
            productName={product.name}
            unit={product.unit}
          />
        </div>

        {/* AI Yorum + CTA */}
        <div className="flex flex-col gap-4">
          <div className="bg-grain-50 border border-grain-400 rounded-xl p-5 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span>✨</span>
              <h3 className="font-bold text-earth-900 text-sm">Yapay Zeka Yorumu</h3>
            </div>
            {explanationLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-grain-200 rounded animate-pulse" />
                <div className="h-4 bg-grain-200 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-grain-200 rounded animate-pulse w-3/5" />
              </div>
            ) : (
              <p className="text-earth-700 text-sm leading-relaxed">{explanation}</p>
            )}
          </div>

          <button
            onClick={handleCreateDraft}
            disabled={draftLoading}
            className="w-full bg-harvest-500 hover:bg-harvest-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Truck size={18} />
            {draftLoading ? 'Hazırlanıyor…' : 'Tedarikçiye Sipariş Taslağı Oluştur'}
          </button>

          {/* Tedarikçi Bilgisi */}
          {product.supplier && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-earth-100">
              <p className="text-xs font-semibold text-earth-700 mb-1 uppercase">Tedarikçi</p>
              <p className="font-medium text-earth-900">{product.supplier.name}</p>
              <p className="text-xs text-earth-700 mt-0.5">
                Teslim süresi: {product.supplier.lead_time_days} gün
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {modal && (
        <EmailDraftModal
          purchaseOrder={modal}
          onClose={() => setModal(null)}
          onSent={() => setModal(null)}
        />
      )}
    </div>
  )
}