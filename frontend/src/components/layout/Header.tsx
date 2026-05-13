interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-earth-900">{title}</h2>
          {subtitle && <p className="text-earth-700 text-sm mt-0.5">{subtitle}</p>}
        </div>
        <p className="text-earth-700 text-sm hidden md:block">{dateStr}</p>
      </div>
    </div>
  )
}