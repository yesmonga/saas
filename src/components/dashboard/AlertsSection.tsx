"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Heart, CheckCircle, Clock } from "lucide-react"

interface Alert {
  type: "danger" | "warning" | "success" | "info"
  message: string
  count?: number
}

interface AlertsSectionProps {
  alerts: Alert[]
}

const alertConfig = {
  danger: {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  warning: {
    icon: Heart,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  success: {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  info: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  if (alerts.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.type]
          const Icon = config.icon

          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-xl p-3 ${config.bg}`}
            >
              <Icon className={`h-5 w-5 ${config.color}`} />
              <span className="text-sm text-zinc-300">{alert.message}</span>
              {alert.count !== undefined && (
                <span className={`ml-auto text-sm font-medium ${config.color}`}>
                  {alert.count}
                </span>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
