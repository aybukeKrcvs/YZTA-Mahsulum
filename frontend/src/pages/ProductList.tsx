import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import Header from '../components/layout/Header'
import { getProducts } from '../api/client'

const statusLabel: Record<string, { label: string; style: string }> = {
  ok:           { label: 'Normal',   style: 'bg-primary-100 text-primary-700' },
  warning:      { label: 'Uyarı',    style: 'bg-grain-100 text-grain-700' },
  critical:     { label: 'Kritik',   style: 'bg-red-100 text-red-700' },
  out_of_stock: { label: 'Tükendi',  style: 'bg-gray-100 text-gray-700' },
}

export default function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(r => {
      setProducts(r.data)
      setLoading(false)
    })
  }, [])

  const categories = [...new Set(products.map(p => p.category))]

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.stock_status === filterStatus
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchStatus && matchCat
  })

  return (
    <div>
      <Header title="Ürünler" subtitle={`${products.length} ürün`} />

      {/* Filtreler */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-earth-700" />
          <input
            type="text"
            placeholder="Ürün ara…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-earth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-earth-200 rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-earth-200 rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="">Tüm Durumlar</option>
          <option value="critical">Kritik</option>
          <option value="warning">Uyarı</option>
          <option value="ok">Normal</option>
        </select>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-earth-50 border-b border-earth-200">
            <tr>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">Ürün</th>
              <th className="text-left px-4 py-3 text-earth-700 font-semibold">Kategori</th>
              <th className="text-right px-4 py-3 text-earth-700 font-semibold">Mevcut Stok</th>
              <th className="text-right px-4 py-3 text-earth-700 font-semibold">Kritik Eşik</th>
              <th className="text-right px-4 py-3 text-earth-700 font-semibold">Kalan Gün</th>
              <th className="text-center px-4 py-3 text-earth-700 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-earth-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.map(p => {
              const s = statusLabel[p.stock_status] || statusLabel.ok
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="hover:bg-earth-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-earth-900">{p.name}</td>
                  <td className="px-4 py-3 text-earth-700">{p.category}</td>
                  <td className="px-4 py-3 text-right font-semibold text-earth-900">
                    {p.current_stock} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-earth-700">
                    {p.critical_threshold} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-earth-700">
                    {p.days_until_stockout ? `~${p.days_until_stockout} gün` : '—'}
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
        {!loading && filtered.length === 0 && (
          <p className="text-center text-earth-700 py-8">Ürün bulunamadı.</p>
        )}
      </div>
    </div>
  )
}