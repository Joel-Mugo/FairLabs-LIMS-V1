import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'primary' | 'amber' | 'green' | 'red';
}

export default function StatCard({ label, value, change, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    primary: { text: 'text-blue-600', bg: 'bg-blue-50' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    red: { text: 'text-red-600', bg: 'bg-red-50' },
  };

  const selectedColor = colorClasses[color];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-xl", selectedColor.bg)}>
            <Icon className={cn("w-6 h-6", selectedColor.text)} />
          </div>
          <div className={cn("text-sm font-medium", change.startsWith('+') ? 'text-green-600' : 'text-red-600')}>{change}</div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
