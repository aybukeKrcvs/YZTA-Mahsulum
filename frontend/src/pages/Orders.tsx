import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import { getOrders } from '../api/client'

const statusLabel: Record<string, { label: string; style: string }> = {
  pending:    { label: 'Bekliyor',     style: 'bg-grain-100 text-grain-700' },
  processing: { label: 'Hazırlanıyor', style: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Kargoda',      style: 'bg-harvest-100 text-harvest-600' },
  delivered:  { label: 'Teslim',       style: 'bg-primary-100 text-primary-700' },
  cancelled:  { label: 'İptal',        style: 'bg-gray-100 text-gray-700' },
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(r => {
      setOrders(r.data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Header title="Siparişler" subtitle={`${orders.length} sipariş`} />
      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-earth-50 border-b border-earth-200">
            <tr>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">#</th>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">Müşteri</th>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">Tarih</th>
              <th className="text-right px-4 py-3 text-earth-700 font-semibold">Tutar</th>
              <th className="text-center px-4 py-3 text-earth-700 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-100">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-earth-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.map(o => {
              const s = statusLabel[o.status] || statusLabel.pending
              return (
                <tr key={o.id} className="hover:bg-earth-50 transition-colors">
                  <td className="px-4 py-3 text-earth-700">#{o.id}</td>
                  <td className="px-4 py-3 font-medium text-earth-900">{o.customer_name}</td>
                  <td className="px-4 py-3 text-earth-700">
                    {new Date(o.order_date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-earth-900">
                    {o.total_amount.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.style}`}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}