import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Award } from 'lucide-react';

interface UserWithPoints {
  user_id: string;
  email: string;
  display_name: string;
  total_points: number;
  level: number;
  created_at: string;
}

export const UserPointsManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithPoints[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithPoints | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const [reason, setReason] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users_with_points');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsAdjustment = async () => {
    if (!selectedUser || !pointsAdjustment || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsAdjusting(true);
    try {
      const { error } = await supabase.rpc('admin_adjust_user_points', {
        target_user_id: selectedUser.user_id,
        points_adjustment: parseInt(pointsAdjustment),
        reason: reason
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Points adjusted for ${selectedUser.display_name || selectedUser.email}`,
      });

      // Refresh user data
      await fetchUsers();
      
      // Reset form
      setSelectedUser(null);
      setPointsAdjustment('');
      setReason('');
    } catch (error) {
      console.error('Error adjusting points:', error);
      toast({
        title: "Error",
        description: "Failed to adjust points",
        variant: "destructive",
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
          <Award className="h-5 w-5" />
          User Points Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="font-medium">
                      {user.display_name || 'Unknown User'}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.total_points}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{user.level}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Adjust Points
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Adjust Points for {user.display_name || user.email}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Current Points</label>
                            <div className="text-2xl font-bold text-primary">
                              {user.total_points}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Points Adjustment</label>
                            <Input
                              type="number"
                              placeholder="Enter points to add/remove (use negative for removal)"
                              value={pointsAdjustment}
                              onChange={(e) => setPointsAdjustment(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Reason</label>
                            <Textarea
                              placeholder="Explain why you're adjusting points..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={handlePointsAdjustment}
                            disabled={isAdjusting}
                            className="w-full"
                          >
                            {isAdjusting ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Apply Adjustment
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
      </CardContent>
    </Card>
  );
};