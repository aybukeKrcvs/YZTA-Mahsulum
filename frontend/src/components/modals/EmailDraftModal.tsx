import { useState } from 'react'
import { sendPurchaseOrder } from '../../api/client'
import { X, Send, CheckCircle } from 'lucide-react'

interface Props {
  purchaseOrder: {
    id: number
    supplier: { name: string; email: string }
    items: any[]
    ai_generated_email: string
    total_estimated_cost: number
  }
  onClose: () => void
  onSent: () => void
}

export default function EmailDraftModal({ purchaseOrder, onClose, onSent }: Props) {
  const [emailText, setEmailText] = useState(purchaseOrder.ai_generated_email || '')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    await sendPurchaseOrder(purchaseOrder.id)
    setSent(true)
    setLoading(false)
    setTimeout(() => { onSent(); onClose() }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-bold text-earth-900 text-lg">📧 Tedarikçi Sipariş Maili</h3>
            <p className="text-sm text-earth-700">
              {purchaseOrder.supplier?.name} — {purchaseOrder.supplier?.email}
            </p>
          </div>
          <button onClick={onClose} className="text-earth-700 hover:text-earth-900">
            <X size={20} />
          </button>
        </div>

        {/* Ürün listesi */}
        <div className="px-6 py-3 bg-earth-50 border-b">
          <p className="text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wide">Sipariş Kalemleri</p>
          <div className="space-y-1">
            {purchaseOrder.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-earth-900">{item.product_name}</span>
                <span className="text-earth-700 font-medium">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-earth-700 mt-2">
            Tahmini tutar: <span className="font-semibold text-primary-600">
              {purchaseOrder.total_estimated_cost.toLocaleString('tr-TR')} ₺
            </span>
          </p>
        </div>

        {/* Mail içeriği */}
        <div className="px-6 py-4 flex-1 overflow-auto">
          <p className="text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wide">
            ✨ Gemini tarafından hazırlandı — düzenleyebilirsiniz
          </p>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={48} className="text-primary-500 mb-3" />
              <p className="font-bold text-earth-900 text-lg">Mail Gönderildi!</p>
              <p className="text-earth-700 text-sm">Sipariş durumu "Gönderildi" olarak güncellendi.</p>
            </div>
          ) : (
            <textarea
              value={emailText}
              onChange={e => setEmailText(e.target.value)}
              className="w-full h-48 p-3 border border-earth-200 rounded-lg text-sm text-earth-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-earth-700 hover:text-earth-900 border border-earth-200 rounded-lg"
            >
              İptal
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={15} />
              {loading ? 'Gönderiliyor…' : 'Gönder (Simülasyon)'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}