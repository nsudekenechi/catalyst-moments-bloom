import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimeData {
  date: string;
  minutes: number;
}

interface TimeSpentChartProps {
  data: TimeData[];
  totalMinutes: number;
  avgSessionMinutes: number;
}

export const TimeSpentChart = ({ data, totalMinutes, avgSessionMinutes }: TimeSpentChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Time Spent Practicing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
              <div className="text-sm text-muted-foreground">Total Minutes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{avgSessionMinutes}</div>
              <div className="text-sm text-muted-foreground">Avg Session</div>
            </div>
          </div>

          {/* Chart */}
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                />
                <YAxis />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} min`, 'Duration']}
                />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Start practicing to see your progress!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};