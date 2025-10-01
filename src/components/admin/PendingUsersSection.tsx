import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, UserCheck, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PendingUser {
  user_id: string;
  email: string;
  display_name: string;
  motherhood_stage: string;
  created_at: string;
}

export const PendingUsersSection: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [bonusPoints, setBonusPoints] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_pending_users');
      
      if (error) throw error;
      
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Error",
        description: "Failed to load pending users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (userId: string, additionalPoints?: number) => {
    setIsApproving(userId);
    try {
      // First approve the user (which gives 50 welcome points)
      const { error: approveError } = await supabase.rpc('approve_user', {
        user_id_param: userId
      });

      if (approveError) throw approveError;

      // If admin wants to give additional bonus points
      if (additionalPoints && additionalPoints > 0) {
        const { error: pointsError } = await supabase.rpc('admin_adjust_user_points', {
          target_user_id: userId,
          points_adjustment: additionalPoints,
          reason: 'Bonus points awarded during approval'
        });

        if (pointsError) throw pointsError;
      }

      toast({
        title: "User Approved!",
        description: `User has been approved and received ${50 + (additionalPoints || 0)} welcome points.`,
      });

      // Refresh pending users list
      await fetchPendingUsers();
      
      // Clear bonus points input
      setBonusPoints(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    } finally {
      setIsApproving(null);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending User Approvals
          {pendingUsers.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingUsers.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No pending user approvals</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Journey Stage</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.display_name || 'Unknown User'}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.motherhood_stage || 'Not specified'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm"
                            disabled={isApproving === user.user_id}
                          >
                            {isApproving === user.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <UserCheck className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Approve {user.display_name || user.email}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm font-medium mb-2">Default Welcome Package:</p>
                              <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>✓ Account approval</li>
                                <li>✓ 50 welcome points</li>
                                <li>✓ Full access to community</li>
                              </ul>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Bonus Points (Optional)</label>
                              <Input
                                type="number"
                                placeholder="Enter additional bonus points"
                                value={bonusPoints[user.user_id] || ''}
                                onChange={(e) => setBonusPoints(prev => ({
                                  ...prev,
                                  [user.user_id]: e.target.value
                                }))}
                                min="0"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                User will receive 50 welcome points + any bonus points you add
                              </p>
                            </div>
                            <Button 
                              onClick={() => handleApproveUser(
                                user.user_id, 
                                parseInt(bonusPoints[user.user_id] || '0')
                              )}
                              disabled={isApproving === user.user_id}
                              className="w-full"
                            >
                              {isApproving === user.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <UserCheck className="h-4 w-4 mr-2" />
                              )}
                              Approve User
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};