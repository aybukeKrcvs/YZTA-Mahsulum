import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Header from '../components/layout/Header'
import { getOrders, getPurchaseOrders, getAlerts } from '../api/client'
import trLocale from '@fullcalendar/core/locales/tr'

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getOrders(), getPurchaseOrders(), getAlerts()]).then(([o, po, a]) => {
      const orderEvents = o.data.map((order: any) => ({
        id: `order-${order.id}`,
        title: `🛒 ${order.customer_name}`,
        date: order.order_date.split('T')[0],
        backgroundColor: '#16a34a',
        borderColor: '#15803d',
      }))

      const poEvents = po.data
        .filter((p: any) => p.expected_delivery)
        .map((p: any) => ({
          id: `po-${p.id}`,
          title: `📦 Teslimat #${p.id}`,
          date: p.expected_delivery.split('T')[0],
          backgroundColor: '#f97316',
          borderColor: '#ea580c',
        }))

      const alertEvents = a.data
        .filter((al: any) => !al.is_read)
        .map((al: any) => ({
          id: `alert-${al.id}`,
          title: `🚨 ${al.message.slice(0, 30)}…`,
          date: al.created_at.split('T')[0],
          backgroundColor: '#dc2626',
          borderColor: '#b91c1c',
        }))

      setEvents([...orderEvents, ...poEvents, ...alertEvents])
    })
  }, [])

  return (
    <div>
      <Header title="Operasyon Takvimi" subtitle="Siparişler, teslimatlar ve uyarılar" />

      <div className="bg-white rounded-xl shadow-sm border border-earth-100 p-5">
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-primary-500 inline-block" /> Müşteri Siparişi
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-harvest-500 inline-block" /> Tedarik Teslimatı
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> Kritik Uyarı
          </span>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={trLocale}
          events={events}
          height={580}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          eventClick={(info) => {
            alert(info.event.title)
          }}
        />
      </div>
    </div>
  )
}