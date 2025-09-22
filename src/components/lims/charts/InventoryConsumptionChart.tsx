
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { InventoryItem } from "@/lib/types"
import { useMemo } from "react"

export default function InventoryConsumptionChart({ inventory }: { inventory: InventoryItem[] }) {
  const chartData = useMemo(() => {
    const consumptionByProduct: Record<string, { name: string; consumption: number }> = {};

    inventory.forEach(item => {
      item.consumption.forEach(log => {
        if (!consumptionByProduct[log.productAnalyzed]) {
          consumptionByProduct[log.productAnalyzed] = {
            name: log.productAnalyzed,
            consumption: 0,
            // We can add specific reagent consumption here if needed
            [item.name]: 0,
          };
        }
        // For simplicity, we're summing up total units consumed per product.
        // A more complex chart could stack different reagents.
        consumptionByProduct[log.productAnalyzed][item.name] = (consumptionByProduct[log.productAnalyzed][item.name] || 0) + log.amount;
      });
    });
    
    // Let's create a simpler chart: total consumption per reagent
    const consumptionByReagent = inventory.map(item => ({
        name: item.name,
        consumption: item.consumption.reduce((acc, curr) => acc + curr.amount, 0)
    })).filter(d => d.consumption > 0);


    return consumptionByReagent;
  }, [inventory]);
  
  const chartConfig = useMemo(() => {
    const config: any = {};
    inventory.forEach(item => {
        config[item.name] = {
            label: item.name,
            color: `hsl(var(--chart-${(inventory.indexOf(item) % 5) + 1}))`
        }
    });
    return config;
  }, [inventory]);

  
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No consumption data to display yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 20 }} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={150}
              />
              <XAxis type="number" />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
               <ChartLegend content={<ChartLegendContent />} />
               <Bar dataKey="consumption" fill="var(--color-consumption, hsl(var(--chart-1)))" radius={4} name="Total Consumption" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
    </div>
  )
}

    
