import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  averageRevenuePerUser: number;
  subscriptionGrowth: number;
}

const RevenueSection = () => {
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRevenuePerUser: 0,
    subscriptionGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for revenue trends (in real app, this would come from payment processor)
  const revenueData = [
    { month: 'Jan', revenue: 187500, subscriptions: 8420 },
    { month: 'Feb', revenue: 245800, subscriptions: 9530 },
    { month: 'Mar', revenue: 298200, subscriptions: 10610 },
    { month: 'Apr', revenue: 332100, subscriptions: 11740 },
    { month: 'May', revenue: 365600, subscriptions: 12855 },
    { month: 'Jun', revenue: 418393, subscriptions: 13965 },
  ];

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Mock revenue data for demo (in real app, this would come from payment processor)
        setRevenueStats({
          totalRevenue: 1847593, // $1.8M+ in last 6 months
          monthlyRevenue: 307932, // ~$308K monthly average
          averageRevenuePerUser: 189.97,
          subscriptionGrowth: 34.8,
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value={`$${revenueStats.totalRevenue.toLocaleString()}`}
          subtitle="Last 6 months"
          colors={["#10B981", "#34D399", "#6EE7B7"]}
          delay={0.1}
        >
          <DollarSign className="h-8 w-8 text-green-500" />
        </DashboardCard>

        <DashboardCard
          title="Monthly Revenue"
          value={`$${revenueStats.monthlyRevenue.toLocaleString()}`}
          subtitle="Current month"
          colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
          delay={0.2}
        >
          <Calendar className="h-8 w-8 text-blue-500" />
        </DashboardCard>

        <DashboardCard
          title="ARPU"
          value={`$${revenueStats.averageRevenuePerUser.toFixed(2)}`}
          subtitle="Average Revenue Per User"
          colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
          delay={0.3}
        >
          <CreditCard className="h-8 w-8 text-purple-500" />
        </DashboardCard>

        <DashboardCard
          title="Growth Rate"
          value={`${revenueStats.subscriptionGrowth}%`}
          subtitle="Monthly subscription growth"
          colors={["#F59E0B", "#FBBF24", "#FCD34D"]}
          delay={0.4}
        >
          <TrendingUp className="h-8 w-8 text-orange-500" />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-primary">
                            Revenue: ${payload[0].value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Subscription Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-primary">
                            Subscriptions: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="subscriptions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { RevenueSection };