import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { BulkAffiliateApproval } from './BulkAffiliateApproval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  Eye,
  Check,
  X,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AffiliateStats {
  totalAffiliates: number;
  pendingApplications: number;
  totalCommissions: number;
  conversionRate: number;
}

interface AffiliateApplication {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  socialFollowers: string;
}

const AffiliateSection = () => {
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats>({
    totalAffiliates: 0,
    pendingApplications: 0,
    totalCommissions: 0,
    conversionRate: 0,
  });
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      // Mock affiliate data for demo
      setAffiliateStats({
        totalAffiliates: 847,
        pendingApplications: 23,
        totalCommissions: 89547,
        conversionRate: 12.8,
      });

      setApplications([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@instagram.com',
          status: 'pending',
          appliedDate: '2024-01-15',
          socialFollowers: '45K'
        },
        {
          id: '2',
          name: 'Emma Williams',
          email: 'emma@tiktok.com',
          status: 'approved',
          appliedDate: '2024-01-14',
          socialFollowers: '89K'
        },
        {
          id: '3',
          name: 'Lisa Chen',
          email: 'lisa@youtube.com',
          status: 'pending',
          appliedDate: '2024-01-13',
          socialFollowers: '156K'
        },
        {
          id: '4',
          name: 'Maria Rodriguez',
          email: 'maria@blog.com',
          status: 'rejected',
          appliedDate: '2024-01-12',
          socialFollowers: '2.3K'
        },
        {
          id: '5',
          name: 'Jennifer Kim',
          email: 'jen@pinterest.com',
          status: 'approved',
          appliedDate: '2024-01-11',
          socialFollowers: '67K'
        }
      ]);

      setLoading(false);
    };

    fetchAffiliateData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (loading) {
    return <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Affiliates"
          value={affiliateStats.totalAffiliates.toLocaleString()}
          subtitle="Active affiliate partners"
          colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
          delay={0.1}
        >
          <Users className="h-8 w-8 text-blue-500" />
        </DashboardCard>

        <DashboardCard
          title="Pending Applications"
          value={affiliateStats.pendingApplications}
          subtitle="Awaiting review"
          colors={["#F59E0B", "#FBBF24", "#FCD34D"]}
          delay={0.2}
        >
          <Clock className="h-8 w-8 text-orange-500" />
        </DashboardCard>

        <DashboardCard
          title="Total Commissions"
          value={`$${affiliateStats.totalCommissions.toLocaleString()}`}
          subtitle="Paid to affiliates"
          colors={["#10B981", "#34D399", "#6EE7B7"]}
          delay={0.3}
        >
          <DollarSign className="h-8 w-8 text-green-500" />
        </DashboardCard>

        <DashboardCard
          title="Conversion Rate"
          value={`${affiliateStats.conversionRate}%`}
          subtitle="Avg affiliate performance"
          colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
          delay={0.4}
        >
          <TrendingUp className="h-8 w-8 text-purple-500" />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <BulkAffiliateApproval />
        </motion.div>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 6).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{app.name}</h4>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.socialFollowers} followers • Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(app.status)}
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { AffiliateSection };