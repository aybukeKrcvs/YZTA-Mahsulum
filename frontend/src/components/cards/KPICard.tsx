import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: 'green' | 'orange' | 'red' | 'yellow'
}

const colorMap = {
  green:  { bg: 'bg-primary-50',  icon: 'bg-primary-500',  text: 'text-primary-700' },
  orange: { bg: 'bg-harvest-50',  icon: 'bg-harvest-500',  text: 'text-harvest-600' },
  red:    { bg: 'bg-red-50',      icon: 'bg-red-500',      text: 'text-red-700' },
  yellow: { bg: 'bg-grain-50',    icon: 'bg-grain-500',    text: 'text-grain-700' },
}

export default function KPICard({ title, value, subtitle, icon: Icon, color }: KPICardProps) {
  const c = colorMap[color]
  return (
    <div className={`${c.bg} rounded-xl p-5 flex items-center gap-4`}>
      <div className={`${c.icon} p-3 rounded-lg`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-earth-700 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
        {subtitle && <p className="text-earth-700 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}