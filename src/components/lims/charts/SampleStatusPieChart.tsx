"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { statusData } from "@/lib/data"

const chartConfig = {
  samples: {
    label: "Samples",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-4))",
  },
  outOfSpec: {
    label: "Out of Spec",
    color: "hsl(var(--destructive))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-1))",
  },
}

const COLORS = {
  'Approved': "hsl(var(--chart-2))",
  'Pending': "hsl(var(--chart-4))",
  'Out of Spec': "hsl(var(--destructive))",
  'In Progress': "hsl(var(--chart-1))",
};


export default function SampleStatusPieChart() {
  const totalSamples = React.useMemo(() => {
    return statusData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <div className="h-[250px] w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full"
      >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
          >
           {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
           <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
        </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
