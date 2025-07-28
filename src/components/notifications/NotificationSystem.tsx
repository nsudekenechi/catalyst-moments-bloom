import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Heart, Activity, Users, Baby, Calendar, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'community' | 'wellness' | 'milestone';
  timestamp: Date;
  read: boolean;
  actionText?: string;
  actionUrl?: string;
  icon?: React.ReactNode;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Daily Wellness Check-in',
    message: "Don't forget to log your mood and energy levels for today!",
    type: 'reminder',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionText: 'Check In',
    actionUrl: '/wellness',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '2',
    title: 'Workout Streak Achievement! 🎉',
    message: "Amazing! You've completed workouts for 5 days in a row. Keep up the fantastic work!",
    type: 'achievement',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    actionText: 'View Progress',
    actionUrl: '/dashboard',
    icon: <Trophy className="h-4 w-4" />
  },
  {
    id: '3',
    title: 'New Community Post',
    message: "Sarah shared her postpartum recovery journey and received 12 encouraging comments!",
    type: 'community',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    actionText: 'Read Post',
    actionUrl: '/community',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '4',
    title: 'Your Baby is 12 Weeks Old!',
    message: "Time for a postpartum wellness milestone check-in. How are you feeling?",
    type: 'milestone',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    actionText: 'Wellness Check',
    actionUrl: '/wellness',
    icon: <Baby className="h-4 w-4" />
  },
  {
    id: '5',
    title: 'Gentle Reminder',
    message: "You haven't completed a workout in 3 days. How about a quick 10-minute session?",
    type: 'reminder',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    read: true,
    actionText: 'Browse Workouts',
    actionUrl: '/workouts',
    icon: <Activity className="h-4 w-4" />
  }
];

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly show motivational notifications
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const motivationalMessages = [
          "You're doing amazing! Every small step counts on your wellness journey.",
          "New moms in your area just completed their first workout this week!",
          "Remember to stay hydrated - your body needs extra water while breastfeeding.",
          "Take a deep breath. You've got this, mama! 💪",
          "3 moms just joined the community - welcome them by sharing your story!"
        ];
        
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        toast({
          title: "Wellness Reminder",
          description: randomMessage,
          duration: 5000,
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  // Show welcome notification on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('catalyst-welcome-shown');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        toast({
          title: "Welcome to Catalyst Mom! 🌟",
          description: "Your personalized wellness journey starts here. Let's create your first plan!",
          duration: 6000,
        });
        localStorage.setItem('catalyst-welcome-shown', 'true');
      }, 2000);
    }
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'community': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'wellness': return 'bg-green-100 text-green-800 border-green-200';
      case 'milestone': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notification Dropdown */}
        {isVisible && (
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-background border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {notification.actionText && notification.actionUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                markAsRead(notification.id);
                                window.location.href = notification.actionUrl!;
                              }}
                            >
                              {notification.actionText}
                            </Button>
                          )}
                          
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t bg-muted/30">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }}
                >
                  Mark all as read
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationSystem;