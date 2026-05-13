import { markAlertRead } from '../../api/client'

interface AlertCardProps {
  alert: {
    id: number
    alert_type: string
    message: string
    severity: string
    is_read: boolean
    created_at: string
    product_id?: number
  }
  onRead: () => void
}

const severityStyle: Record<string, string> = {
  critical: 'border-red-400 bg-red-50',
  warning:  'border-harvest-400 bg-harvest-50',
  info:     'border-grain-400 bg-grain-50',
}

export default function AlertCard({ alert, onRead }: AlertCardProps) {
  const handleRead = async () => {
    await markAlertRead(alert.id)
    onRead()
  }

  return (
    <div className={`border-l-4 rounded-r-lg p-3 ${severityStyle[alert.severity] || severityStyle.info} ${alert.is_read ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start">
        <p className="text-sm text-earth-900 font-medium flex-1">{alert.message}</p>
        {!alert.is_read && (
          <button
            onClick={handleRead}
            className="ml-2 text-xs text-primary-600 hover:underline shrink-0"
          >
            Okundu
          </button>
        )}
      </div>
      <p className="text-xs text-earth-700 mt-1">
        {new Date(alert.created_at).toLocaleDateString('tr-TR')}
      </p>
    </div>
  )
}