import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import AlertCard from '../components/cards/AlertCard'
import { getAlerts } from '../api/client'

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getAlerts().then(r => {
      setAlerts(r.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const unread = alerts.filter(a => !a.is_read)
  const read = alerts.filter(a => a.is_read)

  return (
    <div>
      <Header title="Uyarılar" subtitle={`${unread.length} okunmamış`} />
      <div className="max-w-2xl space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-earth-100 rounded-lg animate-pulse" />
          ))
        ) : (
          <>
            {unread.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-earth-700 mb-2">Okunmamış</p>
                <div className="space-y-2">
                  {unread.map(a => <AlertCard key={a.id} alert={a} onRead={load} />)}
                </div>
              </div>
            )}
            {read.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-earth-700 mb-2">Okunmuş</p>
                <div className="space-y-2">
                  {read.map(a => <AlertCard key={a.id} alert={a} onRead={load} />)}
                </div>
              </div>
            )}
            {alerts.length === 0 && (
              <p className="text-earth-700 text-center py-10">Uyarı bulunmuyor.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}