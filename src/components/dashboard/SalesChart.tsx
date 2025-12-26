"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface SalesChartProps {
  data: { date: string; sales: number; revenue: number }[]
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des ventes (30 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis
                dataKey="date"
                stroke="#71717A"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717A"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  border: "1px solid #27272A",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#A1A1AA" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#8B5CF6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
