import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import EmailDraftModal from '../components/modals/EmailDraftModal'
import { getPurchaseOrders, getSuppliers } from '../api/client'

const statusLabel: Record<string, { label: string; style: string }> = {
  draft:     { label: 'Taslak',     style: 'bg-grain-100 text-grain-700' },
  sent:      { label: 'Gönderildi', style: 'bg-primary-100 text-primary-700' },
  received:  { label: 'Alındı',     style: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'İptal',      style: 'bg-gray-100 text-gray-700' },
}

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([getPurchaseOrders(), getSuppliers()]).then(([po, s]) => {
      setOrders(po.data)
      setSuppliers(s.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const getSupplier = (id: number) => suppliers.find(s => s.id === id)

  return (
    <div>
      <Header title="Tedarik Siparişleri" subtitle="Gemini tarafından hazırlanan sipariş taslakları" />

      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-earth-50 border-b border-earth-200">
            <tr>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">#</th>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">Tedarikçi</th>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">Ürünler</th>
              <th className="text-right px-4 py-3 text-earth-700 font-semibold">Tahmini Tutar</th>
              <th className="text-center px-4 py-3 text-earth-700 font-semibold">Durum</th>
              <th className="text-center px-4 py-3 text-earth-700 font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-earth-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-earth-700 py-10">
                  Henüz tedarik siparişi yok.<br />
                  <span className="text-sm">Ürün detayından sipariş taslağı oluşturabilirsiniz.</span>
                </td>
              </tr>
            ) : orders.map(o => {
              const supplier = getSupplier(o.supplier_id)
              const s = statusLabel[o.status] || statusLabel.draft
              const itemSummary = o.items?.map((i: any) => `${i.product_name} (${i.quantity} ${i.unit})`).join(', ')
              return (
                <tr key={o.id} className="hover:bg-earth-50 transition-colors">
                  <td className="px-4 py-3 text-earth-700">#{o.id}</td>
                  <td className="px-4 py-3 font-medium text-earth-900">{supplier?.name || '—'}</td>
                  <td className="px-4 py-3 text-earth-700 max-w-xs truncate">{itemSummary}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {o.total_estimated_cost.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.style}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {o.ai_generated_email && (
                      <button
                        onClick={() => setModal({ ...o, supplier })}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Maili Görüntüle
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <EmailDraftModal
          purchaseOrder={modal}
          onClose={() => setModal(null)}
          onSent={load}
        />
      )}
    </div>
  )
}