import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

interface HistoryPoint { date: string; quantity: number }
interface ForecastPoint { date: string; predicted: number; lower_bound: number; upper_bound: number }

interface Props {
  history: HistoryPoint[]
  forecast: ForecastPoint[]
  productName: string
  unit: string
}

export default function ForecastChart({ history, forecast, productName, unit }: Props) {
  const historyData = history.slice(-30).map(h => ({
    date: h.date,
    label: format(parseISO(h.date), 'd MMM', { locale: tr }),
    actual: h.quantity,
    predicted: null,
    lower: null,
    upper: null,
  }))

  const forecastData = forecast.map(f => ({
    date: f.date,
    label: format(parseISO(f.date), 'd MMM', { locale: tr }),
    actual: null,
    predicted: f.predicted,
    lower: f.lower_bound,
    upper: f.upper_bound,
  }))

  const combined = [...historyData, ...forecastData]
  const todayLabel = format(new Date(), 'd MMM', { locale: tr })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(v: any, name: string) => {
            if (v === null) return ['-', '']
            const labels: Record<string, string> = {
              actual: 'Gerçek Satış',
              predicted: 'Tahmin',
              upper: 'Üst Sınır',
              lower: 'Alt Sınır',
            }
            return [`${v} ${unit}`, labels[name] || name]
          }}
        />
        <Legend
          formatter={(v) => ({
            actual: 'Gerçek Satış',
            predicted: 'Tahmin',
            upper: 'Güven Aralığı',
            lower: '',
          }[v] || v)}
        />
        <ReferenceLine x={todayLabel} stroke="#9ca3af" strokeDasharray="4 4" label={{ value: 'Bugün', fontSize: 11 }} />
        <Area dataKey="upper" fill="#16a34a" fillOpacity={0.1} stroke="none" name="upper" />
        <Area dataKey="lower" fill="#fafaf9" fillOpacity={1} stroke="none" name="lower" />
        <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2} dot={false} name="actual" />
        <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} name="predicted" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}