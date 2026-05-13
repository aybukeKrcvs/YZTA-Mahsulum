import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Props {
  data: { date: string; quantity: number; revenue: number }[]
}

export default function SalesTrendChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    label: format(parseISO(d.date), 'd MMM', { locale: tr }),
    revenue: Math.round(d.revenue)
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={6} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number, name: string) => [
            name === 'revenue' ? `${value.toLocaleString('tr-TR')} ₺` : `${value} kg`,
            name === 'revenue' ? 'Ciro' : 'Miktar'
          ]}
        />
        <Legend formatter={(v) => v === 'revenue' ? 'Ciro (₺)' : 'Miktar (kg)'} />
        <Bar yAxisId="left" dataKey="quantity" fill="#16a34a" opacity={0.7} name="quantity" />
        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} name="revenue" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}