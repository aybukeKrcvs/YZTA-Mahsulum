import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  data: { category: string; quantity: number; percentage: number }[]
}

const COLORS = ['#16a34a', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899']

export default function CategoryDonut({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          dataKey="quantity"
          nameKey="category"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${v ?? 0} kg`, 'Miktar']} />
        <Legend
          formatter={(value, entry: any) =>
            `${value} (%${entry.payload.percentage})`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  )
}