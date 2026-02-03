import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useTheme } from 'styled-components'
import { motion } from 'framer-motion'
import { useState } from 'react'

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
  const [animationComplete, setAnimationComplete] = useState(false)

  const chartData = priceHistory.map((entry) => ({
    Fecha: new Date(entry.recordedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric'
    }),
    Precio: entry.price
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => setAnimationComplete(true)}
    >
      <Wrapper>
        <Title>{title}</Title>
        <ResponsiveContainer width="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.colors.primary}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={theme.colors.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="Fecha"
              stroke={theme.colors.textLight}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={theme.colors.textLight}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: theme.colors.shadow.md
              }}
            />
            <Line
              type="monotone"
              dataKey="Precio"
              stroke={theme.colors.primary}
              strokeWidth={3}
              dot={{
                fill: theme.colors.primary,
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0
              }}
              animationDuration={1000}
              animationEasing="ease-out"
              isAnimationActive={animationComplete}
            />
          </LineChart>
        </ResponsiveContainer>
      </Wrapper>
    </motion.div>
  )
}
