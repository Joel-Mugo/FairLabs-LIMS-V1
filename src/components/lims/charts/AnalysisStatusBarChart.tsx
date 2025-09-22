"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { analysisData } from "@/lib/data"

const chartConfig = {
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
}

export default function AnalysisStatusBarChart() {
  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysisData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
               <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
              <Bar dataKey="outOfSpec" fill="var(--color-outOfSpec)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
    </div>
  )
}
