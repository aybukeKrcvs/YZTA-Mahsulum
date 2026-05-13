import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface Props {
  data: { product_name: string; total_quantity: number; total_revenue: number }[]
}

export default function TopProductsChart({ data }: Props) {
  const top = data.slice(0, 8).map(d => ({
    name: d.product_name.length > 10 ? d.product_name.slice(0, 10) + '…' : d.product_name,
    miktar: Math.round(d.total_quantity),
    ciro: Math.round(d.total_revenue)
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={top} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
        <Tooltip formatter={(v: number) => [`${v} kg`, 'Miktar']} />
        <Bar dataKey="miktar" fill="#f97316" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}