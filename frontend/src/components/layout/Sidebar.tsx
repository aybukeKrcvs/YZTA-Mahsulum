import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package,
  Calendar, Bell, Truck, Sprout
} from 'lucide-react'

interface SidebarProps {
  alertCount: number
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Panel' },
  { to: '/products', icon: Sprout, label: 'Ürünler' },
  { to: '/orders', icon: ShoppingCart, label: 'Siparişler' },
  { to: '/purchase-orders', icon: Truck, label: 'Tedarik' },
  { to: '/calendar', icon: Calendar, label: 'Takvim' },
]

export default function Sidebar({ alertCount }: SidebarProps) {
  return (
    <aside className="w-56 min-h-screen bg-primary-900 text-white flex flex-col fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-primary-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <div>
            <h1 className="font-bold text-lg leading-tight">mahsulüm</h1>
            <p className="text-primary-100 text-xs">Kooperatif Yönetimi</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-100 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {/* Uyarılar — badge ile */}
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-primary-100 hover:bg-primary-800 hover:text-white'
            }`
          }
        >
          <Bell size={18} />
          <span>Uyarılar</span>
          {alertCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {alertCount}
            </span>
          )}
        </NavLink>
      </nav>

      {/* Alt bilgi */}
      <div className="px-6 py-4 border-t border-primary-700">
        <p className="text-primary-300 text-xs">Polatlı Tarım Koop.</p>
        <p className="text-primary-400 text-xs">v1.0.0</p>
      </div>
    </aside>
  )
}