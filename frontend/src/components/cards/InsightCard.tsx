interface InsightCardProps {
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
}

const severityMap = {
  info:     { bg: 'bg-grain-50',   border: 'border-grain-400',   dot: 'bg-grain-500',   icon: '💡' },
  warning:  { bg: 'bg-harvest-50', border: 'border-harvest-400', dot: 'bg-harvest-500', icon: '⚠️' },
  critical: { bg: 'bg-red-50',     border: 'border-red-400',     dot: 'bg-red-500',     icon: '🚨' },
}

export default function InsightCard({ title, message, severity }: InsightCardProps) {
  const s = severityMap[severity] || severityMap.info
  return (
    <div className={`${s.bg} border-l-4 ${s.border} rounded-r-lg p-3`}>
      <div className="flex items-start gap-2">
        <span className="text-base leading-tight">{s.icon}</span>
        <div>
          <p className="font-semibold text-earth-900 text-sm">{title}</p>
          <p className="text-earth-700 text-sm mt-0.5">{message}</p>
        </div>
      </div>
    </div>
  )
}