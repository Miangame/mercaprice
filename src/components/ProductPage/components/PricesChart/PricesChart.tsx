import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useTheme } from 'styled-components'

import { Title, Wrapper } from './PricesChart.styled'

interface PricesChartProps {
  title: string
  priceHistory: {
    recordedAt: string
    price: number
  }[]
}

export const PricesChart = ({ title, priceHistory }: PricesChartProps) => {
  const theme = useTheme()

  const chartData = priceHistory.map((entry) => ({
    Fecha: new Date(entry.recordedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric'
    }),
    Precio: entry.price
  }))

  return (
    <Wrapper>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="Fecha" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Precio"
            stroke={theme.colors.primary}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  )
}
